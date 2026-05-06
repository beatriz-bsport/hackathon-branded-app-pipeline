# Backbone for Studio Manager Applications

The **SM Backbone** package provides and manages essential tools for building Studio manager applications, including authentication, routing, getting common data, rendering the Navigation Sidebar, and error tracking with Sentry.

## Installation

Add the package as a dependency in your `package.json` file:

```json
{
  "dependencies": {
    "@bsport/sm-backbone": "workspace:*"
    // other dependencies...
  }
}
```

## Features

### `AppWrapper`

The `AppWrapper` is a Wrapper for applications that provides a lot of managed features that the consumer does not have to implement by itself :

- Routing : `BrowserRouter` setup ;
- Authentication : Redirection to the Login page if not authenticated ;
- Default Login page : The wrapper comes with a default page and path (/login) for the Login page, but is accepted custom values ;
- Theme provider for Kaizen ;
- Translations provider for Kaizen ;
- Layout with the Navigation Sidebar with Suspense and predefined fallback.

```tsx
import { AppWrapper } from "@bsport/sm-backbone";

const basename = __YOUE_APP__.__BASENAME__;

// Basic usage
const App = () => {
  return (
    <AppWrapper basename={basename}>
      <YourAppContent />
    </AppWrapper>
  );
};

// Advanced usage with custom navigation and login
const StandaloneApp = () => (
  <AppWrapper
    basename={basename}
    NavigationApp={lazy(
      () => import("sm-navigation-sidebar/NavigationSidebar"),
    )}
    LoginApp={<LoginApp />}
    loginUrl="/login-v2/"
  >
    <YourApp />
  </AppWrapper>
);
```

### `ErrorBoundaryWrapper`

The `ErrorBoundaryWrapper` provides Sentry error tracking for your application. It automatically:

- Sets up the application scope in Sentry to identify which app generated an error
- Captures and reports React component errors to Sentry
- Provides a fallback UI when errors occur
- Handles session tracking automatically

```tsx
import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

const MyFeature = () => {
  return (
    <ErrorBoundaryWrapper appName="my-feature-app">
      <YourFeatureContent />
    </ErrorBoundaryWrapper>
  );
};
```

The `appName` prop is required and helps identify which part of your application generated an error in Sentry dashboards.

### `QueryBoundary`

The `QueryBoundary` combines the Studio Manager `ErrorBoundaryWrapper`, React `Suspense`, and TanStack Query error reset logic for query-driven UI sections.

Use it around components that read data with suspense queries. It automatically:

- scopes captured errors with the provided `appName` ;
- renders a default card loader while suspended ;
- renders a default retryable error fallback when a query error reaches the boundary ;
- resets both TanStack Query and the React error boundary when users retry.

```tsx
import { QueryBoundary } from "@bsport/sm-backbone";

const MyQuerySection = () => {
  return (
    <QueryBoundary appName="my-studio-app">
      <MySuspenseQueryContent />
    </QueryBoundary>
  );
};
```

You can replace the loading or error fallback when a page needs a different layout:

```tsx
import {
  QueryBoundary,
  QueryBoundaryCardLoader,
  type QueryBoundaryErrorFallbackProps,
} from "@bsport/sm-backbone";

const DetailsErrorFallback = ({ onRetry }: QueryBoundaryErrorFallbackProps) => {
  return <button onClick={onRetry}>Try again</button>;
};

const DetailsPage = () => {
  return (
    <QueryBoundary
      appName="my-studio-app"
      loadingFallback={<QueryBoundaryCardLoader size="lg" />}
      errorFallback={(props) => <DetailsErrorFallback {...props} />}
    >
      <DetailsContent />
    </QueryBoundary>
  );
};
```

Available fallback helpers:

- `QueryBoundaryLoader`: centered loader without a card container ;
- `QueryBoundaryCardLoader`: centered loader inside a `Card` ;
- `QueryBoundaryPageLoader`: full-screen centered loader ;
- `QueryBoundarySectionErrorFallback`: default card error fallback with retry.

When consuming `QueryBoundary` in an application that builds its own Tailwind CSS, include `SM_BACKBONE_CONTENT_PATHS` in the app's Tailwind config so the fallback classes are generated. See [Tailwind CSS Integration](#tailwind-css-integration).

### `ErrorBoundary`

For more specific use cases, the `ErrorBoundary` component from Sentry is also re-exported:

```tsx
import { ErrorBoundary } from "@bsport/sm-backbone";

const MyComponent = () => {
  return (
    <ErrorBoundary
      fallback={<CustomErrorUI />}
      beforeCapture={(scope) => {
        // Custom error handling logic
        scope.setTag("custom_tag", "value");
      }}
    >
      <YourContent />
    </ErrorBoundary>
  );
};
```

