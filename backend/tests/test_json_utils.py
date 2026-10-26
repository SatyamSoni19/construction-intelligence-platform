import pytest
from app.utils.json_utils import extract_json


def test_extract_clean_json():
    text = '{"name": "test", "value": 123, "active": true}'
    result = extract_json(text)
    assert result == {"name": "test", "value": 123, "active": True}


def test_extract_json_in_fences():
    text = """```json
{"crack_detected": true, "severity": "low"}
```"""
    result = extract_json(text)
    assert result == {"crack_detected": True, "severity": "low"}


def test_extract_json_with_surrounding_text():
    text = """Here is the analysis of the image you provided:
{"crack_detected": false, "crack_type": "none", "severity": "low"}
I hope this helps!"""
    result = extract_json(text)
    assert result == {
        "crack_detected": False,
        "crack_type": "none",
        "severity": "low",
    }


def test_extract_invalid_text_raises_value_error():
    text = "Sorry, I cannot analyze this image as it is not related to construction."
    with pytest.raises(ValueError, match="No JSON object found"):
        extract_json(text)


def test_extract_malformed_json_raises_value_error():
    text = '{"crack_detected": true, broken_json: }'
    with pytest.raises(ValueError, match="Malformed JSON"):
        extract_json(text)
