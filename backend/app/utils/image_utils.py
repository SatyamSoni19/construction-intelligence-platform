"""Utilities for validating, resizing, and base64-encoding uploaded images."""

import base64
import io

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

from app.config import get_settings

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


async def prepare_image(upload: UploadFile) -> tuple[str, str]:
    """Read an uploaded image, normalise it, and return (base64_str, media_type).

    Validation:
    - Content type must be jpeg, png, or webp (HTTP 415).
    - File size must be within max_upload_mb (HTTP 413).
    - File must be a valid image Pillow can open (HTTP 400).

    Processing:
    - Fix EXIF rotation so the image is right-side up.
    - Convert to RGB (drop alpha / palette).
    - Downscale so the longest side <= max_image_side.
    - Re-encode as JPEG quality 85.
    """
    settings = get_settings()

    # --- content type check ---
    if upload.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=(
                f"Unsupported image type '{upload.content_type}'. "
                f"Accepted: {', '.join(sorted(ALLOWED_TYPES))}."
            ),
        )

    # --- read raw bytes & size check ---
    raw = await upload.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(raw) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({len(raw) / 1_048_576:.1f} MB). Max is {settings.max_upload_mb} MB.",
        )

    # --- open & validate with Pillow ---
    try:
        img = Image.open(io.BytesIO(raw))
        img.load()  # force decode so corrupt files fail here
    except (UnidentifiedImageError, Exception) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot decode image: {exc}",
        )

    # --- normalise ---
    img = ImageOps.exif_transpose(img)  # fix rotation
    img = img.convert("RGB")

    # downscale if needed, preserving aspect ratio
    max_side = settings.max_image_side
    if max(img.size) > max_side:
        img.thumbnail((max_side, max_side), Image.LANCZOS)

    # --- re-encode as JPEG ---
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    b64 = base64.standard_b64encode(buf.getvalue()).decode("ascii")

    return b64, "image/jpeg"
