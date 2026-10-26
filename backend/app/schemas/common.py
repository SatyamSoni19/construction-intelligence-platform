"""Shared enums and models used across multiple feature schemas."""

from enum import Enum

from pydantic import BaseModel


class Severity(str, Enum):
    """How severe the detected issue is."""

    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Urgency(str, Enum):
    """How urgently the issue should be addressed."""

    monitor = "monitor"
    within_month = "within_month"
    within_week = "within_week"
    immediate = "immediate"


class ErrorResponse(BaseModel):
    """Standard error payload returned by the API."""

    detail: str
