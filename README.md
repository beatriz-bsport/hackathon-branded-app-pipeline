# Ichizen - bsport Web interfaces

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repository contains the source code of all bsport's web interfaces, including the interface for our clients, their members and the widget that our client integrate of their own websites.

> Ichizen (一全) can be interpreted as:
>
> 一 (Ichi): "One" or "Unified."
> 全 (Zen): "Whole," "Complete," or "Entire."
> Together, Ichizen conveys the idea of "complete unity" or "wholeness in one"—a perfect reflection of a central place or a unified repository. It suggests harmony, integrity, and completeness

This project is configured with [pnpm workspaces](https://pnpm.io/fr/workspaces) and [NxJS](https://nx.dev/).

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

**NB:** This applies as well to any script of any project in the pnpm workspace. To run the script `[script]` in the project `@bsport/[application]`, just run

```sh
pnpm exec nx [script] @bsport/[application]
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

## Project Structure

### Structure high level

Ichizen is divided in 3 main root folders:

- `apps` containing all deployables projects that will be used by end users (web applications, widgets ...). It is divided in:
- `packages` exposing all libraries that will be used by `apps`, `tools` or externally
- `tools` exposing tools to enable Software Engineers in their work: Development experience tools, deployment scritps, CLIs...

**Note 1:** Within a folder holding business logic we want as much as possible to follow as much as possible bsport's team organization and have a split similar to what is happening in [`bsport-django`](https://gitlab.com/bsport/bsport-django/-/tree/dev/apps?ref_type=heads).

#### `apps`

Here are the current folders in apps:

- `apps/applications` which is exposing all web applications. Within this folder, each folder represent a user persona that will be using the application. ⚠️ We should try as much as possible to have applications used by different personnas and behave differently as it makes overall documentation, maintenance and testing harder.
  - `apps/applications/b2b`: Studio managers. The content of this folder follows the **Note 1**.
  - `apps/applications/b2c`: Studio members.
  - `apps/applications/saas-legacy`: bsport legacy monolith.
- `apps/widgets` which is exposing all widgets. These are codes that can be pasted in client's source code and that allows them to display pieces of bsport code and interact with our infrastructure.

#### `packages`

Packages are organized as follows:

- `common-legacy` which is the legacy package holding the business logic shared by `saas-legacy`, `widget-legacy` and [`bpsort-mobile`](https://gitlab.com/bsport/bsport-mobile).
- `ui-components` which is holding all UI components shared accross different apps. These are split by the audience and the design system that is used:
  - `fabrique` for Studio members,
  - `kaizen` for Studio managers.
- `stores` which holding all the shared business logic of the differents apps (API calls, Zustand stores, helpers ...). The content of this folder follows the **Note 1**.
- `utils` which expose common libraries exposing functions or utilities that are not holding any Product specific or business logic. It can include time/timezone management, observability tools ...

#### `tools`

TODO

### Tree structure

Here is a visual representation of what the project tree structure looks like.

```tree
apps/
├──applications
  ├── b2b
    ├── book
      ├── ...
    ├── business-insights
      ├── ...
    ├── buyables
      ├── ...
    ├── communication
      ├── ...
    ├── core-data
      ├── ...
    ├── customer-data-platform
      ├── ...
    ├── financial-services
      ├── ...
    └── staff_management
      ├── ...
  ├── b2c
  ├── global
  └── internal
└── widgets

packages
├── stores
  ├── book
    └── group-activity
  ├── business-insights
    └── report
  ├── buyables
    └── giftcard
  ├── communication
    └── email-template
  ├── core-data
  ├── customer-data-platform
  ├── financial-services
    └── invoice
  └── staff_management
├── ui-components
  ├── fabrique
  ├── global
  └── kaizen
    ├── business-components
      ├── book
        ├── ...
      ├── business-insights
        ├── ...
      ├── buyables
        ├── ...
      ├── communication
        ├── ...
      ├── core-data
        ├── ...
      ├── customer-data-platform
        ├── ...
      ├── financial-services
        ├── ...
      └── staff_management
        ├── ...
    ├── primitives
    └── tokens
└── utils
  ├── b2b-backbone
  ├── datetime
  ...

tools/
├── ci
├── config
├──  ~monorepo-utils~ => toolkit-cli (what do you think about this name ?)
└── templates
```

### pnpm workspaces

pnpm will recognize any folder as a package based on the following rules:

- it has a `package.json` file at its root
- it follows one of the patterns defined in [pnpm-workspace.yaml](./pnpm-workspace.yaml).

You can find the full list of packages by running:

```sh
pnpm run -w project:list
```

### New package

You can then import your newly package (for example `@bsport/my-cool-package`), by adding in your project's package.json the following:

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

## Troubleshooting

### Error: ENOSPC: System limit for number of file watchers reached

If you face this error on Linux, you may need to increase the max number of watches:

```sh
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
