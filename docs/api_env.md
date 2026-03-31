# API Env (revamp)

## General rule

For `studio-manager`, the backend API domain is configured only at runtime through `env.js`.

`fetch` keeps the request path exactly as declared by the frontend and only prepends the runtime base URL.
There is no environment-name inference, no feature-branch URL convention, and no path rewriting.

```js
window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

env.VITE_API_BASE_URL = "https://api.dev.bsport.io";
```

- `VITE_API_BASE_URL` is required.
- If it is missing or empty, `fetch` throws at runtime with an explicit error.

## Runtime location

Every federated `studio-manager` app loads `env.js` before boot.

- Host deployment: `/studio/env.js`
- Remote standalone deployment: `/studio/apps/<app-name>/env.js`

If an app does not ship a real `public/env.js`, the build emits a neutral placeholder `env.js`.
That placeholder exists only so the artifact is complete; it must be replaced at runtime with a real API domain.

Reference payloads are stored in [`apps/applications/studio-manager/host/envs`](/Users/sofian/Projects/ichizen/apps/applications/studio-manager/host/envs).

## Build idempotency

Production builds are environment-neutral regarding backend API targeting:

- generated JS/CSS bundles do not embed any API domain
- generated `env.js` is neutral by default
- the intended deployment model is: build once, then replace only `env.js` per environment

This allows the same artifact to be reused across environments that target different backend domains.

## Local development

To run a `studio-manager` app locally, provide a real runtime file:

1. create `public/env.js` for the app you run locally, or
2. otherwise serve a real `env.js` from the expected runtime path

Example:

```js
window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

env.VITE_API_BASE_URL = "http://localhost:8000";
```
