import type { Decorator } from "@storybook/react-vite";

import { AppI18nextProvider } from "#src/utils/i18n";

export const storybookDecorator: Decorator[] = [
  (Story) => (
    <AppI18nextProvider>
      <Story />
    </AppI18nextProvider>
  ),
];
