### Code Implementation Guidelines

Follow these rules when you write code:

- Use early returns whenever possible to make the code more readable.
- Always use CSS classes for styling, using Block Elements Modifier (BEM) notation.
- Use path aliases (e.g., #src/...) for all imports instead of relative paths (e.g., ./...).
- Wrap reusable React components with React.memo() to prevent unnecessary re-renders.
- Memoize functions passed to memoized components or with heavy computations using useCallback or useMemo.
- Implement accessibility features on elements. For example, a tag should have a tabindex=“0”, aria-label, on:click, and on:keydown, and similar attributes.
- Use consts instead of functions, and always define a typescript type.
