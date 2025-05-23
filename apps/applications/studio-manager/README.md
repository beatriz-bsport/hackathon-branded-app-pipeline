# Applications for Studio Manager

This folder contains all the applications provided to bsport studio managers.

## Structure overview

The `studio-manager` folder should reflect the same structure as in the backend. Basically, we should have one folder per vertical, and each business unit will have its own subfolder.

You can find the list on [Notion](https://www.notion.so/bright-shovel-41b/Business-domains-Product-Units-1d5137e4c64080b28bbed3b2bf469e0b).

---

## Applications

All applications follow the same pattern, and have been built with the `project:create` command. This includes :

- a name starting with `@bsport/sm-`, where `sm` is the prefix standing for Studio Manager.
- a list of commands to foster the development, that we keep consistent between applications for simplicity (cf [Commands section](#commands))

### Shared applications

These applications are maintained by Ichizen maintainers, as they don't belong to a specific Vertical, and they hold a special business logic.

- [Host](./host/README.md) : A shell application where all applications are loaded via Module Federation. You can visualize a local version of the full backoffice by running `pnpm exec nx dev @bsport/sm-host`.
- [Navigation Sidebar](./navigation-sidebar/README.md) : An application dedicated to the Navigation in the Studio Manager backoffice. It is launched on every application in local development.

Other applications are maintained by Vertical developers. When they run locally, each application is in standalone mode and don't interact with other applications, except the Navigation Sidebar.

### List

Here is an exhaustive list of the currently implemented applications, with the assigned port for Module Federation in local development.

| Vertical                     | Application                                             | Port |
| ---------------------------- | ------------------------------------------------------- | ---- |
| Shared                       | [Host](./host/README.md)                                | 4000 |
| Shared                       | [Navigation Sidebar](./navigation-sidebar/README.md)    | 4050 |
| Booking                      | [Group activity](./booking/group-activity/README.md)    | 4200 |
| Buyables                     | [Giftcard](./buyables/giftcard/README.md)               | 4150 |
| Buyables                     | [Order](./buyables/order/README.md)                     | 4151 |
| Buyables                     | [Pack](./buyables/pack/README.md)                       | 4152 |
| CDP (Customer Data Platform) | [Email Templates](./cdp/email-templates/README.md)      | 4300 |
| CDP (Customer Data Platform) | [Smartlists](./cdp/smartlists/README.md)                | 4301 |
| Core Data                    | [Member list](./core-data/member/member-list/README.md) | 4100 |
| Core Data                    | [Teacher](./core-data/teacher/README.md)                | 4110 |
| Financial Services           | [Invoice](./financial-services/invoice/README.md)       | 4250 |

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
pnpm exec nx dev @bsport/sm-APP
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
