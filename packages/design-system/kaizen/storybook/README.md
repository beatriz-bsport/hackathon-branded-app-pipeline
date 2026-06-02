# Unified Kaizen Storybook

This package builds the deployed Storybook that aggregates Kaizen primitive,
Kaizen business, and selected Studio Manager package stories.

## Adding Stories From Another Package

When adding a new source package to `.storybook/main.ts`:

- Add the package `src` directory to `stories`.
- Add any needed Tailwind content path.
- Add the package as an `implicitDependency` in `project.json` if Storybook
  needs that package built before the Storybook build.
- Add a `#src/*` resolver branch when the package uses package-local imports.
- Add only the compile-time globals that the package app build normally
  provides, such as `__SESSION__.__I18N_NAMESPACE_PREFIX__`.

## App Providers

Keep app-specific providers owned by the source package, not by this Storybook.
For example, Studio Manager apps should expose a package-local helper such as:

```tsx
// src/utils/storybook-decorator.tsx
import type { Decorator } from "@storybook/react-vite";

import { AppI18nextProvider } from "#src/utils/i18n";

export const storybookDecorator: Decorator[] = [
  (Story) => (
    <AppI18nextProvider>
      <Story />
    </AppI18nextProvider>
  ),
];
```

Then each story in that package should import and use it:

```tsx
import { storybookDecorator } from "#src/utils/storybook-decorator";

const meta = {
  decorators: storybookDecorator,
};
```

The unified Storybook preview should stay limited to shared Storybook shell
concerns, such as Kaizen i18n, theme switching, React Query defaults, and dev
authentication. Do not import app-level i18n providers or app wrappers directly
from `.storybook/preview.tsx`.

Story-specific providers, such as a seeded `QueryClientProvider`, router, or
fixture wrapper, can still live in the individual story when they are part of
that story's setup.

## Commands

```bash
pnpm dev
pnpm build
```
