"""Reusable service for calling Anthropic Claude and parsing structured JSON.

This module is feature-agnostic — any router can import `generate_structured`
and pass its own system prompt, user text, and Pydantic response model.
"""

import logging

import anthropic
from pydantic import BaseModel, ValidationError

from app.config import get_settings
from app.utils.json_utils import extract_json

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Custom exception
# ---------------------------------------------------------------------------

class LLMServiceError(Exception):
    """Raised when the LLM call or response parsing fails unrecoverably."""


# ---------------------------------------------------------------------------
# Module-level client (lazy singleton)
# ---------------------------------------------------------------------------

_client: anthropic.AsyncAnthropic | None = None


def _get_client() -> anthropic.AsyncAnthropic:
    """Return (and cache) an AsyncAnthropic client using the configured key."""
    global _client
    if _client is None:
        settings = get_settings()
        _client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    return _client


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def generate_structured(
    system_prompt: str,
    user_text: str,
    response_model: type[BaseModel],
    image_b64: str | None = None,
    media_type: str | None = None,
) -> BaseModel:
    """Call Claude and return a validated Pydantic model instance.

    Parameters
    ----------
    system_prompt : str
        The system-turn instruction (persona + rules + JSON schema).
    user_text : str
        The user-turn message (question / task description).
    response_model : type[BaseModel]
        The Pydantic v2 model to validate the parsed JSON against.
    image_b64 : str | None
        Optional base64-encoded image to include in the user turn.
    media_type : str | None
        MIME type of the image (e.g. "image/jpeg"). Required when
        *image_b64* is provided.

    Returns
    -------
    BaseModel
        An instance of *response_model* populated from the model output.

    Raises
    ------
    LLMServiceError
        If the API call fails, the response cannot be parsed as JSON, or
        validation against *response_model* fails after one retry.
    """
    settings = get_settings()
    client = _get_client()

    # -- build user-turn content blocks ------------------------------------
    content: list[dict] = []

    if image_b64 and media_type:
        content.append(
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": image_b64,
                },
            }
        )

    content.append({"type": "text", "text": user_text})

    # -- first attempt -----------------------------------------------------
    raw_text = await _call_api(client, system_prompt, content, settings)
    result, error = _parse_and_validate(raw_text, response_model)
    if result is not None:
        return result

    # -- retry once: feed the error back to the model ----------------------
    logger.warning("First parse/validate failed, retrying: %s", error)
    retry_text = (
        f"{user_text}\n\n"
        f"Your previous response had a validation error:\n{error}\n"
        "Please return ONLY a corrected JSON object."
    )
    retry_content: list[dict] = []
    if image_b64 and media_type:
        retry_content.append(content[0])  # re-attach the same image block
    retry_content.append({"type": "text", "text": retry_text})

    raw_text_2 = await _call_api(client, system_prompt, retry_content, settings)
    result_2, error_2 = _parse_and_validate(raw_text_2, response_model)
    if result_2 is not None:
        return result_2

    raise LLMServiceError(
        f"LLM output failed validation after retry. Last error: {error_2}"
    )


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

async def _call_api(
    client: anthropic.AsyncAnthropic,
    system_prompt: str,
    content: list[dict],
    settings,
) -> str:
    """Make the raw API call and return the assistant's text."""
    try:
        response = await client.messages.create(
            model=settings.model_name,
            max_tokens=settings.max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": content}],
        )
        return response.content[0].text
    except anthropic.APIConnectionError as exc:
        raise LLMServiceError(f"Could not connect to Anthropic API: {exc}") from exc
    except anthropic.APIError as exc:
        # Never log the full exception repr — it may contain the key in headers.
        raise LLMServiceError(
            f"Anthropic API error (status {getattr(exc, 'status_code', '?')}): {exc.message}"
        ) from exc


def _parse_and_validate(
    raw_text: str,
    response_model: type[BaseModel],
) -> tuple[BaseModel | None, str | None]:
    """Try to extract JSON and validate; return (model, None) or (None, error)."""
    try:
        data = extract_json(raw_text)
        return response_model.model_validate(data), None
    except (ValueError, ValidationError) as exc:
        return None, str(exc)
