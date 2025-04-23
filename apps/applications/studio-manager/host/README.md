# Host for Studio Manager applications

This application is the host of the Studio Manager applications.

## Purpose

The host application imports all studio manager applications via Module Federation. It is a central place where you can route from one application to another.

## Run in dev mode

To run all applications in dev mode

```sh
pnpm run dev
```

You'll see running only the port 4000 of the host app : <http://localhost:4000>.

But all the other applications (remotes) are running. If you want to see them, you can add the `--debug` flag.

```sh
pnpm run dev --debug
```

## Run in build preview mode

To run all applications in build preview mode (apps are built specifically for preview) :

```sh
pnpm run dev --build:preview
```

You can logs the remote applications as well with

```sh
pnpm run dev --build:preview --debug
```

## Run specific applications

If you don't need all applications, you can be more granular. For this, you can use `pnpm --filter` with `dev:single` script :

```sh
# Run host app in dev:single mode
pnpm run dev:single
# Run navigation sidebar
pnpm --filter @bsport/sm-navigation-sidebar dev:single
# Run specific apps with name
pnpm --filter @bsport/sm-giftcard dev:single
# Run specific apps with filter
pnpm --filter"@bsport/sm-*" dev:single
```

You can do the same by combining the scripts `build:preview` and `preview` of each application.

```sh
pnpm --filter="@bsport/sm-*" run build:preview
pnpm --filter="@bsport/sm-*" run preview
```
