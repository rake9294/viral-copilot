import json
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path("/opt/data/viral-copilot")
PRD = ROOT / "docs/PRD-viral-copilot-v1.md"


def load_token() -> str:
    for line in Path("/opt/data/.env").read_text(encoding="utf-8").splitlines():
        if line.startswith("NOTION_API_KEY="):
            return line.split("=", 1)[1]
    raise RuntimeError("NOTION_API_KEY missing")


TOKEN = load_token()
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}


def api(path: str, method: str = "GET", payload: dict | None = None) -> dict:
    data = json.dumps(payload, ensure_ascii=False).encode() if payload is not None else None
    request = urllib.request.Request(
        "https://api.notion.com/" + path.lstrip("/"),
        data=data,
        headers=HEADERS,
        method=method,
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as error:
        body = error.read().decode(errors="replace")
        raise RuntimeError(f"Notion {error.code} {path}: {body[:800]}") from error


def page_title(page: dict) -> str:
    for value in page.get("properties", {}).values():
        if value.get("type") == "title":
            return "".join(item.get("plain_text", "") for item in value.get("title", []))
    return ""


def find_page(database_id: str, title: str) -> dict | None:
    cursor = None
    while True:
        payload = {"page_size": 100}
        if cursor:
            payload["start_cursor"] = cursor
        result = api(f"v1/databases/{database_id}/query", "POST", payload)
        for page in result.get("results", []):
            if page_title(page) == title:
                return page
        if not result.get("has_more"):
            return None
        cursor = result.get("next_cursor")


def create_page(database_id: str, properties: dict) -> dict:
    return api(
        "v1/pages",
        "POST",
        {"parent": {"type": "database_id", "database_id": database_id}, "properties": properties},
    )


def rich_text(text: str) -> list[dict]:
    clean = text.replace("**", "").replace("`", "")
    return [{"type": "text", "text": {"content": clean[:1900]}}]


def chunks(text: str, size: int = 1800) -> list[str]:
    return [text[index : index + size] for index in range(0, len(text), size)] or [""]


def markdown_blocks(markdown: str) -> list[dict]:
    lines = markdown.splitlines()
    blocks: list[dict] = []
    index = 0
    while index < len(lines):
        line = lines[index].rstrip()
        if not line:
            index += 1
            continue
        if line.startswith("```"):
            buffer: list[str] = []
            index += 1
            while index < len(lines) and not lines[index].startswith("```"):
                buffer.append(lines[index])
                index += 1
            index += 1
            for part in chunks("\n".join(buffer)):
                blocks.append(
                    {"object": "block", "type": "code", "code": {"rich_text": rich_text(part), "language": "plain text"}}
                )
            continue
        if line.startswith("|"):
            buffer = []
            while index < len(lines) and lines[index].rstrip().startswith("|"):
                buffer.append(lines[index].rstrip())
                index += 1
            for part in chunks("\n".join(buffer)):
                blocks.append(
                    {"object": "block", "type": "code", "code": {"rich_text": rich_text(part), "language": "plain text"}}
                )
            continue
        heading = re.match(r"^(#{1,3})\s+(.*)$", line)
        if heading:
            block_type = {1: "heading_1", 2: "heading_2", 3: "heading_3"}[len(heading.group(1))]
            blocks.append(
                {"object": "block", "type": block_type, block_type: {"rich_text": rich_text(heading.group(2))}}
            )
            index += 1
            continue
        if line.startswith("- "):
            blocks.append(
                {"object": "block", "type": "bulleted_list_item", "bulleted_list_item": {"rich_text": rich_text(line[2:])}}
            )
            index += 1
            continue
        if re.match(r"^\d+\.\s+", line):
            text = re.sub(r"^\d+\.\s+", "", line)
            blocks.append(
                {"object": "block", "type": "numbered_list_item", "numbered_list_item": {"rich_text": rich_text(text)}}
            )
            index += 1
            continue
        if line.startswith("> "):
            blocks.append({"object": "block", "type": "quote", "quote": {"rich_text": rich_text(line[2:])}})
            index += 1
            continue
        buffer = [line]
        index += 1
        while index < len(lines):
            next_line = lines[index].rstrip()
            if (
                not next_line
                or next_line.startswith(("#", "- ", "> ", "```", "|"))
                or re.match(r"^\d+\.\s+", next_line)
            ):
                break
            buffer.append(next_line)
            index += 1
        for part in chunks(" ".join(buffer)):
            blocks.append({"object": "block", "type": "paragraph", "paragraph": {"rich_text": rich_text(part)}})
    return blocks


def child_count(block_id: str) -> int:
    count = 0
    cursor = None
    while True:
        path = f"v1/blocks/{block_id}/children?page_size=100"
        if cursor:
            path += "&start_cursor=" + urllib.parse.quote(cursor)
        result = api(path)
        count += len(result.get("results", []))
        if not result.get("has_more"):
            return count
        cursor = result.get("next_cursor")


def main() -> None:
    exchange_title = "Viral Copilot : conception et PRD V1"
    exchange = find_page("8eb9ed2e-e9ee-4fcb-abfe-b64339e0bc9f", exchange_title)
    if exchange is None:
        exchange = create_page(
            "8eb9ed2e-e9ee-4fcb-abfe-b64339e0bc9f",
            {
                "Nom": {"title": [{"text": {"content": exchange_title}}]},
                "Date": {"date": {"start": "2026-09-02"}},
                "Type": {"select": {"name": "Tâche"}},
                "Statut": {"select": {"name": "Terminé"}},
                "Projet": {"select": {"name": "Autre"}},
            },
        )

    liv_title = "PRD Viral Copilot V1"
    liv = find_page("1fa099d7-fab1-4eca-bdcc-a88027b6aa60", liv_title)
    if liv is None:
        liv = create_page(
            "1fa099d7-fab1-4eca-bdcc-a88027b6aa60",
            {
                "Nom": {"title": [{"text": {"content": liv_title}}]},
                "Type": {"select": {"name": "Document"}},
                "Date": {"date": {"start": "2026-09-02"}},
                "Statut": {"select": {"name": "À valider"}},
                "Projet": {"select": {"name": "Autre"}},
                "Échange": {"relation": [{"id": exchange["id"]}]},
            },
        )

    blocks = markdown_blocks(PRD.read_text(encoding="utf-8"))
    present = child_count(liv["id"])
    if present > len(blocks):
        raise RuntimeError(f"Notion page has {present} blocks, PRD conversion has {len(blocks)}")
    for index in range(present, len(blocks), 100):
        api(f"v1/blocks/{liv['id']}/children", "PATCH", {"children": blocks[index : index + 100]})

    val_title = "Valider le PRD Viral Copilot V1"
    validation = find_page("cd508cae-5abb-4a8b-965a-d14468cbd5b5", val_title)
    if validation is None:
        validation = create_page(
            "cd508cae-5abb-4a8b-965a-d14468cbd5b5",
            {
                "Nom": {"title": [{"text": {"content": val_title}}]},
                "Échéance": {"date": {"start": "2026-09-04"}},
                "Priorité": {"select": {"name": "Haute"}},
                "Statut": {"select": {"name": "À valider"}},
                "Contexte": {
                    "rich_text": [
                        {
                            "text": {
                                "content": "Relire le PRD complet, confirmer le périmètre V1 et autoriser le plan d’implémentation de la vague 0."
                            }
                        }
                    ]
                },
                "Échange": {"relation": [{"id": exchange["id"]}]},
                "Livrable": {"relation": [{"id": liv["id"]}]},
            },
        )

    final_count = child_count(liv["id"])
    print(
        json.dumps(
            {
                "exchange_id": exchange["id"],
                "deliverable_id": liv["id"],
                "deliverable_url": liv.get("url", ""),
                "validation_id": validation["id"],
                "validation_url": validation.get("url", ""),
                "blocks_expected": len(blocks),
                "blocks_present": final_count,
                "body_complete": final_count == len(blocks),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
