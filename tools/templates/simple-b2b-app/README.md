# B2B Application Template

This template provides a minimal setup to create a new application for bsport's clients.

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm run dev
```

This will run two applications aside :

- The Navigation Sidebar on port 5000, with module federation.
- Your application, on the port defined in `vite.config.ts`.

If you want to see the translations, you need to run the `translation:update` script :

```
pnpm run translation:update
```

This will automatically build translations files in `public/locales` folder. You might need to rebuild your apps to integrate the new translations.

### Build your application

To build your application :

```sh
pnpm run build
```

:warning: You can not preview your build !
React is defined as an external dependencies in the Vite config, thus it won't be in the final bundle.
