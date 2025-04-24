# Backbone for Studio Manager Applications

The **SM Backbone** package provides and manages essential tools for building Studio manager applications, including authentication, routing, getting common data, rendering the Navigation Sidebar.

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
  </AppWrapperr>
);
```
