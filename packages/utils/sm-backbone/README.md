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
