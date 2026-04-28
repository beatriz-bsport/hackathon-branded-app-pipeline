# Booking | Service | Studio Manager Application

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm exec nx run @bsport/sm-service:dev:watch
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, with module federation.
- The `service` application, on the port defined in `package.json` in `federation.devPort` : 4203.

Go to <http://localhost:4203>

If you only want the app's own Vite server, run `pnpm exec nx run @bsport/sm-service:dev:single`.

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
"@bsport/your-app-name": "workspace:*"
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
