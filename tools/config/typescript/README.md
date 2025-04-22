# Config typescript | Centralized tsconfigs

## How to use ?

To use these `tsconfig` files, you can add to your `tsconfig.*.json` an `extends` file :

```jsonc
{
  "extends": "../../relative/path/to/tools/config/typescript/src/../tsconfig.*.json",
}
```

They rely on `${configDir}` to be dynamically updated based on your location.

There is no need to install the package.

## Typescript configuration for applications and UI libraries

### Overview

| File                                                                   | Purpose                                                                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [`tsconfig.app.json`](./src/application/tsconfig.app.json)             | Base for application code. Includes aliases, strictness, and general linting support. Optimized for type-checking. |
| [`tsconfig.json`](./src/application/tsconfig.json)                     | Root/default config, referencing the others.tsconfigs.                                                             |
| [`tsconfig.node.json`](./src/application/tsconfig.node.json)           | For Node-based files like vite.config.ts. Tailored to non-browser environments.                                    |
| [`tsconfig.storybook.json`](./src/application/tsconfig.storybook.json) | For Storybook stories and its config files. Enables JS, has its own file type includes                             |
| App-level `tsconfig.\*.json`                                           | Extend from shared configs and only include what’s needed to specialize                                            |

### Specification

For you `tsconfig.json` file, you need to add references to the other files to instruct typescript to deal with them.

```jsonc
{
  "extends": "../../relative/path/to/tools/config/typescript/src/application/tsconfig.json",
  "references": [
    {
      "path": "./tsconfig.node.json",
    },
    {
      "path": "./tsconfig.storybook.json",
    },
    {
      "path": "./tsconfig.app.json",
    },
  ],
}
```

### :warning: Use `tsc -b`

To verify that your application code is checked with the typescript compiler configured with `tsconfig.app.json`, you need to tell tsc to use this specific file :

```jsonc
{
  "ci:compile": "tsc -b",
  // OR
  "ci:compile": "tsc -p ./tsconfig.app.json",
}
```

## Typescript configuration for Typescript package

A single file : [`tsconfig.json`](./src/ts-package/tsconfig.json)
