# B2B Backbone

The **B2B Backbone** package provides essential tools for building B2B applications, including support for
authentication, permissions management, and module federation.

## Features

- **Authentication**: Integrate user authentication into your app.
- **Permissions**: Manage user roles and permissions with ease.

## Installation

Add the package as a dependency in your `package.json` file:

```json
{
  "dependencies": {
    "@bsport/b2b-backbone": "workspace:*"
    // other dependencies...
  }
}
```

### Usage

#### Authentication

Easily set up authentication using the provided utilities. For example, wrapping your app with the `AuthWrapper`:

```tsx
import { AuthWrapper } from "@bsport/b2b-backbone/auth";

const App = () => (
  <AuthWrapper>
    <YourApp />
  </AuthWrapper>
);
```
