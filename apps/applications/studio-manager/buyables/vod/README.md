# Buyables | VOD | Studio Manager Application

## Links

- [Figma](https://www.figma.com/design/w2X0s55dR3lkAikSbHjGfl/VOD---Playlist?m=auto&t=7kjqVogHSTevTWjq-6)
- [Linear project - List page](https://linear.app/bsport/project/playlists-list-page-81916006b668/overview)
- [Linear project - Details page](https://linear.app/bsport/project/playlists-details-page-6b7c363a1de5/overview)

## Quickstart

### Run your application

To run in localhost :

```sh
pnpm run dev
```

This will run two applications aside :

- The Navigation Sidebar on port 4050, with module federation.
- The VOD application, on the port defined in `package.json` in `federation.devPort` : 4154.

Go to <http://localhost:4154>

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
"@bsport/sm-vod": "workspace:*"
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
