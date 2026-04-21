#!/usr/bin/env python3
"""Rename `.github/instructions/*.md` files.

Goal:
- Rename to UPPER_CASE
- Remove the trailing uuid-ish token at the end of the filename
- Use suffix `.instruction.md`

Example:
  "Always use custom exceptions 2ca137e4c6408021ad8dffb7968985b7.md"
->"ALWAYS USE CUSTOM EXCEPTIONS.instruction.md"

Safety:
- Supports --dry-run (default)
- Detects collisions and refuses to proceed

Usage:
    Preview (dry-run):
        python3 scripts/rename_instructions.py

    Apply:
        python3 scripts/rename_instructions.py --apply

Notes:
    - If collisions are detected (two sources -> same destination, or destination exists), the script
    refuses to apply.
    - Running the script multiple times should keep filenames stable (idempotent).
"""

from __future__ import annotations

import argparse
import os
import re
from dataclasses import dataclass
from pathlib import Path

UUIDISH_RE = re.compile(r"\s+[0-9a-f]{32}$", re.IGNORECASE)
INSTRUCTION_SUFFIX_RE = re.compile(r"(?:\.INSTRUCTION)+$", re.IGNORECASE)


@dataclass(frozen=True)
class RenamePlan:
    src: Path
    dst: Path


def build_destination_name(stem: str) -> str:
    # If the file was (partially) renamed before, remove any repeated .instruction suffixes
    # so we can append exactly one later.
    stem = INSTRUCTION_SUFFIX_RE.sub("", stem)

    # Remove the last " uuid-ish" token if present.
    cleaned = UUIDISH_RE.sub("", stem).strip()
    cleaned_upper = cleaned.upper().replace("`", "")
    cleaned_upper = cleaned_upper.replace(" ", "_")
    cleaned_upper = cleaned_upper.replace("-", "_")
    cleaned_upper = cleaned_upper.translate(str.maketrans({"(": "", ")": "", ",": ""}))
    cleaned_upper = re.sub(r"_+", "_", cleaned_upper).strip("_")
    return f"{cleaned_upper}.instruction.md"


def compute_plans(instructions_dir: Path) -> list[RenamePlan]:
    plans: list[RenamePlan] = []

    ignored_filenames = {
        "_FRONTEND_GUIDELINES.instruction.md",
        "_FRONTEND_GUIDELINES.md",
    }

    for path in sorted(instructions_dir.glob("*.md")):
        if not path.is_file():
            continue

        if path.name in ignored_filenames:
            continue

        dst_name = build_destination_name(path.stem)
        dst = path.with_name(dst_name)
        plans.append(RenamePlan(src=path, dst=dst))

    return plans


def detect_collisions(plans: list[RenamePlan]) -> dict[Path, list[Path]]:
    """Return dst -> [sources] for collisions (multiple sources to same dst OR dst exists)."""
    dst_to_sources: dict[Path, list[Path]] = {}
    for p in plans:
        dst_to_sources.setdefault(p.dst, []).append(p.src)

    collisions: dict[Path, list[Path]] = {}
    for dst, sources in dst_to_sources.items():
        if len(sources) > 1:
            collisions[dst] = sources
        elif dst.exists() and dst not in sources:
            # dst already exists as a different file
            collisions[dst] = sources

    return collisions


def print_plan(plans: list[RenamePlan]) -> None:
    if not plans:
        print("No files to rename.")
        return

    width = max(len(p.src.name) for p in plans)
    for p in plans:
        print(f"{p.src.name:<{width}}  ->  {p.dst.name}")


def perform_renames(plans: list[RenamePlan]) -> None:
    for p in plans:
        p.src.rename(p.dst)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Rename instruction markdown files to a normalized, idempotent format (UPPER_CASE, "
            "uuid removed, one '.instruction.md' suffix)."
        )
    )
    parser.add_argument(
        "--dir",
        default=".github/instructions",
        help="Directory containing instruction markdown files (default: .github/instructions)",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actually rename files (default is dry-run)",
    )
    args = parser.parse_args(argv)

    repo_root = Path(__file__).resolve().parents[1]
    instructions_dir = (repo_root / args.dir).resolve()

    if not instructions_dir.exists() or not instructions_dir.is_dir():
        print(f"Directory not found: {instructions_dir}")
        return 2

    plans = compute_plans(instructions_dir)
    print_plan(plans)

    collisions = detect_collisions(plans)
    if collisions:
        print("\nRefusing to proceed: collisions detected.")
        for dst, sources in collisions.items():
            sources_display = ", ".join(s.name for s in sources)
            print(f"  {dst.name} <= {sources_display}")
        print("\nResolve collisions (rename source titles) and re-run.")
        return 3

    if not args.apply:
        print("\nDry-run only. Re-run with --apply to rename.")
        return 0

    perform_renames(plans)
    print(
        f"\nRenamed {len(plans)} file(s) in {os.path.relpath(instructions_dir, repo_root)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
