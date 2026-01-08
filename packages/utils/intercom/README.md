# Intercom

This package configures Intercom for client communication and handling their requests across bsport applications.

## Getting Started

### Installation

1. Add the package to the dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/intercom": "workspace:*"
       // other dependencies...
     }
   }
   ```

### Basic Usage

1. Initialize Intercom Widget in your application's entry point

   ```tsx
   import { initIntercomWidget } from "@bsport/intercom";

   // Initialize Sentry as early as possible
   initIntercomWidget();
   ```

## CI/CD Configuration

### Release Tracking

The package uses `window.__BSPORT_RELEASE_SHA__` (injected at deployment time) to track releases in Intercom, with a fallback to `VITE_RELEASE_SHA` for local development.

**How it works:**

1. The host app's `index.html` contains a placeholder: `window.__BSPORT_RELEASE_SHA__ = "__RELEASE_SHA_PLACEHOLDER__"`
2. During deployment, the CI script replaces the placeholder with the actual commit SHA
3. At runtime, Intercom reads from `window.__BSPORT_RELEASE_SHA__`
4. For local development, it falls back to `VITE_RELEASE_SHA` if the placeholder hasn't been replaced

This approach ensures correct release tracking even when Nx Remote Cache serves cached builds, since the SHA is injected post-build during deployment.

### Required Environment Variables

The following environment variables can be configured:

- `VITE_RELEASE_SHA`: (Optional) The commit SHA for release tracking in local development
