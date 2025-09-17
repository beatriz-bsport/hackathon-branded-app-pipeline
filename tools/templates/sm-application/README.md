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

2. Set an available devPort in your `package.json` :

```jsonc
  "federation": {
    "devPort": 4099,
  }
```

It should belong to the port range defined in `/tools/config/federation/src/config.ts`, and not be used by another application of your business domain.

3. Add your application to the `studio-manager/host` app : port in `package.json`, route in the `Root.tsx`.

4. You should also update the `studio-manager/host/scripts/apps.txt` file in order to have the new application running when you are running the host app.

5. You should also update in the `studio-manager/navigation-sidebar/src/urls.ts` file the `REVAMP_URLS_DEVELOPMENT` if you want the navigation bar to have the correct url to navigate without enabling the app on Pre-Prod and Prod environement (this is the current feature flagging system we have).

---

<!-- @indication Replace "BUSINESS_DOMAIN" and "PRODUCT_UNIT" -->

# BUSINESS_DOMAIN | PRODUCT_UNIT | Studio Manager Application

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm run dev
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, with module federation.
- The $MODEL application, on the port defined in `package.json` in `federation.devPort` : $PORT.

Go to <http://localhost:$PORT>

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

:warning: The application is not built with react, as it is aimed to be shared in the Module Federation architecture. You need to run the host app in preview mode as well.

### Build your application for deployment

To build your application in production environment :

```sh
pnpm run build
```
