# Monorepository Example

This project is a simple implementation of how a Monorepository can be configured with [pnpm workspaces](https://pnpm.io/fr/workspaces) and [NxJS](https://nx.dev/).

## Structure

```tree
├── README.md
├── apps                   // End-user applications projects
│   └── app-1
├── node_modules
├── nx.json               // NX config file
├── package.json          // Workspace package.json
├── packages
│   ├── constants
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
