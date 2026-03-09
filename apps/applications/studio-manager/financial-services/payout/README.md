# Financial Services | Payout | Studio Manager Application

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm run dev
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, with module federation.
- The Payout application, on the port defined in `package.json` in `federation.devPort` : 4251.

Go to <http://localhost:4251>

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
"@bsport/sm-payout": "workspace:*"
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
