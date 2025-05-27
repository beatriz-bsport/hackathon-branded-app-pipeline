# Auth store

This package provides utilities to interact with our authentication API.

## How to use

1. Add the package to the dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/store-auth": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import your desired utilities from the package.

   ```tsx
   import { loginAction } from "@bsport/store-auth";
   ```

## Utilities

### `loginAction`

Authenticate against the API to retrieve a valid token, and save it into localStorage.

### `logoutAction`

Remove the authentication token from localStorage.

### `fetchUserAccessAction`

Retrieve the permissions (access) related to the authenticated user and store them in the AuthStore.
