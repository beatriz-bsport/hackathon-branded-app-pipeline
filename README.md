# Monorepository Example

This project is a simple implementation of how a Monorepository can be configured with [pnpm workspaces](https://pnpm.io/fr/workspaces) and [NxJS](https://nx.dev/).

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

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

To run an app, you can either

```sh
cd apps/applications/[application] && pnpm run build && pnpm run start
```

or

```sh
pnpm exec nx start @bsport/[application]
```

### Run Kaizen primitive components library

```sh
cd packages/design-system/kaizen/primitive-components && pnpm run dev
```

## Quick guide

### Continuous Integration commands

The monorepository comes with a set of pre-defined commands that are run when a project is edited based on various scenarios.

In your project you can set-up the following pnpm scripts that will be ran by Gitlab's CI pipelines or husky git hooks:

| pnpm script  | When is it ran ?                                                                                                   |                              Use case                               |   Diff based on    |
| :----------: | :----------------------------------------------------------------------------------------------------------------- | :-----------------------------------------------------------------: | :----------------: |
| `pre-commit` | Just before committing (don't forget to use `git add` if you'd like your changes to be added)                      | Allows to validate code before anything is committed on the project |       `HEAD`       |
| `ci:deploy`  | When a code is merged either on `dev`, `staging` or `main` (the environment is provided as first argument with $1) |         This will be the deployment script of your project          | `origin/$branch~1` |

**❗️ WARNING:** These commands will only be executed if your project has been modified compared to the base.

### CLI commands

#### Utils

To administrate the monorepository you can use the [`monorepo-utils`](/tools/monorepo-utils/README.md) command. It allows you to create new projects, commands, etc...

```sh
pnpm run utils --help
```

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

### Create project

To create a new project, you can use the `project:create` command.

```sh
pnpm run project:create
```

It will ask you some questions to create the project:

- The project name that will be used to create the folder and the `package.json` file.
- The path where the project will be created. It can be relative to the monorepo root or absolute.
- The template you want to use. The templates are located in the [`/templates`](/templates) folder. You can create your own templates and use them in this command.

Full documentation [here](/tools/monorepo-utils/README.md#projectcreate).

### Maintainance

#### Upgrade NX dependencies

To upgrade all your NX depedencies, run the following command

```sh
pnpm dlx nx migrate latest
```

You should do this regularly to ensure your dependencies are up-to-date.
You can find more regarding upgrading NX here: https://nx.dev/features/automate-updating-dependencies/

#### Upgrade pnpm

pnpm version is controlled directly in the monorepository. To upgrade pnpm version you need to:

1. Edit the version in [`./.npmrc](./.npmrc)
2. Edit the version in the `engines` section in [`./package.json`](./package.json)
3. Run the following command

```sh
pnpm i -g pnpm
```

**NB:** Do not run the command `pnpm self-update` as prompted by pnpm as it might install pnpm at a different path.

## Structure

```tree
├── README.md
├── apps                  // End-user applications
│   ├── applications
│   │   ├── micro-frontend-1
│   │   ├── ...
│   │   └── saas
│   └── widgets
│       ├── widget-1
│       ├── ...
│       └── widget
├── node_modules
├── nx.json               // NX config file
├── package.json          // Workspace package.json
├── packages
│   ├── common
│   ├── design-system
│   │   └── kaizen
│   ├── types
│   └── utils
├── pnpm-lock.yaml        // Dependencies lock file
├── pnpm-workspace.yaml   // Pnpm workspace configuration
├── tools
│   ├── monorepo-utils    // Custom made TS CLI tool to admin the monorepo
│   └── templates
├── tsconfig.base.json
└── tsconfig.json         // TS config used to run ts-node at a workspace level
```
