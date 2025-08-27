# Business Insights | Insights | Studio Manager Application

This application provides studio managers with key business insights to help them make informed decisions about their business performance.

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm run dev
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, with module federation.
- The Insights application, on the port defined in `package.json` in `federation.devPort` : 4350.

Go to <http://localhost:4350>

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
