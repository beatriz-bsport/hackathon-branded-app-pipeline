# B2B Application Template

This template provides a minimal setup to create a new application for bsport's clients.

It is built using:

- [lodash](https://lodash.com/): JavaScript utility library.
- [vite]()

## Quickstart

### Run the Navigation Sidebar application

Our template uses Module Federation to run the Navigation Sidebar application.

In a first terminal, you need to build and preview the Navigation Sidebar application to expose a remote entry.

On the `apps/applications/b2b/navigation-sidebar` :

```
pnpm run build && pnpm run preview
```

From your application, you can run the script `federation:navigation` :

```
pnpm run federation:navigation
```

From anywhere :

```
pnpm exec nx build @bsport/navigation-sidebar && pnpm exec nx preview @bsport/navigation-sidebar
```

### Run your application

To run in localhost :

```sh
pnpm run dev
```

If you want to see the translations, you need to run the `translation:update` script :

```
pnpm run translation:update
```

This will automatically build translations files in `public/locales` folder.

### Build your application

To build your application :

```sh
pnpm run build
```

:warning: You can not preview your build !
React is defined as an external dependencies in the Vite config, thus it won't be in the final bundle.
