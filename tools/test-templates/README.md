# Test Setup Templates

This directory contains template files used by the `test:setup` command to generate Vitest testing configurations for packages and tools in the monorepo.

## Template Structure

### Configuration Templates

- `vitest.config.node.ts.template` - Vitest config for Node.js environment
- `vitest.config.browser.ts.template` - Vitest config for browser/jsdom environment

### Setup Templates

- `test-setup/react.ts.template` - React Testing Library setup with jest-dom matchers
- `test-setup/msw.ts.template` - MSW (Mock Service Worker) setup for API mocking

### Test Example Templates

- `test-examples/basic.test.ts.template` - Basic test suite template for Node.js packages
- `test-examples/react.test.tsx.template` - React component test template

### Handler Templates

- `handlers/example.ts.template` - Basic MSW handlers template

## Template Placeholders

Templates use `{{PLACEHOLDER}}` syntax for dynamic content replacement:

- `{{PACKAGE_NAME}}` - The package name (e.g., `@bsport/utils-form`)
- `{{PACKAGE_DISPLAY_NAME}}` - Human readable package name for test descriptions
- `{{SETUP_FILES}}` - Comma-separated list of setup file paths
- `{{JSX_CONFIG}}` - JSX configuration block when React is enabled
- `{{CONFIG_FUNCTION}}` - Either `createVitestConfig` or `createVitestBrowserConfig`

## Usage

These templates are automatically used by the `test:setup` command:

```bash
# Interactive mode
pnpm run utils test:setup

# Non-interactive mode
pnpm run utils test:setup packages/utils/form --env browser --react --msw
```

The command loads the appropriate templates based on the configuration options selected.
