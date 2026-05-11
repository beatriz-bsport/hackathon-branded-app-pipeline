# Host for Studio Manager applications

This application is the host of the Studio Manager applications.

## Purpose

The host application composes Studio Manager applications into one shell. It is a central place where you can route from one application to another.

## Run in dev mode

To run the host with the apps it composes in dev mode

```sh
pnpm exec nx run @bsport/sm-host:dev:watch
```

You'll see running only the port 4000 of the host app : <http://localhost:4000>.

But the other composed apps are running. If you want to see their output, you can add the `--debug` flag.

```sh
pnpm exec nx run @bsport/sm-host:dev:watch --debug
```

If you want to keep using the package script, `pnpm run dev` delegates to the same Nx command.

## Run specific applications

If you don't need full shell orchestration, you can run just one app's Vite server:

```sh
pnpm exec nx run @bsport/sm-host:dev:single
```

Run a specific app the same way:

```sh
pnpm exec nx run @bsport/sm-navigation-sidebar:dev:single
pnpm exec nx run @bsport/sm-giftcard:dev:single
```

You can still use `pnpm --filter` if you explicitly want package scripts instead of Nx targets:

```sh
pnpm --filter @bsport/sm-host dev:single
pnpm --filter @bsport/sm-navigation-sidebar dev:single
pnpm --filter @bsport/sm-giftcard dev:single
```

## Run in build preview mode

To run preview builds, build and preview the target packages directly:

```sh
pnpm --filter @bsport/sm-host build:preview
pnpm --filter @bsport/sm-host preview
```

For multiple apps:

```sh
pnpm --filter="@bsport/sm-*" run build:preview
pnpm --filter="@bsport/sm-*" run preview
```
