import json
from pathlib import Path

from sync_prd_notion import api, child_count, create_page, find_page, markdown_blocks

ROOT = Path("/opt/data/viral-copilot")
DESIGN = ROOT / "DESIGN.md"


def main() -> None:
    exchange_title = "Viral Copilot : design system Neon Command"
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

    deliverable_title = "Design system Viral Copilot : Neon Command"
    deliverable = find_page("1fa099d7-fab1-4eca-bdcc-a88027b6aa60", deliverable_title)
    if deliverable is None:
        deliverable = create_page(
            "1fa099d7-fab1-4eca-bdcc-a88027b6aa60",
            {
                "Nom": {"title": [{"text": {"content": deliverable_title}}]},
                "Type": {"select": {"name": "Document"}},
                "Date": {"date": {"start": "2026-09-02"}},
                "Statut": {"select": {"name": "À valider"}},
                "Projet": {"select": {"name": "Autre"}},
                "Échange": {"relation": [{"id": exchange["id"]}]},
            },
        )

    blocks = markdown_blocks(DESIGN.read_text(encoding="utf-8"))
    present = child_count(deliverable["id"])
    if present > len(blocks):
        raise RuntimeError(f"Notion page has {present} blocks, DESIGN conversion has {len(blocks)}")
    for index in range(present, len(blocks), 100):
        api(
            f"v1/blocks/{deliverable['id']}/children",
            "PATCH",
            {"children": blocks[index : index + 100]},
        )

    validation_title = "Valider le design system Neon Command"
    validation = find_page("cd508cae-5abb-4a8b-965a-d14468cbd5b5", validation_title)
    if validation is None:
        validation = create_page(
            "cd508cae-5abb-4a8b-965a-d14468cbd5b5",
            {
                "Nom": {"title": [{"text": {"content": validation_title}}]},
                "Échéance": {"date": {"start": "2026-09-04"}},
                "Priorité": {"select": {"name": "Haute"}},
                "Statut": {"select": {"name": "À valider"}},
                "Contexte": {
                    "rich_text": [
                        {
                            "text": {
                                "content": "Valider la direction Neon Command, plus proche de Postiz, avant la conception des écrans et composants du produit."
                            }
                        }
                    ]
                },
                "Échange": {"relation": [{"id": exchange["id"]}]},
                "Livrable": {"relation": [{"id": deliverable["id"]}]},
            },
        )

    final_count = child_count(deliverable["id"])
    print(
        json.dumps(
            {
                "exchange_id": exchange["id"],
                "deliverable_id": deliverable["id"],
                "deliverable_url": deliverable.get("url", ""),
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
