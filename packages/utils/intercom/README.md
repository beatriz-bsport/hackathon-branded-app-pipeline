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

The package uses the `VITE_RELEASE_SHA` environment variable to track releases in Intercom. This is automatically configured in the CI pipeline via:

- `deploy-environment.yml`
- `deploy-feature-branch.yml`

The CI pipeline sets `VITE_RELEASE_SHA=$CI_COMMIT_SHORT_SHA` to associate errors with specific commits.

### Required Environment Variables

The following environment variables must be configured for Sentry to work properly:

- `VITE_RELEASE_SHA`: The commit SHA for release tracking
