# Financial services | Invoice | Studio Manager Application

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm exec nx run @bsport/sm-invoice:dev:watch
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, with module federation.
- The Invoice application, on the port defined in `package.json` in `federation.devPort` : 4250.

Go to <http://localhost:4250>.

If you only want the app's own Vite server, run `pnpm exec nx run @bsport/sm-invoice:dev:single`.

### Build your translations

If you want to see the translations, you need to run the `translation:update` script :

```
pnpm run translation:update
```

This will automatically build translations files in `public/locales` folder. You might need to rebuild your apps to integrate the new translations.

You will automatically have intellisense of your available translations.

### Build your application for local preview

To build your application and be able to run the build locally (preview) :

```sh
pnpm run build:preview
```

To preview the result :

```sh
pnpm run preview
```

:warning: The application is not built with react, as it is aimed to be shared in the Module Federation architecture. You need to run the host app in preview mode as well.

### Build your application for deployment

To build your application in production environment :

```sh
pnpm run build
```
