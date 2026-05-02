from __future__ import annotations

import asyncio
import json
import logging
import os
import random
import shutil
from pathlib import Path

from config import IMAGE_DIR, DEMO_DIR, DEMO_RENDER_DELAY, DEMO_MODE

logger = logging.getLogger(__name__)

DEMO_DIR_PATH = Path(DEMO_DIR)
SCENARIOS_FILE = DEMO_DIR_PATH / "scenarios.json"
RENDERED_DIR = DEMO_DIR_PATH / "rendered"

_scenarios_cache: list[dict] | None = None
_demo_session_scenario: dict[str, str] = {}


def is_demo_mode() -> bool:
    return DEMO_MODE


def _load_scenarios() -> list[dict]:
    global _scenarios_cache
    if _scenarios_cache is None:
        with open(SCENARIOS_FILE, encoding="utf-8") as f:
            _scenarios_cache = json.load(f)
        logger.info(f"Demo scenarios loaded: {len(_scenarios_cache)} available")
    return _scenarios_cache


async def demo_generate() -> dict:
    scenarios = _load_scenarios()
    scenario = random.choice(scenarios)

    logger.info(f"Demo generate: picked scenario '{scenario['id']}'")

    return {
        "annotations": scenario["annotations"],
        "caption": scenario["caption"],
        "output_task": scenario["output_task"],
        "_demo_scenario_id": scenario["id"],
    }


async def demo_render(session_id: str) -> str:
    images_dir = Path(IMAGE_DIR)
    images_dir.mkdir(exist_ok=True)
    output_path = images_dir / f"{session_id}.png"

    if output_path.exists():
        logger.info(f"Demo render cache hit for session {session_id}")
        return str(output_path)

    await asyncio.sleep(DEMO_RENDER_DELAY)

    scenario_id = _demo_session_scenario.get(session_id)
    if scenario_id and (RENDERED_DIR / f"{scenario_id}.png").exists():
        src = RENDERED_DIR / f"{scenario_id}.png"
    else:
        available = list(RENDERED_DIR.glob("*.png"))
        if not available:
            raise FileNotFoundError(
                f"No rendered images found in {RENDERED_DIR}. "
                "Run the real pipeline once to generate demo cards."
            )
        src = random.choice(available)
        logger.info(f"Demo render: no matching scenario, picked random image {src.name}")

    shutil.copy(src, output_path)
    file_size = os.path.getsize(output_path) // 1024
    logger.info(f"Demo card copied: {output_path} ({file_size} KB)")
    return str(output_path)


def remember_demo_session(session_id: str, generated_content: dict) -> None:
    scenario_id = generated_content.get("_demo_scenario_id")
    if scenario_id:
        _demo_session_scenario[session_id] = scenario_id
