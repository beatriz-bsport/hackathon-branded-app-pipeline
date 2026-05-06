# Applications for Studio Manager

This folder contains all the applications provided to bsport studio managers.

## Structure overview

The `studio-manager` folder should reflect the same structure as in the backend. Basically, we should have one folder per vertical, and each business unit will have its own subfolder.

You can find the list on [Notion](https://www.notion.so/bright-shovel-41b/Business-domains-Product-Units-1d5137e4c64080b28bbed3b2bf469e0b).

## Agent Playbook

- Prefer generators: `pnpm project:create --template=sm-application` for new modules.
- Prefer `pnpm exec nx run @bsport/sm-APP:dev:watch` for local work.
- Use `#src/*` for intra-package imports.
- Route new user-facing strings through i18n and run `pnpm translation:update`.
- Flag new feature work. See `../../../docs/feature_flags.md`.
- Canonical overlay for this area: [`AGENTS.md`](./AGENTS.md).

---

## Applications

All applications follow the same pattern, and have been built with the `project:create` command. This includes :

- a name starting with `@bsport/sm-`, where `sm` is the prefix standing for Studio Manager.
- a list of commands to foster the development, that we keep consistent between applications for simplicity (cf [Commands section](#commands))

### Shared applications

These applications are maintained by Ichizen maintainers, as they don't belong to a specific Vertical, and they hold a special business logic.

- [Host](./host/README.md) : A shell application to visualize the full backoffice composition locally.
- [Navigation Sidebar](./navigation-sidebar/README.md) : A bridge application used to connect old and new navigation. It is injected during local development so app teams can focus on one app without running host.

Other applications are maintained by Vertical developers. When they run locally, each application is in standalone mode and don't interact with other applications, except the Navigation Sidebar.

### Create a new application

Follow the [Quickstart - Create a new application](https://www.notion.so/bright-shovel-41b/Quickstart-Create-a-new-application-17e137e4c6408017880efb0d5548df17) guide.

### Add an application to the Host application

Follow the [Configure the deployment](https://www.notion.so/bright-shovel-41b/Quickstart-Create-a-new-application-17e137e4c6408017880efb0d5548df17?pvs=4#1c8137e4c640801ba192d35cb56baeba) section of the Quickstart guide.

---

## Commands

For all commands, you have different ways to run them.

You can either go to the location of the application and run the command locally

```sh
cd ./VERTICAL/APPLICATION
pnpm run COMMAND
```

For local development, prefer Nx from the workspace root so sidebar injection and dependency watching are handled automatically.

or use a single line command

```sh
# Using pnpm feature
pnpm --filter @bsport/sm-APP-NAME COMMAND
# Using Nx feature
pnpm exec nx COMMAND @bsport/sm-APP-NAME
# Or
pnpm exec nx run @bsport/sm-APP-NAME:COMMAND
```

### Run your application locally

```sh
pnpm exec nx run @bsport/sm-APP:dev:watch
```

This starts the target app in its isolated local runtime and injects the Navigation Sidebar bridge so you do not need to run the host to work on one app.

If you need only the app's own Vite server, use:

```sh
pnpm exec nx run @bsport/sm-APP:dev:single
```

### Build and update translations

```sh
pnpm exec nx translation:update @bsport/sm-APP
```

or use directly the global command

```sh
pnpm run -w translation:update
```

### Lint with eslint

```sh
pnpm exec nx lint @bsport/sm-APP
```

### Format with prettier

```sh
pnpm exec nx format @bsport/sm-APP
```

If you just want to check the wrong format

```sh
pnpm exec nx format:check @bsport/sm-APP
```

### Compile with tsc

```sh
pnpm exec nx ci:compile @bsport/sm-APP
```
