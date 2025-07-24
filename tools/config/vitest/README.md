# `@bsport/config-vitest`

A shared configuration package for Vitest testing framework used across the Ichizen monorepo.

## Installation

This package is automatically available in the workspace. Import it in your `vitest.config.ts`:

```typescript
import { createVitestConfig } from "@bsport/config-vitest";
```

## API

### `createVitestConfig(dirname, config?)`

Creates a Vitest configuration for Node.js environment testing.

#### Parameters

- `dirname` (string): The directory path of your project (typically `__dirname`)
- `config` (ViteUserConfig, optional): Additional Vite configuration to merge with the base config

#### Returns

Returns a Vitest configuration object with the following defaults:

- **Environment**: `node`
- **Globals**: `true` (enables global test functions like `describe`, `it`, `expect`)
- **Test files**: `src/__tests__/**/*.test.ts` and `src/__tests__/**/*.test.tsx`
- **Path alias**: `#src` mapped to your source directory

#### Example

```typescript
// vitest.config.ts
import { createVitestConfig } from "@bsport/config-vitest";

export default createVitestConfig(__dirname);
```

### `createVitestBrowserConfig(dirname, config?)`

Creates a Vitest configuration for browser environment testing (with jsdom).

#### Parameters

- `dirname` (string): The directory path of your project (typically `__dirname`)
- `config` (ViteUserConfig, optional): Additional Vite configuration to merge with the base config

#### Returns

Returns a Vitest configuration object with the same defaults as `createVitestConfig`, except:

- **Environment**: `jsdom` (for DOM testing)

#### Example

```typescript
// vitest.config.ts
import { createVitestBrowserConfig } from "@bsport/config-vitest";

export default createVitestBrowserConfig(__dirname);
```

## Custom Configuration

You can extend the base configuration by passing additional options:

```typescript
import { createVitestConfig } from "@bsport/config-vitest";

export default createVitestConfig(__dirname, {
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    setupFiles: ["./src/test-setup.ts"],
  },
});
```

## Test File Structure

The configuration expects test files to be organized as follows:

```
src/
├── __tests__/
│   ├── component.test.ts
│   └── utils.test.tsx
├── components/
└── utils/
```

## Path Aliases

The `#src` alias is automatically configured to point to your source directory:

```typescript
// In your tests, you can use:
import { myFunction } from "#src/utils/myFunction";
```

## Scripts

Common scripts for your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```
