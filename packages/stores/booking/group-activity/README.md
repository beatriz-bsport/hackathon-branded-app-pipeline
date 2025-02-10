# Group Activity Management

This project provides a structured way to manage group activities using TypeScript. It includes various scripts and configurations to facilitate development and deployment.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [How to use](#how-to-use)

## Project Structure

The project is organized into the following directories and files:

- **build**: Contains build-related scripts and configurations.
- **node_modules**: Dependencies for the project.
- **scripts**: Custom scripts for various tasks.
- **src**: Source code for the project.
  - **actions**: Contains action-related TypeScript files.
    - `groupActivity.ts`: Manages group activity actions.
  - `api.ts`: API-related actions.
  - `constants.ts`: Constant definitions.
  - `index.ts`: Entry point for actions.
  - `results.ts`: Result handling.
  - `types.ts`: Type definitions.
  - **env**: Environment-related configurations.
    - `.env`: Environment variables.
    - `.prettierrc`: Prettier configuration.
    - `eslint.config.mjs`: ESLint configuration.
    - `package.json`: Project dependencies and scripts.
- **README.md**: This file.
- **tsconfig.json**: TypeScript configuration.
- **vite-env.d.ts**: Vite environment declarations.
- **vite.config.ts**: Vite configuration.

## How to use

1. Import the package by adding this line to your project `package.json`

```jsonc
{
  // package.json
  "dependencies": {
    // Your other dependencies
    "@bsport/stores-group-activity": "workspace:*",
  },
}
```
