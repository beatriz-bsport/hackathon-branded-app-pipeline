Reference runtime `studio-env.js` payloads for `studio-manager`.

These files are not generated into production artifacts.
During local `vite` development, `/studio/studio-env.js` is served by a Vite plugin with a fixed dev payload.
No `public/studio/studio-env.js` copy is needed for `dev` / `dev:single`.
This also covers `nx dev-mfe` and `nx dev` workflows for studio apps.
The intended flow is:

1. Build the frontend once.
2. Reuse the same JS/CSS/HTML artifacts in every environment.
3. Upload one shared `studio-env.js` separately at `/studio/studio-env.js`.

Why:

- the build stays idempotent and environment-neutral
- only the runtime `studio-env.js` changes between environments
- request paths stay exactly as declared by the frontend; `studio-env.js` controls the runtime endpoints/tokens
- `studio-manager` does not share the `saas-legacy` `env.js` file or global namespace
- if the runtime file is missing or empty values are provided, API uses a built-in default while Sentry/Unleash/analytics require runtime keys

Runtime keys currently used:

- `API_BASE_URL`: backend API domain used by `@bsport/fetch`
- `SENTRY_DSN`: DSN used by `@bsport/sentry`
- `UNLEASH_PROXY_URL`: Unleash proxy URL used by `@bsport/sm-backbone`
- `UNLEASH_CLIENT_KEY`: Unleash client key used by `@bsport/sm-backbone`
- `UNLEASH_ENVIRONMENT`: Unleash environment value used by `@bsport/sm-backbone`
- `MIXPANEL_TOKEN`: Mixpanel token used by `@bsport/analytics` (value is selected by the loaded env file)

Files:

- `local.studio-env.js`: local backend on `http://localhost:8000`
- `dev.studio-env.js`: dev deployed backend
- `staging.studio-env.js`: staging deployed backend
- `production.studio-env.js`: production deployed backend
- `custom.template.studio-env.js`: template for any custom backend domain

Runtime path:

- all `studio-manager` entrypoints load `/studio/studio-env.js`

Local development:

- default local dev API base URL is `https://api.dev.bsport.io`
- `api:ensure` was removed
- if you need a file-based runtime payload, run `STUDIO_RUNTIME_APP_DIR="$PWD" pnpm -w run studio-runtime:dev`
