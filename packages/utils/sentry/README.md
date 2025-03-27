# Sentry

This package configures Sentry.

## How to import sentry ?

1. Add the package to the dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/sentry": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import what you need from the package root

   ```tsx
   import { initSentry, setSessionId, setTransactionId } from "@bsport/sentry";

   // ...
   ```
