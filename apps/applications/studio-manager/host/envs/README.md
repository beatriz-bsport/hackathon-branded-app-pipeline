Reference runtime `env.js` payloads for `studio-manager`.

These files are not meant to be copied into `public/env.js` during the build.
The intended flow is:

1. Build the host once.
2. Reuse the same build artifact in every environment.
3. Upload one of these files separately as `/studio/env.js` in the target environment.

Why:

- the build stays idempotent and environment-neutral
- only the runtime `env.js` changes between environments
- request paths stay exactly as declared by the frontend; `env.js` only changes the backend domain

Files:

- `local.env.js`: local monolith backend on `http://localhost:8000`
- `dev.env.js`: dev deployed backend
- `staging.env.js`: staging deployed backend
- `production.env.js`: production deployed backend
- `custom.template.env.js`: template for any custom backend domain
