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

[command:create](#commandcreate)
[command:list](#commandlist)
[db:sync](#dbsync)
[project:create](#projectcreate)
[project:dependencies:list](#projectdependencies-list)
[project:import](#projectimport)
[project:list](#projectlist)

### `command:create`

Creates a new command in the monorepo-utils project.

__Usage:__ `@bsport/monorepo-utils-tools command:create [options] <command-name>`

| Arg | Description |
|:----:|:----:|
| `command-name` | Command name usually named as {namespace}:{action} (ex: project:create, command:delete...) |

| Option | Description |
|:----:|:----:|
| `--dir <dirPath>` | You can specify a custom target directory for the script (default: src/commands/commandName). |
| `-q, --quiet` | suppress all output, unless an error occurs. (default: false) |
| `-h, --help` | display help for command |

### `command:list`

Allows to list all the utils command from the monorepo.

__Usage:__ `@bsport/monorepo-utils-tools command:list [options]`

| Option | Description |
|:----:|:----:|
| `-q, --quiet` | suppress all output, unless an error occurs. (default: false) |
| `-o, --output <output>` | output the list of commands in a file. (default: "cli") |
| `-f, --format <format>` | output the list of commands in a file. (default: "text") |
| `-h, --help` | display help for command |

### `db:sync`

Sync production DB backup to other environment

__Usage:__ `@bsport/monorepo-utils-tools db:sync [env_name]`

| Arg | Description |
|:----:|:----:|
| `env_name` | Environement name to feed data to. Valid inputs: UAT-1, UAT-2, UAT-3, UAT-4, Staging, Dev (staging-core-services) |

| Option | Description |
|:----:|:----:|
| `-h, --help` | display help for command |

### `project:create`


Creates a new project from a template and installs its dependencies and:

 - sets `"name": "@bsport/{params.name}"` in package.json,
 - sets `"description": "params.title"` in package.json,
 - sets `"author": "{gitUserName} <{gitUserEmail}>"` in package.json (being pulled from the local git configuration),
 - removes the prefix `placeholder:` from all scripts names in `package.json` (if any),
 - if the `package.json` file of the template includes a `project:init` script, runs `pnpm run project:init --name {params.name} --title {params.title}`,
 - if the project is not recognised by the monorepo, prints a warning and suggests to add it to pnpm-workspace.yaml.
 

__Usage:__ `@bsport/monorepo-utils-tools project:create [options]`

| Option | Description |
|:----:|:----:|
| `--name <projectName>` | The name of the project to create. |
| `--title <projectTitle>` | Human readable title of the project. |
| `--path <projectPath>` | The path where the project should be created (relative from the monorepo root path). Ex: apps/applications/specialist/test-app |
| `--template <template>` | Template that should be the base for the project. |
| `-q, --quiet` | suppress all output, unless an error occurs. (default: false) |
| `-h, --help` | display help for command |

### `project:dependencies:list`

List for a list of projects their monorepo dependencies and which monorepo projects are using them.

__Usage:__ `@bsport/monorepo-utils-tools project:dependencies:list [options]`

| Option | Description |
|:----:|:----:|
| `-p, --projects <project-names>` | Project names to list dependencies for (as comma separated string). If empty, list all projects. |
| `-d, --only-dependencies` | Only list dependencies. (default: false) |
| `-u, --only-used-by` | Only list projects that use the project. (default: false) |
| `-f, --format <format>` | format of the output. Available options: json, text, markdown (default: "text") |
| `-h, --help` | display help for command |

### `project:import`

Imports a local project structure with all git commits to a monorepo.

__Usage:__ `@bsport/monorepo-utils-tools project:import [options] <target-path> <filesystem-path>`

| Arg | Description |
|:----:|:----:|
| `target-path` | Monorepo path where the project will be imported (ex: apps/applications/saas). |
| `filesystem-path` | Filesystem path where the repository is currently located. |

| Option | Description |
|:----:|:----:|
| `-b, --branch <branch>` | branch from which the project will be imported. (default: "master") |
| `-r, --remote <remote>` | remote from which the project will be imported. (default: "origin") |
| `-h, --help` | display help for command |

### `project:list`

Lists all monorepository projects

__Usage:__ `@bsport/monorepo-utils-tools project:list [options]`

| Option | Description |
|:----:|:----:|
| `-a, --affected` | only list projects that will be affected by the current changes (compared to base). (default: false) |
| `-b, --base <base>` | only available if --affected is specified - base branch / commit to compare to. (default: "origin/main") |
| `-f, --format <format>` | format of the output. Available options: json, text, markdown, yaml (default: "text") |
| `-t, --target <target>` | target where the output will be displayed. Available options: cli, pr, deployment, gh-actions (default: "cli") |
| `-h, --help` | display help for command |

----CommandListEnd----