This component provides more granular control over error handling. For detailed documentation on all available props and features, please refer to the `@bsport/sentry` package documentation.

### Data Access Layer

The data access layer provides a set of hooks to access common data across the application. These hooks abstract away the complexity of store selectors and provide a simple interface for accessing data.

```tsx
import { dataAccessLayer } from "@bsport/sm-backbone";

const {
  useCompanyFeatures,
  useCompanyTheme,
  useUserAccess,
  useUserRole,
  useCompanyRoles,
} = dataAccessLayer;

function MyComponent() {
  // Get company features
  const features = useCompanyFeatures();

  // Get company theme
  const theme = useCompanyTheme();

  // Get user access information
  const userAccess = useUserAccess();

  // Get current user's role
  const userRole = useUserRole();

  // Get all company roles
  const companyRoles = useCompanyRoles();

  // Use the data in your component
  return (
    <div>
      {features.someFeature && <FeatureComponent />}
      <CompanyTheme theme={theme} />
      {userAccess.canDoSomething && <RestrictedComponent />}
      <RoleBasedComponent role={userRole} allRoles={companyRoles} />
    </div>
  );
}
```

Each hook provides access to specific data:

- `useCompanyFeatures()`: Returns the features enabled for the current company
- `useCompanyTheme()`: Returns the theme configuration for the current company
- `useUserAccess()`: Returns the access rights for the current user
- `useUserRole()`: Returns the role object for the current user
- `useCompanyRoles()`: Returns all roles defined for the current company

### DevTools

The DevTools component is a small box on the top left of your screen that provides quick actions to support development: changing locale, changing theme, switching studio runtime preset, overriding studio runtime variables, logout.

This toolbox is hidden on staging and production, and visible on local and feature branch. Concerning the dev environment, it can be shown by clicking 5 times on the top left corner of the screen. There is a small hidden button.

When available, runtime configuration uses browser localStorage:

- `@bsport/studio-runtime-env`: selected preset (`local|dev|staging|production`)
- `@bsport/studio-runtime-field-env-map`: per-variable preset selectors

Runtime behavior:

- changing selectors updates `window.__SM_RUNTIME__` immediately (no forced page reload)
- integrations initialized once at app startup can still require a manual reload to fully reflect runtime changes (for example Sentry, Mixpanel, Unleash client startup behavior)

## Tailwind CSS Integration

The SM Backbone package uses Tailwind CSS classes and provides a convenient way for consuming applications to include these classes in their build process.

### Automatic Tailwind Content Paths

To ensure that Tailwind classes used in SM Backbone components are properly included in your application's CSS build, import and use the provided content paths:

```javascript
// tailwind.config.js
import { tailwindConfig } from "@bsport/kaizen-primitive-core";
import { SM_BACKBONE_CONTENT_PATHS } from "@bsport/sm-backbone/tailwind-content";

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...SM_BACKBONE_CONTENT_PATHS,
  ],
};
```

### How it works

The `SM_BACKBONE_CONTENT_PATHS` export contains paths that point to SM Backbone's source files through pnpm's symlinked `node_modules`. This allows Tailwind to scan the original TypeScript/JSX files during build time and include any Tailwind classes used by SM Backbone components.

This approach ensures that:

- All Tailwind classes used in SM Backbone are automatically included in your build
- No manual class discovery or CSS exports are needed
- The solution works seamlessly with pnpm workspaces and Module Federation
- Content paths are version-controlled and explicit

### Usage in Applications

Components from SM Backbone (like `AppWrapper`, `ErrorBoundaryWrapper`, etc.) will work correctly with their styling once you've added the content paths to your Tailwind configuration.

## Feature Flags (Unleash)

SM Backbone exposes Feature Flags via `@unleash/proxy-client-react`.

Runtime keys in `studio-env.js`:

- `UNLEASH_PROXY_URL`
- `UNLEASH_CLIENT_KEY`
- `UNLEASH_ENVIRONMENT` (optional, defaults to `"default"`)

Notes:

- if both keys are provided in `window.__SM_RUNTIME__`, they are used directly
- if one key is missing, SM Backbone logs a warning and feature flags are disabled
- no environment inference is done in SM Backbone; `UNLEASH_ENVIRONMENT` comes from runtime config (or defaults to `"default"`)

Debugging:

- check `/studio/studio-env.js` payload in browser devtools and restart the consuming app if needed.
