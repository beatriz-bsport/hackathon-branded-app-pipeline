# Bsport Request From Header

A set of utilities to manage the value of the `bsport-request-from` header.

## How to use

1. Add the package to the dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/request-from-header": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import the desired utilities from the package.

   ```tsx
   import {
     BSPORT_REQUEST_FROM_HEADER_VALUES,
     setBsportRequestFrom,
   } from "@bsport/request-from-header";

   setBsportRequestFrom(BSPORT_REQUEST_FROM_HEADER_VALUES.backoffice);
   ```
