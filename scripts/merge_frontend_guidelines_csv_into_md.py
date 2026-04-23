#!/usr/bin/env python3
"""Merge a Notion-export CSV into `.github/instructions/_FRONTEND_GUIDELINES.instruction.md`.

Constraints (as requested):
- No duplicates (dedupe by guideline Name)
- Do not add columns to the Markdown table (keep existing MD columns)
- Prefer the CSV ordering for the final table order

Behavior:
- Reads the existing Markdown file and extracts the first GitHub-style table found.
- Reads the CSV and maps columns to the MD schema:
    - Name -> Name
    - Level -> Level
    - Importance -> Importance
    - Scope -> Scope
- Builds a merged set of rows:
    - Start from CSV rows (in CSV order)
    - Use MD values as fallback if the CSV row is missing fields
    - Append MD-only rows not present in CSV at the end (preserving their current MD order)
- Rewrites only the table portion; keeps the rest of the markdown untouched.

Usage:
  Dry-run (default):
    python3 scripts/merge_frontend_guidelines_csv_into_md.py --csv /path/to/export.csv

  Apply changes:
    python3 scripts/merge_frontend_guidelines_csv_into_md.py --csv /path/to/export.csv --apply
"""

from __future__ import annotations

import argparse
import csv
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class MdTable:
    header: list[str]
    rows: list[list[str]]
    start_line_idx: int  # inclusive, 0-based
    end_line_idx: int  # exclusive, 0-based


MD_EXPECTED_HEADER = ["Name", "Level", "Importance", "Scope"]


def _strip_cell(cell: str) -> str:
    return cell.strip()


def _parse_md_table(lines: list[str]) -> MdTable:
    """Parse the first markdown table found in `lines`.

    Supports GitHub-style tables:
      | a | b |
      | - | - |
      | 1 | 2 |
    """

    def is_table_row(line: str) -> bool:
        s = line.strip()
        return s.startswith("|") and s.endswith("|") and "|" in s[1:-1]

    start = None
    for i, line in enumerate(lines):
        # Header row candidate
        if is_table_row(line) and i + 1 < len(lines) and is_table_row(lines[i + 1]):
            start = i
            break

    if start is None:
        raise ValueError("No markdown table found")

    # Find table end
    end = start
    while end < len(lines) and is_table_row(lines[end]):
        end += 1

    raw_rows = [
        [_strip_cell(c) for c in lines[i].strip().strip("|").split("|")]
        for i in range(start, end)
    ]

    if len(raw_rows) < 2:
        raise ValueError("Markdown table is too short")

    header = raw_rows[0]
    # raw_rows[1] is the separator row
    body = raw_rows[2:]

    return MdTable(header=header, rows=body, start_line_idx=start, end_line_idx=end)


def _table_to_md_lines(header: list[str], rows: list[list[str]]) -> list[str]:
    widths = [len(h) for h in header]
    for row in rows:
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(cell))

    def fmt_row(cells: list[str]) -> str:
        padded = [cells[i].ljust(widths[i]) for i in range(len(header))]
        return "| " + " | ".join(padded) + " |\n"

    out: list[str] = []
    out.append(fmt_row(header))
    out.append("| " + " | ".join("-" * widths[i] for i in range(len(header))) + " |\n")
    for r in rows:
        out.append(fmt_row(r))
    return out


def _normalize_name(name: str) -> str:
    # Keep it conservative: strip whitespace + normalize internal NBSPs,
    # but also normalize a few known variants between CSV and MD exports.
    normalized = " ".join(name.replace("\u00a0", " ").split()).strip()
    normalized = normalized.replace("`", "")
    return normalized


def _read_csv_rows(csv_path: Path) -> list[dict[str, str]]:
    # Notion exports sometimes start with a UTF-8 BOM, which otherwise turns "Name" into "\ufeffName".
    with csv_path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows: list[dict[str, str]] = []
        for r in reader:
            rows.append({k: (v or "").strip() for k, v in r.items() if k is not None})
        return rows


