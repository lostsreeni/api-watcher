from bs4 import BeautifulSoup
import json
import yaml


def normalize_openapi(raw_content: str) -> str:
    """
    Parses OpenAPI JSON/YAML and extracts paths, methods, parameters, request schemas, and response schemas.
    """
    try:
        data = json.loads(raw_content)
    except json.JSONDecodeError:
        try:
            data = yaml.safe_load(raw_content)
        except yaml.YAMLError:
            return json.dumps({"error": "Failed to parse OpenAPI document"})

    if not isinstance(data, dict):
        return json.dumps({"error": "Invalid OpenAPI document"})

    normalized = {"paths": {}}

    paths = data.get("paths", {})
    if not isinstance(paths, dict):
        return json.dumps(normalized)

    for path, methods in paths.items():
        if not isinstance(methods, dict):
            continue

        normalized["paths"][path] = {}
        for method, details in methods.items():
            if method.lower() not in [
                "get",
                "post",
                "put",
                "delete",
                "patch",
                "options",
                "head",
            ]:
                continue

            if not isinstance(details, dict):
                continue

            norm_method = {
                "parameters": details.get("parameters", []),
                "requestBody": details.get("requestBody", {}),
                "responses": details.get("responses", {}),
            }
            normalized["paths"][path][method.lower()] = norm_method

    return json.dumps(normalized, sort_keys=True)


def normalize_docs(raw_content: str) -> str:
    """
    Parses HTML documentation pages and extracts title, structured text blocks, and meaningful headings.
    Only visible content.
    """
    soup = BeautifulSoup(raw_content, "html.parser")

    # Remove script and style elements
    for script_or_style in soup(
        ["script", "style", "noscript", "meta", "link", "header", "footer", "nav"]
    ):
        script_or_style.decompose()

    title = soup.title.string.strip() if soup.title and soup.title.string else ""

    # Find headings and their subsequent content
    headings = []
    text_blocks = []

    for tag in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "li"]):
        text = tag.get_text(separator=" ", strip=True)
        if not text:
            continue

        if tag.name.startswith("h"):
            headings.append({"level": tag.name, "text": text})
            text_blocks.append({"type": "heading", "content": text})
        else:
            text_blocks.append({"type": "text", "content": text})

    normalized = {"title": title, "headings": headings, "blocks": text_blocks}

    return json.dumps(normalized, sort_keys=True)
