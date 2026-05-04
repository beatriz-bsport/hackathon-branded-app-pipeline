# @bsport/envs

Environment detection utility for bsport applications. This package provides a simple way to determine the current environment based on URL patterns.

## Installation

```sh
pnpm add @bsport/envs
```

## Usage

```typescript
import { getEnv } from "@bsport/envs";

// Detect environment from current window.location.href
const currentEnv = getEnv();

// Or provide a specific URL
const env = getEnv("https://backoffice.dev.bsport.io");
console.log(env); // 'dev'
```

## Environment Detection Rules

The `getEnv` function maps URLs to environments based on the following patterns:

| URL Pattern                    | Environment  | Example                                                            |
| ------------------------------ | ------------ | ------------------------------------------------------------------ |
| `localhost:*`                  | `local`      | `http://localhost:3000`                                            |
| `127.0.0.1:*`                  | `local`      | `http://127.0.0.1:8080`                                            |
| `backoffice.dev.bsport.io`     | `dev`        | `https://backoffice.dev.bsport.io`                                 |
| `backoffice.staging.bsport.io` | `staging`    | `https://backoffice.staging.bsport.io`                             |
| `backoffice.bsport.io`         | `production` | `https://backoffice.bsport.io`                                     |
| `backoffice-*.chaos.bsport.io` | `{name}`     | `https://backoffice-feature-123.chaos.bsport.io` → `'feature-123'` |
| Other `*.bsport.io` domains    | `production` | `https://api.bsport.io`                                            |
| Non-bsport domains             | `local`      | `https://example.com`                                              |

## API

### `getEnv(url?: string): Environment`

Detects the environment based on a URL.

**Parameters:**

- `url` (optional): The URL to analyze. If not provided, uses `window.location.href` in browser environments, or defaults to `'local'` in server environments.

**Returns:**

- `Environment`: One of `'local'`, `'dev'`, `'staging'`, `'production'`, or the extracted name from chaos.bsport.io URLs

**Type Definitions:**

```typescript
export type KnownEnvironment = "local" | "dev" | "staging" | "production";
export type Environment = KnownEnvironment | (string & {});
```

## Examples

```typescript
import { type Environment, getEnv } from "@bsport/envs";

// Browser usage - detects from current URL
const env = getEnv();

// Server usage - provide URL explicitly
const envFromUrl = getEnv("https://backoffice.staging.bsport.io/dashboard");

// Environment-specific logic
switch (env) {
  case "local":
  case "dev":
    console.log("Development mode");
    break;
  case "staging":
    console.log("Staging environment");
    break;
  case "production":
    console.log("Production environment");
    break;
  default:
    // Unknown environment
    console.log(`Unknown environment: ${env}`);
    break;
}

// Type-safe environment checking
const currentEnv: Environment = getEnv();
if (currentEnv === "production") {
  // Production-only code
}
```

## Error Handling

The function gracefully handles invalid URLs and edge cases:

- Invalid URLs return `'local'`
- Empty strings return `'local'`
- Missing `window` object (server-side) returns `'local'`

## Development

```sh
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Build the package
pnpm build

# Lint the code
pnpm lint
```
