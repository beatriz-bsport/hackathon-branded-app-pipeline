# Fetch utils

Wrapper around JavaScript standard [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) API allowing to make request to bsport's API.

## How to use

1. Add the package to the dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/fetch": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import `getFetch` from the package. You may want to init fetch only once in a `src/utils` file.

   ```tsx
   import { getFetch } from "@bsport/fetch";

   const fetch = getFetch();

   export default fetch;
   // ...
   ```

## Update the API base url

It is possible to easily change the API base URL used by fetch, if you want to make your request from various backends.

Run the following command to update the base url used by fetch (example with `dev`, but you can provide `local`, `staging` and `production` as well) :

```sh
pnpm run -w api-environment:set dev
```

To target a feature branch API, provide the adequate feature branch identifier :

```sh
pnpm run -w api-environment:set feature-branch -fb omega
```
