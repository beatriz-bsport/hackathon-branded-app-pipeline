# Ichizen - bsport Web interfaces

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repository contains the source code of all bsport's web interfaces, including the interface for our clients, their members and the widget that our client integrate of their own websites.

> Ichizen (一全) can be interpreted as:
>
> 一 (Ichi): "One" or "Unified."
> 全 (Zen): "Whole," "Complete," or "Entire."
> Together, Ichizen conveys the idea of "complete unity" or "wholeness in one"—a perfect reflection of a central place or a unified repository. It suggests harmony, integrity, and completeness

This project is configured with [pnpm workspaces](https://pnpm.io/fr/workspaces) and [NxJS](https://nx.dev/).

The official documentation of the Frontend can be found on [Notion](https://www.notion.so/bright-shovel-41b/Frontend-158137e4c6408076aa1ede46e67e2155).

---

## How to use

### Get started

1. Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and run

```sh
nvm install && nvm use
```

2. Install [pnpm](https://pnpm.io/)

```sh
npm install -g pnpm@$(grep pnpm_version .npmrc | cut -d '=' -f 2)
```

3. Install dependencies

```sh
pnpm install
```

### Run an application

Currently we have two different macro-projects in the monorepository :

- Our current backoffice, with an old UI, that is going to disappear in favor of the Revamped project. The old website is in this folder : [apps/applications/saas-legacy](./apps/applications/saas-legacy/README.md).
- Our Revamped frontend, with a new UI, containing many applications and packages.

Both local frontends can be connected to the dev backend and DB.

#### Run the legacy backoffice

You can either go to the location of the application and run the command

```sh
cd apps/applications/saas-legacy
pnpm run start-dev
# pnpm run start -> connect to local backend and DB
# pnpm run start-staging -> connect to staging backend and DB
# pnpm run start-production -> connect to production backend and DB
```

or use a single line command

```sh
# Using pnpm feature
pnpm --filter @bsport/saas-legacy start-dev
# Using Nx feature
pnpm exec nx start-dev @bsport/saas-legacy
# Or
pnpm exec nx run @bsport/saas-legacy:start-dev
```

#### Set the Backend API for revamped application

The API Url for the backend is abstracted and handled at monorepository level by the `set-api-environment.ts` script. Anywhere from your location in the workspace, you can run

```sh
# Connect to dev backend
pnpm run -w api-environment:set dev
# Connect to statging
pnpm run -w api-environment:set staging
# Connect to local
pnpm run -w api-environment:set local
# Connect to feature-branch
pnpm run -w api-environment:set feature-branch -fb NAME-OF-YOUR-API-FEATURE-BRANCH
```

You can always get some help on the command by running

```sh
pnpm run -w api-environment:set -h
```

#### Feature Flags (Unleash)

See [docs/feature_flags.md](./docs/feature_flags.md) for all details on feature flag setup, usage and CLI.

#### Run a revamped application

All our revamped applications work in a consistent way. Apps dedicated to the future Studio Manager backoffice are located under [apps/applications/studio-manager](./apps/applications/studio-manager/README.md).

To run an app, you can either

```sh
cd apps/applications/studio-manager/[application] && pnpm run dev
```

or

```sh
pnpm exec nx dev @bsport/[name-of-the-application]
```

#### Run all revamped application

To have a full vision of the future Studio Manager backoffice, we have a special app : the [host app](./apps/applications/studio-manager/host/README.md).

To run this host app, you can either

```sh
cd apps/applications/studio-manager/host && pnpm run dev
```

or

```sh
pnpm exec nx dev @bsport/sm-host
```

### Run Kaizen primitive components library

```sh
cd packages/design-system/kaizen/primitive/core && pnpm run dev
# Or
pnpm exec nx dev @bsport/kaizen-primitive-core
```

---

## Quick guide

### CLI commands

To administrate the monorepository, a set of CLIs commands have been introduced : creation of a project, listing of dependencies, updates of translations, etc...

You can use the `utils` command to list all of them, or take a look at our [root package.json](./package.json) or the [toolkit-cli project](/tools/toolkit-cli/README.md). The [i18n-management project](/tools/i18n-management/README.md) proposes also CLI commands related to i18n.

```sh
pnpm run -w utils --help
```

The most important ones you are likely to use :

- `pnpm run -w project:create` : to create a new application, typescript package or store package, based on our [templates](./tools/templates/README.md) ;
- `pnpm run -w translation:update` : to build and update translations files of our revamped projects ;
- `pnpm run -w sync:mismatch:list` : to list version mismatches between dependencies of our revamped projects.

### Generators

All generators are using [hygen.io](https://www.hygen.io/) to generate new components, projects (TO DO).

When you identify a pattern in your code or your project, you should consider creating a a generator:

1. (Optionnal) Run `pnpm exec hygen init self` if hygen isn't set up in your project.
2. Create your new generator: `pnpm exec hygen generator new`
3. Remember to add your generate command to the project `package.json` in the script

```json
  "scripts": {
    // ...
    "cool-component:add": "pnpm exec hygen cool-component new "
  }
```

### Create project (package or application)

To create a new project, you can use the `project:create` command.

```sh
pnpm run -w project:create
```

Find out more about :

- [the script and its parameters](/tools/toolkit-cli/README.md#projectcreate)
- [a guide to use the command to create a new application](https://www.notion.so/bright-shovel-41b/Quickstart-Create-a-new-application-17e137e4c6408017880efb0d5548df17)
- [a guide to use the command to create a new store package](https://www.notion.so/bright-shovel-41b/Quickstart-Create-and-use-a-store-package-1e0137e4c640805f9e3acd7dcbc78559)

### Run any script in the pnpm workspace

To run the script `[script]` in the project `@bsport/[application]`, just run

```sh
pnpm exec nx [script] @bsport/[application]
```

### Tools

Find out more about our monorepo tools (Nx, pnpm, ...) on [Exploit tools for mono repository management](https://www.notion.so/bright-shovel-41b/Exploit-tools-for-mono-repository-management-WIP-174137e4c640805e865ae0cfb7610bc3) guide.

---

## Monorepository Structure

### High level structure

Ichizen is divided in 3 main root folders:

- `apps` containing all deployables projects that will be used by end users (web applications, widgets ...). It is divided in:
- `packages` exposing all libraries that will be used by `apps`, `tools` or externally
- `tools` exposing tools to enable Software Engineers in their work: Development experience tools, deployment scritps, CLIs...

Find more information and details on our [codebase architecture Notion page](https://www.notion.so/bright-shovel-41b/Enhance-our-codebase-architecture-1d5137e4c64080ca9d81f6bcf3664d43).

### pnpm workspaces

pnpm will recognize any folder as a package based on the following rules:

- it has a `package.json` file at its root
- it follows one of the patterns defined in [pnpm-workspace.yaml](./pnpm-workspace.yaml).

You can find the full list of packages by running:

```sh
pnpm run -w project:list
```

### Use internal package

To use a package made by our developers in the monorepository (for example `@bsport/my-cool-package`), you need to add it manually to your project's `package.json`:

```jsonc
{
  // ...
  "dependencies": {
    "@bsport/my-cool-package": "workspace:*",
    // ...
  },
}
```

or if you don't want your package to appear in the production build

```jsonc
{
  // ...
  "devDependencies": {
    "@bsport/my-cool-package": "workspace:*",
    // ...
  },
}
```

Then, you need to run a pnpm command to finalize the Symlink between your project's node_modules, and the folder of your package :

```sh
pnpm install --ignore-scripts
```

---

## Troubleshooting

### Cleanup and Rebuild Script

If you encounter build failures, dependency resolution issues, or MODULE_NOT_FOUND errors during the post-install process, you can use our comprehensive cleanup script to resolve these issues.

#### When to use the cleanup script

The cleanup script is designed to solve common issues such as:

- **Build failures during post-install**: When packages fail to build
- **MODULE_NOT_FOUND errors**: When builds can't find essential dependencies like `vite` or `typescript` for example.
- **Outdated lockfile errors**: When `pnpm-lock.yaml` is out of sync with `package.json` files
- **Corrupted dependency cache**: When pnpm store or node_modules are in an inconsistent state
- **Workspace sync issues**: When workspace dependencies are not properly linked

#### How to run the cleanup script

⚠️ **Important Warning**: This script performs a **global cleanup** that affects ALL projects on your machine, not just this workspace.

```bash
# Using the npm script (recommended)
pnpm cleanup

# Or directly
bash tools/scripts/cleanup-and-rebuild.sh
```

**Before running**, the script will show a confirmation prompt explaining:

- All node_modules directories will be removed
- The global pnpm store will be cleared (affects ALL projects on your machine)
- All pnpm cache files will be removed
- Dependencies will be reinstalled from scratch

You must confirm with 'y' to proceed, or 'N' to cancel the operation.

#### What the script does

The cleanup script performs a complete reset and rebuild of your workspace:

1. **Global cleanup**: Removes all node_modules, global pnpm store, and cache files
2. **Fresh dependency installation**: Reinstalls all dependencies
3. **Full project rebuild**: Builds all projects in the workspace to ensure everything is properly compiled

**⚠️ Global Impact**: This script clears the global pnpm store, which means it will affect dependency cache for ALL pnpm projects on your machine, not just this workspace.

This script is particularly useful when:

- Switching between branches with different dependency versions
- After major dependency updates
- When encountering persistent build or dependency issues
- Setting up the project on a new machine

### Error: ENOSPC: System limit for number of file watchers reached

If you face this error on Linux, you may need to increase the max number of watches:

```sh
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### Your project does not find an internal package

If you have installed an internal package and your IDE tells you that it can't find the package, there are several things to check.

1. **Is the package linked to the node modules of your project ?** You can look directly into the node_modules of your project, if you find the internal package. If not (or to be sure), run `pnpm i --ignore-scripts` in your project.
2. **Is your internal package built ?** When importing an internal package, we are using the `build` of this package (as defined in its `package.json`). You should never use directly the source code of the package. To build the package, run `pnpm exec nx build @bsport/my-package-name`.

---

## Maintainance

### Upgrade NX dependencies

To upgrade all your NX depedencies, run the following command

```sh
pnpm dlx nx migrate latest
```

You should do this regularly to ensure your dependencies are up-to-date.
You can find more regarding upgrading NX here: https://nx.dev/features/automate-updating-dependencies/

### Upgrade pnpm

pnpm version is controlled directly in the monorepository. To upgrade pnpm version you need to:

1. Edit the version in [`./.npmrc`](./.npmrc)
2. Edit the version in the `engines` section in [`./package.json`](./package.json)
3. Run the following command

```sh
pnpm i -g pnpm
```

**NB:** Do not run the command `pnpm self-update` as prompted by pnpm as it might install pnpm at a different path.
