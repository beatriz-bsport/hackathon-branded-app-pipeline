# Local storage management - Auth token

This package provides utilities to manage the authentication token inside the local storage.

## How to use

1. Add the package to the dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/local-storage-auth-token": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import the desired utilities from the package.

   ```tsx
   import { getAuthToken } from "@bsport/local-storage-auth-token";

   // ...
   ```
