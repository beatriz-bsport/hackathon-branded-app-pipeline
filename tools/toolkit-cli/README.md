# Monorepository scripts

Scripts providing resources to administrate monorepository.

## Usage

To use any command you can either run:

- For monorepo root folder: `node monorepo-utils [options] [command]` or `pnpm run utils [options] [command]`
- For this folder: `node index.js [options] [command]`

You can directly run the script to have the full list of commands available.

All commands are provided with a `--help` to describe the arguments / options that are available to you.

### **tmp** folder

The `__tmp__` folder is used to store temporary scripts that do not need to be versioned.
You can run any script from this folder using the following command: `pnpm exec ts-node ./__tmp__/your-script.ts`.

## Commands list

**Warning:** Everything between `CommandListStart` and `CommandListEnd` is generated using the following command: `node monorepo-utils command-list --format markdown --output readme` (or `pnpm run command:list --format markdown --output readme`). Do not try to remove these markers nor add documentation between them.

----CommandListStart----

### Table of Contents

[api-environment:set](#api-environmentset)
[command:create](#commandcreate)
[command:list](#commandlist)
[db:sync](#dbsync)
[feature-flags-environment:set](#feature-flags-environmentset)
[legacy:migrate](#legacymigrate)
[open:branch:list](#openbranch-list)
[project:clean](#projectclean)
[project:create](#projectcreate)
[project:dependencies:list](#projectdependencies-list)
[project:import](#projectimport)
[project:list](#projectlist)
[test:setup](#testsetup)

### `api-environment:set`

This script allows to set the API environment variables in fetch package.

**Usage:** `@bsport/toolkit-cli api-environment:set [options] <env>`

|  Arg  |                                                 Description                                                 |
| :---: | :---------------------------------------------------------------------------------------------------------: |
| `env` | Environment to set for API variables. Accepted values are : dev, local, staging, production, feature-branch |

|              Option              |                                                                                                                                                           Description                                                                                                                                                           |
| :------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `-fb, --feature-branch <string>` | Identifier of a feature branch. Accepted values are : alpha, beta, delta, epsilon, eta, gamma, iota, kappa, lambda, mu, omega, phi, sigma, theta, zeta, arceus, caterie, charizard, charmander, ditto, evoli, goupelin, jigglypuff, magikarp, mewtwo, onix, pikachu, slowpoke, togepi, torchic, totodile, turtwig (default: "") |
|          `-q, --quiet`           |                                                                                                                                  Suppress all output, unless an error occurs. (default: false)                                                                                                                                  |
|           `-h, --help`           |                                                                                                                                                    display help for command                                                                                                                                                     |

### `command:create`

Creates a new command in the monorepo-utils project.

**Usage:** `@bsport/toolkit-cli command:create [options] <command-name>`

|      Arg       |                                        Description                                         |
| :------------: | :----------------------------------------------------------------------------------------: |
| `command-name` | Command name usually named as {namespace}:{action} (ex: project:create, command:delete...) |

|      Option       |                                          Description                                          |
| :---------------: | :-------------------------------------------------------------------------------------------: |
| `--dir <dirPath>` | You can specify a custom target directory for the script (default: src/commands/commandName). |
|   `-q, --quiet`   |                 suppress all output, unless an error occurs. (default: false)                 |
|   `-h, --help`    |                                   display help for command                                    |

### `command:list`

Allows to list all the utils command from the monorepo.

**Usage:** `@bsport/toolkit-cli command:list [options]`

|         Option          |                          Description                          |
| :---------------------: | :-----------------------------------------------------------: |
|      `-q, --quiet`      | suppress all output, unless an error occurs. (default: false) |
| `-o, --output <output>` |    output the list of commands in a file. (default: "cli")    |
| `-f, --format <format>` |   output the list of commands in a file. (default: "text")    |
|      `-h, --help`       |                   display help for command                    |

### `db:sync`

Sync production DB backup to other environment

**Usage:** `@bsport/toolkit-cli db:sync [env_name]`

|    Arg     |                                                    Description                                                    |
| :--------: | :---------------------------------------------------------------------------------------------------------------: |
| `env_name` | Environement name to feed data to. Valid inputs: UAT-1, UAT-2, UAT-3, UAT-4, Staging, Dev (staging-core-services) |

|    Option    |       Description        |
| :----------: | :----------------------: |
| `-h, --help` | display help for command |

### `feature-flags-environment:set`

Set Unleash Feature Flags environment variables in @bsport/sm-backbone (.env.local/.env.production) and rebuild the package.

**Usage:** `@bsport/toolkit-cli feature-flags-environment:set [options] <env>`

|  Arg  |                                                      Description                                                      |
| :---: | :-------------------------------------------------------------------------------------------------------------------: |
| `env` | Environment to set for Feature Flags variables. Accepted values are : dev, local, staging, production, feature-branch |

|         Option          |                          Description                          |
| :---------------------: | :-----------------------------------------------------------: |
| `--proxy-url <string>`  | Unleash proxy URL (e.g., http://localhost:4242/api/frontend)  |
| `--client-key <string>` |                   Unleash client key/token                    |
|      `-q, --quiet`      | Suppress all output, unless an error occurs. (default: false) |
|      `-h, --help`       |                   display help for command                    |

### `legacy:migrate`

An interactive CLI to import legacy bsport projects : bsport-saas, bsport-widget

**Usage:** `@bsport/toolkit-cli legacy:migrate [options]`

|            Option            |                                      Description                                      |
| :--------------------------: | :-----------------------------------------------------------------------------------: |
|        `-q, --quiet`         |             suppress all output, unless an error occurs. (default: false)             |
| `-b, --base-branch <string>` | The monorepository branch to use as base to create the new branches (default: "main") |
|         `-h, --help`         |                               display help for command                                |

### `open:branch:list`

List open branches of a gitlab repo which have been created less than X months ago

**Usage:** `@bsport/toolkit-cli open:branch:list [options] <initial-repository-path>`

|            Arg            |                          Description                           |
| :-----------------------: | :------------------------------------------------------------: |
| `initial-repository-path` | Filesystem path where the target repository is locally located |

|              Option              |                                   Description                                    |
| :------------------------------: | :------------------------------------------------------------------------------: |
| `-gp, --gitlab-project <string>` |     Name of the Gitlab Repository. Valid inputs : bsport-saas, bsport-widget     |
|   `-gi, --gitlab-id <string>`    | If you don't provide a gitlabProject, you must provide a valid gitlab project Id |
|      `-m, --month <string>`      | The script will keep only branches created less than $month ago. (default: "4")  |
|          `-q, --quiet`           |          suppress all output, unless an error occurs. (default: false)           |
|           `-h, --help`           |                             display help for command                             |

### `project:clean`

Clean a bsport project that have been imported in the monorepository.

**Usage:** `@bsport/toolkit-cli project:clean [options] <project-path>`

|      Arg       |                    Description                     |
| :------------: | :------------------------------------------------: |
| `project-path` | The path of the project inside the monorepository. |

|       Option        |                                                             Description                                                             |
| :-----------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
| `-r, --repo <repo>` | which specific bsport repository the script is cleaning. Valid inputs : bsport-saas, bsport-widget, bsport-commons-js (default: "") |
|    `-q, --quiet`    |                                    suppress all output, unless an error occurs. (default: false)                                    |
|    `-h, --help`     |                                                      display help for command                                                       |

### `project:create`

Creates a new project from a template and installs its dependencies and:

- sets `"name": "@bsport/{params.name}"` in package.json,
- sets `"description": "params.title"` in package.json,
- sets `"author": "{gitUserName} <{gitUserEmail}>"` in package.json (being pulled from the local git configuration),
- removes the prefix `placeholder:` from all scripts names in `package.json` (if any),
- if the `package.json` file of the template includes a `project:init` script, runs `pnpm run project:init --name {params.name} --title {params.title}`,
- if the project is not recognised by the monorepo, prints a warning and suggests to add it to pnpm-workspace.yaml.

**Usage:** `@bsport/toolkit-cli project:create [options]`

|          Option          |                                                          Description                                                           |
| :----------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
|  `--name <projectName>`  |                                               The name of the project to create.                                               |
| `--title <projectTitle>` |                                              Human readable title of the project.                                              |
|  `--path <projectPath>`  | The path where the project should be created (relative from the monorepo root path). Ex: apps/applications/specialist/test-app |
| `--template <template>`  |                                       Template that should be the base for the project.                                        |
|      `-q, --quiet`       |                                 suppress all output, unless an error occurs. (default: false)                                  |
|       `-h, --help`       |                                                    display help for command                                                    |

### `project:dependencies:list`

List for a list of projects their monorepo dependencies and which monorepo projects are using them.

**Usage:** `@bsport/toolkit-cli project:dependencies:list [options]`

|              Option              |                                           Description                                            |
| :------------------------------: | :----------------------------------------------------------------------------------------------: |
| `-p, --projects <project-names>` | Project names to list dependencies for (as comma separated string). If empty, list all projects. |
|    `-d, --only-dependencies`     |                             Only list dependencies. (default: false)                             |
|       `-u, --only-used-by`       |                    Only list projects that use the project. (default: false)                     |
|     `-f, --format <format>`      |         format of the output. Available options: json, text, markdown (default: "text")          |
|           `-h, --help`           |                                     display help for command                                     |

### `project:import`

Imports a local project structure with all git commits to a monorepo.

**Usage:** `@bsport/toolkit-cli project:import [options] <target-path> <filesystem-path>`

|        Arg        |                                  Description                                   |
| :---------------: | :----------------------------------------------------------------------------: |
|   `target-path`   | Monorepo path where the project will be imported (ex: apps/applications/saas). |
| `filesystem-path` |           Filesystem path where the repository is currently located.           |

|           Option            |                                                 Description                                                 |
| :-------------------------: | :---------------------------------------------------------------------------------------------------------: |
|   `-b, --branch <branch>`   |                     branch from which the project will be imported. (default: "master")                     |
|   `-r, --remote <remote>`   |                     remote from which the project will be imported. (default: "origin")                     |
|    `--tempDir <tempDir>`    |                          temporary cache directory that will be used to copy files                          |
| `--tempBranch <tempBranch>` | temporary branch used in the project's repository to make the migration. (default: "temp/prepare_monorepo") |
| `--tempRemote <tempRemote>` |               temporary remote added in the monorepo to import the project. (default: "temp")               |
|     `-ncu, --noCleanUp`     |  disables the post script clean-up that removes temporary folders, remotes and branches. (default: false)   |
|        `-q, --quiet`        |                        suppress all output, unless an error occurs. (default: false)                        |
|        `-h, --help`         |                                          display help for command                                           |

### `project:list`

Lists all monorepository projects

**Usage:** `@bsport/toolkit-cli project:list [options]`

|         Option          |                                                  Description                                                   |
| :---------------------: | :------------------------------------------------------------------------------------------------------------: |
|    `-a, --affected`     |      only list projects that will be affected by the current changes (compared to base). (default: false)      |
|   `-b, --base <base>`   |    only available if --affected is specified - base branch / commit to compare to. (default: "origin/main")    |
| `-f, --format <format>` |             format of the output. Available options: json, text, markdown, yaml (default: "text")              |
| `-t, --target <target>` | target where the output will be displayed. Available options: cli, pr, deployment, gh-actions (default: "cli") |
|      `-h, --help`       |                                            display help for command                                            |

### `test:setup`

Interactive setup for Vitest testing configuration in packages and tools

**Usage:** `@bsport/toolkit-cli test:setup [options] [package-path]`

|      Arg       |                Description                 |
| :------------: | :----------------------------------------: |
| `package-path` | Optional package path or name to configure |

|        Option         |                             Description                              |
| :-------------------: | :------------------------------------------------------------------: | ------- |
|      `--dry-run`      | Show what would be generated without creating files (default: false) |
|       `--force`       |       Overwrite existing configuration files (default: false)        |
| `--env <environment>` |                        Test environment: node                        | browser |
|       `--react`       |                 Include React Testing Library setup                  |
|        `--msw`        |                    Include MSW mock server setup                     |
|     `--handlers`      |                 Generate basic MSW handlers template                 |
|     `-q, --quiet`     |            Suppress output except errors (default: false)            |
|     `-h, --help`      |                       display help for command                       |

----CommandListEnd----
