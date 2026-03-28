import json
from typing import Dict, List, Any


def diff_openapi(
    old_parsed: Dict[str, Any], new_parsed: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Compares two parsed OpenAPI snapshots and returns a list of change records.
    Each record: {"type": "endpoint_added", "path": str, "method": str, "details": str}
    """
    changes = []

    old_paths = old_parsed.get("paths", {})
    new_paths = new_parsed.get("paths", {})

    # Check for removed endpoints/paths
    for path in old_paths:
        if path not in new_paths:
            changes.append(
                {
                    "type": "endpoint_removed",
                    "path": path,
                    "method": None,
                    "details": f"Endpoint '{path}' was removed.",
                }
            )
            continue

        old_methods = old_paths[path]
        new_methods = new_paths[path]

        # Check for removed methods
        for method in old_methods:
            if method not in new_methods:
                changes.append(
                    {
                        "type": "method_removed",
                        "path": path,
                        "method": method,
                        "details": f"Method '{method.upper()}' was removed from '{path}'.",
                    }
                )
                continue

            # Compare parameters
            old_params = old_methods[method].get("parameters", [])
            new_params = new_methods[method].get("parameters", [])

            # Simple list comparison by name and in
            old_params_dict = {
                f"{p.get('name')}: {p.get('in')}": p
                for p in old_params
                if isinstance(p, dict)
            }
            new_params_dict = {
                f"{p.get('name')}: {p.get('in')}": p
                for p in new_params
                if isinstance(p, dict)
            }

            for p_key, p_val in old_params_dict.items():
                if p_key not in new_params_dict:
                    changes.append(
                        {
                            "type": "parameter_removed",
                            "path": path,
                            "method": method,
                            "details": f"Parameter '{p_val.get('name')}' in '{p_val.get('in')}' was removed.",
                        }
                    )
                else:
                    # Check if it became required
                    old_req = p_val.get("required", False)
                    new_req = new_params_dict[p_key].get("required", False)
                    if not old_req and new_req:
                        changes.append(
                            {
                                "type": "parameter_required",
                                "path": path,
                                "method": method,
                                "details": f"Parameter '{p_val.get('name')}' in '{p_val.get('in')}' is now required.",
                            }
                        )

            for p_key, p_val in new_params_dict.items():
                if p_key not in old_params_dict:
                    changes.append(
                        {
                            "type": "parameter_added",
                            "path": path,
                            "method": method,
                            "details": f"Parameter '{p_val.get('name')}' in '{p_val.get('in')}' was added.",
                            "required": p_val.get("required", False),
                        }
                    )

            # Compare responses (very basic)
            old_responses = old_methods[method].get("responses", {})
            new_responses = new_methods[method].get("responses", {})

            for status_code in old_responses:
                if status_code not in new_responses:
                    changes.append(
                        {
                            "type": "response_removed",
                            "path": path,
                            "method": method,
                            "details": f"Response '{status_code}' was removed.",
                        }
                    )

            for status_code in new_responses:
                if status_code not in old_responses:
                    changes.append(
                        {
                            "type": "response_added",
                            "path": path,
                            "method": method,
                            "details": f"Response '{status_code}' was added.",
                        }
                    )

    # Check for added endpoints/paths
    for path in new_paths:
        if path not in old_paths:
            changes.append(
                {
                    "type": "endpoint_added",
                    "path": path,
                    "method": None,
                    "details": f"Endpoint '{path}' was added.",
                }
            )
        else:
            old_methods = old_paths[path]
            new_methods = new_paths[path]
            for method in new_methods:
                if method not in old_methods:
                    changes.append(
                        {
                            "type": "method_added",
                            "path": path,
                            "method": method,
                            "details": f"Method '{method.upper()}' was added to '{path}'.",
                        }
                    )

    return changes


def diff_docs(
    old_parsed: Dict[str, Any], new_parsed: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Compares two parsed docs snapshots.
    """
    changes = []
    old_title = old_parsed.get("title", "")
    new_title = new_parsed.get("title", "")

    if old_title != new_title:
        changes.append(
            {
                "type": "title_changed",
                "details": f"Title changed from '{old_title}' to '{new_title}'",
            }
        )

    old_blocks = old_parsed.get("blocks", [])
    new_blocks = new_parsed.get("blocks", [])

    # Very basic block comparison
    old_texts = [b.get("content") for b in old_blocks if b.get("type") == "text"]
    new_texts = [b.get("content") for b in new_blocks if b.get("type") == "text"]

    added_texts = set(new_texts) - set(old_texts)
    removed_texts = set(old_texts) - set(new_texts)

    if added_texts or removed_texts:
        changes.append(
            {
                "type": "docs_section_changed",
                "details": f"{len(added_texts)} text blocks added, {len(removed_texts)} removed.",
            }
        )

    return changes


def classify_openapi_change(change: Dict[str, Any]) -> str:
    """
    Classifies a change record for OpenAPI as 'added', 'modified', 'removed', or 'breaking'.
    """
    t = change.get("type", "")

    if t == "endpoint_removed":
        return "breaking"
    elif t == "method_removed":
        return "breaking"
    elif t == "response_removed":
        return "breaking"
    elif t == "parameter_removed":
        return "breaking"
    elif t == "parameter_required":
        return "breaking"
    elif t == "parameter_added":
        if change.get("required", False):
            return "breaking"
        return "added"
    elif t == "endpoint_added" or t == "method_added" or t == "response_added":
        return "added"

    return "modified"


def classify_docs_change(change: Dict[str, Any]) -> str:
    """
    Classifies a change record for Docs.
    """
    t = change.get("type", "")
    if t == "title_changed":
        return "informational"
    elif t == "docs_section_changed":
        return "informational"

    return "modified"


def generate_changelog_summary(changes: List[Dict[str, Any]]) -> str:
    """
    Generates a readable markdown summary of the changes.
    """
    if not changes:
        return "No changes detected."

    summary = []
    breaking = [c for c in changes if c.get("severity") == "breaking"]
    added = [c for c in changes if c.get("severity") == "added"]
    modified = [c for c in changes if c.get("severity") == "modified"]
    informational = [c for c in changes if c.get("severity") == "informational"]

    if breaking:
        summary.append("### 🚨 Breaking Changes")
        for c in breaking:
            summary.append(f"- {c.get('details')}")

    if added:
        summary.append("### ✨ Added")
        for c in added:
            summary.append(f"- {c.get('details')}")

    if modified:
        summary.append("### 📝 Modified")
        for c in modified:
            summary.append(f"- {c.get('details')}")

    if informational:
        summary.append("### ℹ️ Informational")
        for c in informational:
            summary.append(f"- {c.get('details')}")

    return "\n".join(summary)


def generate_diff(
    source_type: str, old_content: str, new_content: str
) -> List[Dict[str, Any]]:
    old_parsed = json.loads(old_content)
    new_parsed = json.loads(new_content)

    changes = []
    if source_type == "openapi":
        changes = diff_openapi(old_parsed, new_parsed)
        for c in changes:
            c["severity"] = classify_openapi_change(c)
    elif source_type == "docs":
        changes = diff_docs(old_parsed, new_parsed)
        for c in changes:
            c["severity"] = classify_docs_change(c)

    return changes
