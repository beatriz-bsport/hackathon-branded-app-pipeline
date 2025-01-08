# Fetch utils

Wrapper around JavaScript standard [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) API allowing to make request to bsport's API.

## How to use

1. First add it by adding it in tthe dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/fetch": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import `bsportFetch` as default from the package

   ```tsx
   import bsportFetch from "@bsport/fetch";

   // ...
   ```
