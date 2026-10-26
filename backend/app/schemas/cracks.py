"""Pydantic models for the Crack Detection feature — strict JSON contract."""

from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.common import Severity, Urgency


class CrackType(str, Enum):
    """Classification of the observed crack pattern."""

    hairline = "hairline"
    vertical = "vertical"
    horizontal = "horizontal"
    diagonal = "diagonal"
    stair_step = "stair_step"
    map_cracking = "map_cracking"
    shrinkage = "shrinkage"
    structural = "structural"
    other = "other"
    none = "none"


class CrackAnalysis(BaseModel):
    """Full analysis result returned by the crack-detection endpoint.

    When crack_detected is False the model must still populate every field
    (crack_type should be "none" and lists may be empty).
    """

    crack_detected: bool
    crack_type: CrackType
    severity: Severity
    confidence: float = Field(ge=0.0, le=1.0)
    location_description: str
    estimated_width_mm: float | None = None
    probable_causes: list[str]
    risk_assessment: str
    recommended_actions: list[str]
    urgency: Urgency
    requires_professional_inspection: bool
    summary: str
