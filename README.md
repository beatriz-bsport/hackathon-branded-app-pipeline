# Monorepository Example

This project is a simple implementation of how a Monorepository can be configured with [pnpm workspaces](https://pnpm.io/fr/workspaces) and [NxJS](https://nx.dev/).

## Structure

```tree
├── README.md
├── apps             // End-user applications projects
│   ├── app-1
│   └── app-2
├── node_modules
├── nx.json
├── package.json
├── packages
│   ├── constants
│   ├── types
│   └── utils
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tools
│   ├── monorepo-utils
│   └── templates
├── tsconfig.base.json
└── tsconfig.json
```