def _md_rows_to_map(md: MdTable) -> tuple[dict[str, list[str]], list[str]]:
    """Return name->row map and existing MD order."""
    name_to_row: dict[str, list[str]] = {}
    order: list[str] = []

    header = md.header
    if header != MD_EXPECTED_HEADER:
        raise ValueError(
            f"Unexpected MD table header: {header!r}. Expected {MD_EXPECTED_HEADER!r}. "
            "(Refusing to rewrite to avoid adding/removing columns.)"
        )

    for row in md.rows:
        if len(row) != len(header):
            continue
        name = _normalize_name(row[0])
        if not name:
            continue
        if name in name_to_row:
            # Keep first occurrence in MD
            continue
        name_to_row[name] = row
        order.append(name)

    return name_to_row, order


def _csv_row_to_md_row(
    csv_row: dict[str, str], fallback: list[str] | None
) -> list[str] | None:
    # Map CSV fields to MD columns.
    name = _normalize_name(csv_row.get("Name", ""))
    if not name:
        return None

    scope = csv_row.get("Scope", "")
    importance = csv_row.get("Importance", "")
    level = csv_row.get("Level", "")

    if fallback is not None:
        # fallback is [Name, Level, Importance, Scope]
        if not level:
            level = fallback[1]
        if not importance:
            importance = fallback[2]
        if not scope:
            scope = fallback[3]

    return [name, level, importance, scope]


def merge(csv_path: Path, md_path: Path) -> tuple[str, int, int]:
    md_text = md_path.read_text(encoding="utf-8")
    lines = md_text.splitlines(keepends=True)

    md_table = _parse_md_table(lines)
    md_map, md_order = _md_rows_to_map(md_table)

    csv_rows = _read_csv_rows(csv_path)

    merged_rows: list[list[str]] = []
    seen: set[str] = set()

    # 1) Add rows in CSV order
    for r in csv_rows:
        name = _normalize_name(r.get("Name", ""))
        if not name or name in seen:
            continue
        fallback = md_map.get(name)
        md_row = _csv_row_to_md_row(r, fallback=fallback)
        if md_row is None:
            continue
        merged_rows.append(md_row)
        seen.add(name)

    # 2) Append MD-only rows in their existing MD order
    for name in md_order:
        if name in seen:
            continue
        merged_rows.append(md_map[name])
        seen.add(name)

    new_table_lines = _table_to_md_lines(md_table.header, merged_rows)

    new_lines = (
        lines[: md_table.start_line_idx]
        + new_table_lines
        + lines[md_table.end_line_idx :]
    )

    return "".join(new_lines), len(md_table.rows), len(merged_rows)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Merge a Notion-export CSV into the frontend guidelines markdown table (deduped, CSV order)."
        )
    )
    parser.add_argument(
        "--csv",
        required=True,
        help="Path to Notion-export CSV (must include Name/Scope/Importance/Level columns)",
    )
    parser.add_argument(
        "--md",
        default=".github/instructions/_FRONTEND_GUIDELINES.instruction.md",
        help="Path to markdown file to update (default: .github/instructions/_FRONTEND_GUIDELINES.instruction.md)",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write changes to the markdown file (default is dry-run)",
    )

    args = parser.parse_args(argv)

    repo_root = Path(__file__).resolve().parents[1]
    csv_path = Path(args.csv).expanduser().resolve()
    md_path = (repo_root / args.md).resolve()

    if not csv_path.exists():
        print(f"CSV not found: {csv_path}")
        return 2
    if not md_path.exists():
        print(f"MD not found: {md_path}")
        return 2

    merged_text, before_count, after_count = merge(csv_path=csv_path, md_path=md_path)

    if merged_text == md_path.read_text(encoding="utf-8"):
        print("No changes needed.")
        return 0

    print(f"Planned update: {md_path}")
    print(f"Rows: {before_count} -> {after_count}")

    if not args.apply:
        print("Dry-run only. Re-run with --apply to write changes.")
        return 0

    md_path.write_text(merged_text, encoding="utf-8")
    print("Wrote updated markdown table.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
