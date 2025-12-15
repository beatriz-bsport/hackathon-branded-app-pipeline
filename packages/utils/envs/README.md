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

### Feature Branch Deployments

Feature branch deployments follow the pattern `backoffice-{name}.chaos.bsport.io` where `{name}` can be any string (like a branch name, feature name, etc.). The function returns the actual `{name}` part as the environment string. This allows for testing feature branches in a deployed environment while being able to identify the specific branch or feature.

## API

### `getEnv(url?: string): Environment`

Detects the environment based on a URL.

**Parameters:**

- `url` (optional): The URL to analyze. If not provided, uses `window.location.href` in browser environments, or defaults to `'local'` in server environments.

**Returns:**

- `Environment`: One of `'local'`, `'dev'`, `'staging'`, `'production'`, or the extracted name from feature branch URLs

### `isFeatureBranch(url?: string): boolean`

Checks if the current environment is a feature branch deployment.

**Parameters:**

- `url` (optional): The URL to analyze. If not provided, uses `window.location.href` in browser environments.

**Returns:**

- `boolean`: `true` if the current environment is a feature branch, `false` if it's a known environment

### `isEnvFeatureBranch(env: Environment): boolean`

Checks if the provided environment is a feature branch deployment.

**Parameters:**

- `env`: The env to analyze.

**Returns:**

- `boolean`: `true` if the current environment is a feature branch, `false` if it's a known environment

**Type Definitions:**

```typescript
export type KnownEnvironment = "local" | "dev" | "staging" | "production";
export type Environment = KnownEnvironment | (string & {});
```

## Examples

```typescript
import { getEnv, isFeatureBranch, type Environment } from '@bsport/envs';

// Browser usage - detects from current URL
const env = getEnv();

// Server usage - provide URL explicitly
const envFromUrl = getEnv('https://backoffice.staging.bsport.io/dashboard');

// Check if current environment is a feature branch
const isBranch = isFeatureBranch();
if (isBranch) {
  console.log('Running on feature branch');
}

// Check specific URL
const isBranchUrl = isFeatureBranch('https://backoffice-my-feature.chaos.bsport.io');
console.log(isBranchUrl); // true

// Environment-specific logic
const env = getEnv();
switch (env) {
  case 'local':
  case 'dev':
    console.log('Development mode');
    break;
  case 'staging':
    console.log('Staging environment');
    break;
  case 'production':
    console.log('Production environment');
    break;
  default:
    // Feature branch environments (anything else)
    console.log(`Feature branch environment: ${env}`);
    break;
}

// Type-safe environment checking
const currentEnv: Environment = getEnv();
if (currentEnv === 'production') {
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
