# Customer Data Platform | Smartlists | Studio Manager Application

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm exec nx run @bsport/sm-smartlists:dev:watch
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, used as the local navigation bridge.
- The Smartlists application, on the port defined in your `package.json` in `federation.devPort` : 4301.

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
pnpm build:preview
```

:warning: The application preview is meant to be consumed in the Studio Manager shell context. Run the host app in preview mode as well.

### Build your application for deployment

To build your application in production environment :

```sh
pnpm build
```
