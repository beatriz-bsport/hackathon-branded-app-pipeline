# Sentry

This package configures Sentry for error tracking and monitoring across bsport applications.

## Getting Started

### Installation

1. Add the package to the dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/sentry": "workspace:*"
       // other dependencies...
     }
   }
   ```

### Basic Usage

1. Initialize Sentry in your application's entry point

   ```tsx
   import { initSentry } from "@bsport/sentry";

   // Initialize Sentry as early as possible
   initSentry();
   ```

2. Session tracking is handled automatically by the ApplicationScopeProvider

   ```tsx
   import { ApplicationScopeProvider } from "@bsport/sentry";

   // The ApplicationScopeProvider automatically handles session tracking
   // and provides context for error reporting
   <ApplicationScopeProvider appName="my-app">
     <YourAppContent />
   </ApplicationScopeProvider>;
   ```

## React Components

### Error Boundary

The package provides a React Error Boundary component that captures errors and reports them to Sentry:

```tsx
import { ErrorBoundary } from "@bsport/sentry";

function MyApp() {
  return (
    <ErrorBoundary>
      <YourAppContent />
    </ErrorBoundary>
  );
}
```

You can also provide a custom fallback UI:

```tsx
import { ErrorBoundary } from "@bsport/sentry";

function MyApp() {
  return (
    <ErrorBoundary fallback={<CustomErrorUI />}>
      <YourAppContent />
    </ErrorBoundary>
  );
}
```

### Application Scope Provider

The ApplicationScopeProvider helps identify which application generated an error:

```tsx
import { ApplicationScopeProvider } from "@bsport/sentry";

function MyApp() {
  return (
    <ApplicationScopeProvider appName="my-feature-app">
      <YourAppContent />
    </ApplicationScopeProvider>
  );
}
```

## Local Development

### Sending Errors in Local Development

By default, errors in local development environments are not sent to Sentry. To enable error reporting during local development, set the following environment variable:

```
VITE_SENTRY_SEND_ERRORS_IN_LOCAL_DEVELOPMENT=true
```

This can be added to your `.env.local` file or set directly in your development environment. After setting this variable, run the following command from the project root to build the Sentry package with local error reporting enabled:

```bash
pnpm build:sentry
```

## API Reference

### Session and Transaction Tracking

The package provides utilities for tracking user sessions and individual transactions:

#### `getSessionId()`

Gets or creates a persistent session ID and sets it in Sentry for error correlation. The session ID persists throughout the browser session (until page refresh or browser close) and is used to group related errors and user actions together.

```tsx
import { getSessionId } from "@bsport/sentry";

// Get the current session ID (creates one if it doesn't exist)
const sessionId = getSessionId();

// Commonly used in HTTP headers for frontend/backend log correlation
const headers = {
  "X-Session-ID": getSessionId(),
  // other headers...
};
```

#### `getTransactionId()`

Generates and sets a unique transaction ID in Sentry for request tracing. Unlike session ID, transaction ID is unique per call and used for:

- Correlating frontend errors with backend API logs
- Distributed tracing across microservices
- Request debugging and support troubleshooting
- Performance monitoring of end-to-end user actions

```tsx
import { getTransactionId } from "@bsport/sentry";

// Each API call gets a unique transaction ID for tracing
fetch("/api/bookings", {
  headers: {
    "X-Transaction-ID": getTransactionId(),
  },
});

// Or store for reuse within a single operation
const transactionId = getTransactionId();
```

## CI/CD Configuration

### Release Tracking

The package uses `window.__BSPORT_RELEASE_SHA__` (injected at deployment time) to track releases in Sentry, with a fallback to `VITE_RELEASE_SHA` for local development.

**How it works:**

1. The host app's `index.html` contains a placeholder: `window.__BSPORT_RELEASE_SHA__ = "__RELEASE_SHA_PLACEHOLDER__"`
2. During deployment, the CI script replaces the placeholder with the actual commit SHA
3. At runtime, Sentry reads from `window.__BSPORT_RELEASE_SHA__`
4. For local development, it falls back to `VITE_RELEASE_SHA` if the placeholder hasn't been replaced

This approach ensures correct release tracking even when Nx Remote Cache serves cached builds, since the SHA is injected post-build during deployment.

### Required Environment Variables

The following environment variables must be configured for Sentry to work properly:

- `VITE_SENTRY_DSN`: The Sentry project DSN
- `VITE_RELEASE_SHA`: (Optional) The commit SHA for release tracking in local development
- `VITE_SENTRY_SEND_ERRORS_IN_LOCAL_DEVELOPMENT`: (Optional) Set to "true" to enable error reporting in local development

**Note**: The environment name is now automatically determined using the `@bsport/envs` package, so `VITE_ENV` is no longer required to be set manually.
