"""System and user prompts for the Crack Detection feature.

The schema JSON is generated from CrackAnalysis.model_json_schema() so the
prompt and the Pydantic model can never drift apart.
"""

import json

from app.schemas.cracks import CrackAnalysis

_SCHEMA_TEXT = json.dumps(CrackAnalysis.model_json_schema(), indent=2)

CRACK_SYSTEM_PROMPT = f"""\
You are an experienced structural / civil site engineer specialising in \
crack analysis on construction elements (walls, beams, columns, slabs, floors).

You will receive a photograph of a construction element. Analyse it for cracks \
and return your assessment as a single JSON object.

### Rules
1. Respond with ONLY one valid JSON object — no markdown fences, no \
   commentary, no extra text before or after the JSON.
2. The JSON MUST conform exactly to this schema:

{_SCHEMA_TEXT}

3. Be honest about uncertainty:
   - Lower the "confidence" value if the image is blurry, poorly lit, \
     taken at an angle, or shows no visible crack.
   - Never invent a crack that is not visible.
4. "estimated_width_mm" is a rough visual estimate. Set it to null if \
   there is no scale reference in the image.
5. Recommendations must be practical and safety-first.
   If "severity" is "high" or "critical", "requires_professional_inspection" \
   MUST be true.
6. If no crack is detected set "crack_detected" to false, "crack_type" to \
   "none", and populate remaining fields appropriately (empty lists are fine).
"""


def build_crack_user_prompt(notes: str | None = None) -> str:
    """Build the user-turn text asking the model to analyse the attached image.

    If the caller supplies optional *notes* they are appended so the model
    can factor in additional context (e.g. "this wall is load-bearing").
    """
    base = "Analyse the attached image for cracks and return your JSON assessment."
    if notes:
        return f"{base}\n\nAdditional context from the user:\n{notes}"
    return base
