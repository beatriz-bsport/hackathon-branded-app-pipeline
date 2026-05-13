# API Platform package

API endpoints and types for the Platform API

## Installation

Add the package as a dependency in your `package.json` file:

```json
{
  "dependencies": {
    "@bsport/api-platform": "workspace:*"
    // other dependencies...
  }
}
```

## Scopes

You can import from subpath for each scope:

```tsx
import "@bsport/api-platform/<scope>";
```

That includes:

- `background-task`

## Structure

The package exposes subpaths, but only at a depth of 1.

- `src/my-folder-to-expose/index.ts` => this will be exposed, and built at `my-folder-to-expose.js` file in the build
- Don't use deeper index.ts files
