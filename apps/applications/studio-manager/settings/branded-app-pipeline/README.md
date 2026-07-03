<!-- @indication Remove this first part in your own README. The second part can be kept and completed.-->

# Studio Manager Application Template

This template provides a minimal setup to create a new application for bsport's studio managers.

Take a look at our Notion documentation on [How to start a new application](https://www.notion.so/bright-shovel-41b/Quickstart-Create-a-new-application-17e137e4c6408017880efb0d5548df17).

## How to use the template to create a new application

Create your Studio manager application by running the following command :

```sh
pnpm run -w project:create --template=sm-application
```

Select `apps/applications/studio-manager` location for your application, and select the adequate folder (`business-domain/product-unit`).

## Setup

1. Define the right `appType` in your `vite.config.ts`. It should be your business domain.

2. Set an available devPort in your `package.json` for isolated local development:

```jsonc
  "federation": {
    "devPort": 4099,
  }
```

Studio Manager apps are libraries, but local dev still relies on this port metadata for the sidebar-injected runtime. It should belong to the port range defined in `/tools/config/federation/src/config.ts`, and not be used by another application of your business domain.

3. You should also update in the `studio-manager/navigation-sidebar/src/urls.ts` file the `REVAMP_URLS_DEVELOPMENT` if you want the injected navigation to have the correct local url without relying on host.

---

<!-- @indication Replace "BUSINESS_DOMAIN" and "PRODUCT_UNIT" -->

# BUSINESS_DOMAIN | PRODUCT_UNIT | Studio Manager Application

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm exec nx run @bsport/sm-branded-app-pipeline:dev:watch
```

This runs the app in its isolated local runtime and injects the navigation bridge:

- The Navigation Sidebar on port 4050, used as the bridge between old and new navigation.
- The branded-app-pipeline application, on the port defined in `package.json` in `federation.devPort` : 4452.

Go to <http://localhost:4452>

If you only want the app's own Vite server, run `pnpm exec nx run @bsport/sm-branded-app-pipeline:dev:single`.

### Build your translations

If you want to see the translations, you need to run the `translation:update` script :

```
pnpm run translation:update
```

This will automatically build translations files in `public/locales` folder. You might need to rebuild your apps to integrate the new translations.

You will automatically have intellisense of your available translations.

### Build your application for local preview

To build your application for local preview :

```sh
pnpm run build:preview
```

The application is built as an ES library. To use it, add it as a workspace dependency in the consuming app:

```jsonc
"@bsport/sm-branded-app-pipeline": "workspace:*"
```

Then install dependencies to link the package:

```sh
pnpm install --ignore-scripts
```

### Build your application for deployment

To build your application in production environment :

```sh
pnpm run build
```
