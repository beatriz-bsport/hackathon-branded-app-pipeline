# API Env (revamp)

## General rule

The API env to target is decided by the `fetch` instance of an application, based on the `packages/utils/fetch` package.

For `studio-manager`, there is now a first-class runtime override file as well: `env.js`.
If `env.js` defines an explicit API base URL, it takes precedence over every other rule below.

```js
window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

env.VITE_API_BASE_URL = "http://localhost:8000";
```

- `VITE_API_BASE_URL`: explicit backend base URL to use.
- `fetch` always keeps the request path exactly as declared by the frontend package or app.
- `env.js` changes only the backend domain.

### Deployed environments

When running on `dev`, `staging` or `production` (inferred from the runtime url), `fetch` enforces which backend to target.

| URL                                    | API                                |
| -------------------------------------- | ---------------------------------- |
| `https://backoffice.dev.bsport.io`     | `https://api.dev.bsport.io`        |
| `https://backoffice.staging.bsport.io` | `https://api.staging.bsport.io`    |
| `https://backoffice.bsport.io`         | `https://api.production.bsport.io` |

### Deployed feature branches

When running on feature branch, during the CI, a `VITE_FRONTEND_ONLY` env variable is defined.

| Frontend only ? | API                                        |
| --------------- | ------------------------------------------ |
| Yes             | `https://api.dev.bsport.io`                |
| No              | `https://api-{identifier}.chaos.bsport.io` |

where identifier is inferred from the url: `https://backoffice.theta.bsport.io` => `identifier = theta`

### Local

If no explicit runtime API base URL is defined in `env.js`, `fetch` will rely on 2 items.

The first one it looks at is the runtime window env variable `__API_ENV__`. If defined,

- it's a known environment (`dev`, `staging`,`production` or `local`) and can infer the API url to use
- it's not a known environment, thus it infers it's a feature branch and `fetch` uses `https://api-{identifier}.chaos.bsport.io`.

The second item, in case the first one is undefined, is its built-in env variable `VITE_API_BASE_URL`.

## How to target a specific backend locally ?

### With `env.js`

Every `studio-manager` app now exposes an external `env.js` file at runtime.
If no `public/env.js` exists in the app, the federation config emits a deterministic neutral one during build and serves the same neutral content in dev.

Reference files are stored in [`apps/applications/studio-manager/host/envs`](/Users/sofian/Projects/ichizen/apps/applications/studio-manager/host/envs).
They only define `VITE_API_BASE_URL`.

You can provide your own `public/env.js` to make the API target explicit:

```js
window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

env.VITE_API_BASE_URL = "http://localhost:8000";
```

This mechanism has higher priority than `__API_ENV__`, `API_ENV`, `env=...`, or the frontend hostname.

### Build idempotency

Production builds are now neutral regarding API configuration:

- generated bundles do not embed the local `env` / `API_ENV` selection
- generated `env.js` is empty by default unless you provide a real `public/env.js`
- the intended deployment model is: build once, then replace only `env.js` per environment

That means you can reuse the same build artifact between environments that target different backend domains, provided the environment-specific value is injected through the deployed `env.js`.

### With an inline variable

Run your application by specifying `env=...` before dev, with the following values: `dev`, `local`, `localhost`, `staging`, `production`, `theta` or any other API FB ...

```sh
# General command
env=your_env pnpm exec nx dev @bsport/sm-pack
# Example: Connect to dev backend
env=dev pnpm exec nx dev @bsport/sm-pack
# Example: Connect to staging backend
env=staging pnpm exec nx dev @bsport/sm-pack
```

:warning: This will work only if the Navigation Sidebar is run (which is the case by default).

### With a static variable

If you don't want to redeclare each time the env you want to use, you can export the env variable `API_ENV`.

```sh
# .zshrc
export API_ENV="dev"
```

Then, you just need to run your revamp application, as described in [Run a revamped application](#run-a-revamped-application):

```sh
pnpm exec nx dev @bsport/sm-pack
```

:bulb: If you provide the inline `env`, this provided value will take precedence.

```sh
export API_ENV="staging"
env=production pnpm run dev
# --> env > API_ENV
# => it will target production
```

### From the website

In the DevTools (top left corner), there is an input to specify dynamically the env variable you want to target.

1. Fill the TextField (no need to tape Enter or anything)
2. Logout
3. Login with a fresh token

### With a built-in static env variable in fetch (not advised)

You can still use the `set-api-environment.ts` workspace command

```sh
# Connect to dev backend
pnpm run -w api-environment:set dev
# Connect to staging
pnpm run -w api-environment:set staging
# Connect to local
pnpm run -w api-environment:set local
# Connect to feature-branch
pnpm run -w api-environment:set feature-branch -fb NAME-OF-YOUR-API-FEATURE-BRANCH
```

You can always get some help on the command by running

```sh
pnpm run -w api-environment:set -h
```

## How does the API Env local setup works ?

### Revamp apps

1. Run `pnpm run dev` on a revamp application
2. The application loads `env.js` before boot. If that file defines `window.runtime.env.VITE_API_BASE_URL`, `fetch` uses it directly.
3. If `env.js` does not define an explicit base URL, in the `vite.config` of the application we define `__API_ENV__` in the global variables of the Vite application. The value will be
   2.a the `env` value with the inline variable strategy.
   2.b else the `$API_ENV` value with the static variable strategy. If not defined, then it's empty.
4. When running in development the Vite application, this global variable is injected in the global `window` of the browser.
5. `fetch` can access it at runtime to define the right API url.
6. If it's not defined, `fetch` will fallback to the value of `VITE_API_BASE_URL` that is an env variable directly injected in the bundle of the `fetch` package.
7. If it's not defined, it fallbacks to `dev`.

### DevTools

In the `DevTools`, you can find an input field to set the new API env name you want to use.
What does it do ? It overrides the value of `__API_ENV__` in the window directly. Then, future `fetch` calls will use the new env.

### Legacy backoffice with the navigation sidebar

We want to enforce `saas-legacy` and `sm-navigation-sidebar` to use the same API ENV. In the `start-*` scripts, we provide the right env with the inline method: `env=dev pnpm run start:sidebar`.

Now, the difference between the Revamp Apps and SaaS Legacy is that the Navigation Sidebar must be built in a compatible mode in the second case. It means that `saas-legacy` is not federating a Sidebar in `development` mode but the preview of a built. Thus, the environment variables defined in the Vite config are not exposed to the window.

This is why we need to set the variable in the Window when loading the component. In `NavigationSidebarWithData`, we use the same function as in the `DevTools` to override the `__API_ENV__` variable.

### Why using the sidebar ?

- No need to update any other application
- Centralize the configuration
- It's the core piece of all the running apps
- In any case it needs a special treatment regarding saas-legacy API Env synchronization
