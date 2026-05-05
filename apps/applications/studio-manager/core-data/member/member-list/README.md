# Core data | Member List | Studio Manager Application

## Links

- [Figma](https://www.figma.com/design/E0ysoRirTKqRj89BfQKStF/Members?node-id=31-17127&t=EknhE24NI3v0nS6P-0)
- [Linear project - List page](https://linear.app/bsport/project/members-list-page-50d16ff1ebec/overview)

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm exec nx run @bsport/sm-member-list:dev:watch
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, with module federation.
- The Member list application on port 4100, that import the Navigation Sidebar.

Go to <http://localhost:4100>.

If you only want the app's own Vite server, run `pnpm exec nx run @bsport/sm-member-list:dev:single`.

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
