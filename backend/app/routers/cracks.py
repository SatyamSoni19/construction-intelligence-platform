"""Crack Detection API router.

POST /api/cracks/analyze — upload a photo and receive a structured
CrackAnalysis JSON response powered by the multimodal LLM.
"""

from fastapi import APIRouter, Form, HTTPException, UploadFile

from app.prompts.crack_prompt import CRACK_SYSTEM_PROMPT, build_crack_user_prompt
from app.schemas.cracks import CrackAnalysis
from app.services.llm_service import LLMServiceError, generate_structured
from app.utils.image_utils import prepare_image

router = APIRouter(prefix="/api/cracks", tags=["Crack Detection"])


@router.post(
    "/analyze",
    response_model=CrackAnalysis,
    summary="Analyse an image for structural cracks",
    responses={
        400: {"description": "Invalid image file"},
        413: {"description": "File too large"},
        415: {"description": "Unsupported image type"},
        502: {"description": "LLM service error"},
    },
)
async def analyze_cracks(
    file: UploadFile,
    notes: str | None = Form(None),
) -> CrackAnalysis:
    """Accept an image upload, run it through the LLM, and return a crack analysis."""

    # Validate & preprocess the uploaded image
    image_b64, media_type = await prepare_image(file)

    # Build the user-turn prompt
    user_prompt = build_crack_user_prompt(notes)

    # Call the LLM and parse the structured response
    try:
        result = await generate_structured(
            system_prompt=CRACK_SYSTEM_PROMPT,
            user_text=user_prompt,
            response_model=CrackAnalysis,
            image_b64=image_b64,
            media_type=media_type,
        )
    except LLMServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    return result
