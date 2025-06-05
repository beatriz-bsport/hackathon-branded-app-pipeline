### Code Review Checklist: Enforced Guidelines

When reviewing code, ensure the following best practices are strictly followed:

- CSS class names must follow the **Block Element Modifier (BEM)** convention.

- All imports must use **path aliases** (e.g., `#src/...`) instead of relative paths (e.g., `./` or `../../`).
- Assume `#src` is configured as an alias for the project's `src` directory.

- All **reusable React components** must be wrapped with `React.memo()` to avoid unnecessary re-renders.

- Functions passed to memoized components must be memoized using `useCallback`.
- Functions with **heavy or expensive computations** should be wrapped in `useMemo`.
