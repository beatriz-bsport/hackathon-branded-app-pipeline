# Invoice Management

This project offers a structured approach to managing invoices with TypeScript. It includes various scripts and
configurations to aid in development and deployment.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)

---

## Project Structure

The project is organized into the following directories and files:

- **build:** Contains build-related scripts and configurations.
- **node_modules:** Dependencies for the project.
- **src:** Source code for the project.
  - **actions:** Contains action-related TypeScript files.
    - **invoice.ts:** Manages invoice actions.
  - **api.ts:** API-related actions.
  - **constants.ts:** Constant definitions.
  - **index.ts:** Entry point for the project.
  - **results.ts:** Result handling.
  - **types.ts:** Type definitions.
- **.env:** Environment variables.
- **.prettierrc:** Prettier configuration.
- **eslint.config.mjs:** ESLint configuration.
- **package.json:** Project dependencies and scripts.
- **README.md:** This file.
- **tsconfig.json:** TypeScript configuration.
- **vite-env.d.ts:** Vite environment declarations.
- **vite.config.ts:** Vite configuration.

---

## Installation

Add the package to your project by updating your `package.json`:

```jsonc
{
  // package.json
  "dependencies": {
    // Your other dependencies
    "@bsport/store-financial-services-invoice": "workspace:*",
  },
}
```
