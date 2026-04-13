# Studio manager runtime configuration

`studio-manager` reads runtime backend/integration config from a dedicated runtime file named `studio-env.js`.

- no environment-specific backend/integration runtime config is baked into the build
- request paths are kept exactly as declared by the frontend
- `saas-legacy` keeps its own `env.js`; `studio-manager` uses a different file and global namespace
- only API has a built-in default when runtime keys are missing or empty

## Runtime file format

```js
window.__SM_RUNTIME__ = {
  API_BASE_URL: "https://api.dev.bsport.io",
  SENTRY_DSN: "https://<project>@o<org>.ingest.us.sentry.io/<id>",
  UNLEASH_PROXY_URL: "https://unleash.tooling.bsport.io/api/frontend",
  UNLEASH_CLIENT_KEY: "default:development.<key>",
  UNLEASH_ENVIRONMENT: "dev",
  MIXPANEL_TOKEN: "<environment-token>",
};
```

- `API_BASE_URL` controls API requests
- `SENTRY_DSN` controls Sentry initialization
- `UNLEASH_PROXY_URL` and `UNLEASH_CLIENT_KEY` control feature flags bootstrap
- `UNLEASH_ENVIRONMENT` controls the feature-flags environment value sent to Unleash
- `MIXPANEL_TOKEN` controls the analytics token for the currently loaded environment file
- example: `platform/v0/users` becomes `https://api.dev.bsport.io/platform/v0/users`
- if `API_BASE_URL` is missing or empty, `studio-manager` falls back to `https://api.production.bsport.io`
- if `SENTRY_DSN` is missing or empty, Sentry initialization is skipped
- if `UNLEASH_PROXY_URL` or `UNLEASH_CLIENT_KEY` are missing, feature flags are disabled
- if `MIXPANEL_TOKEN` is missing or empty, analytics initialization fails unless a token is passed explicitly to `configure()`

## Runtime file location

Each `studio-manager` HTML entrypoint loads the same shared runtime file before boot.

- shared runtime path: `/studio/studio-env.js`
- file-based local fallback path (preview/compat flows): `public/studio/studio-env.js`

The build does not generate or inject this file.

## Build idempotence

The build stays environment-neutral as long as `studio-env.js` is managed outside the build artifact.

- build once
- reuse the same JS/CSS/HTML artifacts everywhere
- upload or update only `studio-env.js` per environment
- if the file is absent, only the API production fallback is guaranteed; integration keys may be missing

If you deploy artifacts to a bucket that already contains `studio-env.js`, make sure the deploy step does not remove that separately managed file.

## Local development

During local `vite` development, `/studio/studio-env.js` is served by a Vite plugin.
No `public/studio/studio-env.js` file is copied anymore for `dev` / `dev:single`.
This applies to both:

- `pnpm exec nx dev-mfe @bsport/<studio-app>`
- `pnpm exec nx dev @bsport/<studio-app>`

Default local dev behavior:

- the dev server returns a fixed runtime payload
- resulting API base URL: `https://api.dev.bsport.io`

If you need a file-based runtime payload for a specific flow, run:

```bash
STUDIO_RUNTIME_APP_DIR="$PWD" pnpm -w run studio-runtime:dev
```

Reference files live in `apps/applications/studio-manager/host/envs`.
