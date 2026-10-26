"""Utilities for extracting structured JSON from LLM text output."""

import json
import re


def extract_json(text: str) -> dict:
    """Pull the first JSON object from *text*, tolerating markdown fences and prose.

    Strategy:
    1. Strip ```json ... ``` fences if present.
    2. Find the substring from the first '{' to the last '}'.
    3. Parse with json.loads.

    Raises ValueError with a clear message if no JSON object is found or
    the JSON is malformed.
    """
    # Strip optional markdown code fences
    cleaned = re.sub(r"```(?:json)?\s*", "", text)
    cleaned = cleaned.replace("```", "")

    first = cleaned.find("{")
    last = cleaned.rfind("}")

    if first == -1 or last == -1 or last < first:
        raise ValueError(
            f"No JSON object found in model output. Raw text starts with: {text[:120]!r}"
        )

    candidate = cleaned[first : last + 1]

    try:
        return json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Malformed JSON in model output: {exc}. "
            f"Extracted candidate starts with: {candidate[:120]!r}"
        ) from exc
