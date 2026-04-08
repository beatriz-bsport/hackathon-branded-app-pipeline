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

2. Import `getFetch` from the package. You may want to init fetch only once in a `src/utils/fetch.ts` file.

   ```tsx
   import { getFetch } from "@bsport/fetch";

   const fetch = getFetch();

   export default fetch;
   // ...
   ```

## Specific use case : track request onProgress

`fetch` can not use onProgress on formData (Readable Stream not compliant). The package provides an alternative solution : XMLHttpRequest. This is the library `axios` relies on.

1. Import `getXhr` from the package.

   ```tsx
   import { getFetch, getXhr } from "@bsport/fetch";

   const fetch = getFetch();

   export const xhr = getXhr();

   export default fetch;
   ```

2. Provide adequate params (onProgress, signal) to the function.

   ```tsx
   // onUploadProgress is a function that receives progressEvent,
   // e.g. the state of your request completion
   const onUploadProgress = (progressEvent: ProgressEvent) => {
     const percentCompleted = Math.round(
       (progressEvent.loaded * 100) / progressEvent.total,
     );
     // Do something else, display a progress bar for instance
   };

   // A signal is something managed by a controller
   const controller = new AbortController();
   // You can add a button that trigger some controller actions
   // e.g. an abort signal
   const onButtonClick = () => controller.abort();

   // Use XHR mainly to upload image
   const formData = new FormData();
   formData.append("image", file);

   xhr("your_api_url", {
     headers: { Authorization: `Token ${token}` },
     method: "POST",
     formData: formData,
     onUploadProgress: onUploadProgress,
     signal: controller.signal,
   });
   ```

This is equivalent to `axios.post(url, { headers, onUploadProgress, signal, body: formData});`.

## Update the API base url

`@bsport/fetch` reads the runtime API domain from:

- `window.__SM_RUNTIME__.API_BASE_URL` when present
- fallback to `https://api.production.bsport.io` when missing/empty

For Studio Manager and widget proxy bridge apps, this value is loaded through `/studio/studio-env.js`.

Local switch examples:

```sh
pnpm --filter @bsport/sm-host run api:dev
pnpm --filter @bsport/sm-host run api:local

pnpm --filter @bsport/widget-proxy-bridge run api:dev
pnpm --filter @bsport/widget-proxy-bridge run api:local
```
