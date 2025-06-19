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

The package uses the `VITE_RELEASE_SHA` environment variable to track releases in Sentry. This is automatically configured in the CI pipeline via:

- `deploy-environment.yml`
- `deploy-feature-branch.yml`

The CI pipeline sets `VITE_RELEASE_SHA=$CI_COMMIT_SHORT_SHA` to associate errors with specific commits.

### Required Environment Variables

The following environment variables must be configured for Sentry to work properly:

- `VITE_SENTRY_DSN`: The Sentry project DSN
- `VITE_RELEASE_SHA`: The commit SHA for release tracking
- `VITE_SENTRY_SEND_ERRORS_IN_LOCAL_DEVELOPMENT`: (Optional) Set to "true" to enable error reporting in local development

**Note**: The environment name is now automatically determined using the `@bsport/envs` package, so `VITE_ENV` is no longer required to be set manually.
