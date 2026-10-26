import io
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app
from app.schemas.common import Severity, Urgency
from app.schemas.cracks import CrackAnalysis, CrackType


@pytest.fixture
def client():
    return TestClient(app)


def create_test_png() -> bytes:
    """Generate a small valid 100x100 PNG image in memory."""
    img = Image.new("RGB", (100, 100), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def mock_crack_analysis():
    return CrackAnalysis(
        crack_detected=True,
        crack_type=CrackType.vertical,
        severity=Severity.medium,
        confidence=0.85,
        location_description="Vertical crack along exterior masonry wall near corner",
        estimated_width_mm=1.5,
        probable_causes=["Thermal movement", "Minor foundation settlement"],
        risk_assessment="Moderate risk of moisture intrusion. Structure remains stable.",
        recommended_actions=["Install crack monitor gauge", "Seal crack against water ingress"],
        urgency=Urgency.within_month,
        requires_professional_inspection=False,
        summary="A 1.5mm vertical crack detected on exterior masonry wall.",
    )


def test_analyze_cracks_success(client, mock_crack_analysis):
    """Test successful image analysis with valid PNG."""
    image_bytes = create_test_png()

    with patch(
        "app.routers.cracks.generate_structured",
        new_callable=AsyncMock,
        return_value=mock_crack_analysis,
    ) as mock_generate:
        response = client.post(
            "/api/cracks/analyze",
            files={"file": ("wall.png", image_bytes, "image/png")},
            data={"notes": "South-facing wall on 2nd floor"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["crack_detected"] is True
        assert data["crack_type"] == "vertical"
        assert data["severity"] == "medium"
        assert data["confidence"] == 0.85
        assert data["estimated_width_mm"] == 1.5
        assert mock_generate.await_count == 1


def test_analyze_cracks_unsupported_media_type(client):
    """Test rejection with 415 when uploading a non-image file (.txt)."""
    response = client.post(
        "/api/cracks/analyze",
        files={"file": ("report.txt", b"just a text report", "text/plain")},
    )

    assert response.status_code == 415
    assert "Unsupported image type" in response.json()["detail"]


def test_analyze_cracks_corrupt_image(client):
    """Test rejection with 400 when uploading an image with corrupt binary content."""
    corrupt_bytes = b"GIF89a corrupted invalid image stream that Pillow cannot decode"

    response = client.post(
        "/api/cracks/analyze",
        files={"file": ("broken.png", corrupt_bytes, "image/png")},
    )

    assert response.status_code == 400
    assert "Cannot decode image" in response.json()["detail"]
