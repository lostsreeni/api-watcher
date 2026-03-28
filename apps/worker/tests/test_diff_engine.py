import json
from diff_engine import generate_diff, generate_changelog_summary


def test_openapi_endpoint_removed():
    old = json.dumps({"paths": {"/users": {"get": {}}}})
    new = json.dumps({"paths": {}})

    changes = generate_diff("openapi", old, new)
    assert len(changes) == 1
    assert changes[0]["type"] == "endpoint_removed"
    assert changes[0]["severity"] == "breaking"


def test_openapi_parameter_made_required():
    old = json.dumps(
        {
            "paths": {
                "/users": {
                    "get": {
                        "parameters": [{"name": "id", "in": "query", "required": False}]
                    }
                }
            }
        }
    )
    new = json.dumps(
        {
            "paths": {
                "/users": {
                    "get": {
                        "parameters": [{"name": "id", "in": "query", "required": True}]
                    }
                }
            }
        }
    )

    changes = generate_diff("openapi", old, new)
    assert len(changes) == 1
    assert changes[0]["type"] == "parameter_required"
    assert changes[0]["severity"] == "breaking"


def test_openapi_parameter_added_optional():
    old = json.dumps({"paths": {"/users": {"get": {}}}})
    new = json.dumps(
        {
            "paths": {
                "/users": {
                    "get": {
                        "parameters": [{"name": "id", "in": "query", "required": False}]
                    }
                }
            }
        }
    )

    changes = generate_diff("openapi", old, new)
    assert len(changes) == 1
    assert changes[0]["type"] == "parameter_added"
    assert changes[0]["severity"] == "added"


def test_openapi_parameter_added_required():
    old = json.dumps({"paths": {"/users": {"get": {}}}})
    new = json.dumps(
        {
            "paths": {
                "/users": {
                    "get": {
                        "parameters": [{"name": "id", "in": "query", "required": True}]
                    }
                }
            }
        }
    )

    changes = generate_diff("openapi", old, new)
    assert len(changes) == 1
    assert changes[0]["type"] == "parameter_added"
    assert changes[0]["severity"] == "breaking"


def test_docs_diff():
    old = json.dumps(
        {"title": "Old Title", "blocks": [{"type": "text", "content": "A"}]}
    )
    new = json.dumps(
        {
            "title": "New Title",
            "blocks": [
                {"type": "text", "content": "A"},
                {"type": "text", "content": "B"},
            ],
        }
    )

    changes = generate_diff("docs", old, new)
    assert len(changes) == 2

    types = [c["type"] for c in changes]
    assert "title_changed" in types
    assert "docs_section_changed" in types

    for c in changes:
        assert c["severity"] == "informational"


def test_changelog_summary():
    changes = [
        {
            "type": "endpoint_removed",
            "severity": "breaking",
            "details": "Endpoint '/users' was removed.",
        },
        {
            "type": "endpoint_added",
            "severity": "added",
            "details": "Endpoint '/orgs' was added.",
        },
    ]
    summary = generate_changelog_summary(changes)

    assert "### 🚨 Breaking Changes" in summary
    assert "- Endpoint '/users' was removed." in summary
    assert "### ✨ Added" in summary
    assert "- Endpoint '/orgs' was added." in summary
