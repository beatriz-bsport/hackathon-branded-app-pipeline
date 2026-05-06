# AGENTS.md — saas-legacy

## Status

Legacy app. Supported, but not the default destination for new product work.

## Default decision

- If the task is a new manager-facing feature, prefer Studio Manager.
- Recommended to touch legacy only for explicit bug fixes, maintenance, migrations, or code that still has no modern home.

But the developer has the last word on this.

## If you must edit here

- Respect legacy constraints: Flow/Redux/material-ui patterns may still exist.
- Keep changes isolated. Do not import modern Studio Manager patterns blindly.
- Check whether the change should also be ported or documented for a future port.

## Related docs

- `README.md`
- `GUIDELINES.md`
- `../../../CONVENTIONS.md`
