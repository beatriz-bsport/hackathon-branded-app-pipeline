import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import React, { Suspense, useEffect } from "react";

import "@bsport/kaizen-tokens/src/index.css";

import { KaizenI18nProvider } from "../../primitive/core/src";
import {
  FLAG_EMOJIS,
  LOCALES,
  type Translations,
  i18nNamespacePrefix,
  i18nNamespaces,
  instanciateAppI18n,
  switchLanguage,
} from "../../primitive/core/src/i18n/index";

const { i18nInstance } = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
});

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const { locale } = context.globals;

      // When the locale global changes, set the new locale in i18n
      useEffect(() => {
        switchLanguage(locale);
      }, [locale]);

      return (
        <React.StrictMode>
          <Suspense fallback={<p>Loading translations ...</p>}>
            <KaizenI18nProvider kaizenI18nInstance={i18nInstance}>
              <Story />
            </KaizenI18nProvider>
          </Suspense>
        </React.StrictMode>
      );
    },
    withThemeByClassName({
      themes: {
        // nameOfTheme: 'classNameForTheme',
        light: "kz-light",
        dark: "kz-dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    backgrounds: {
      // Do not provide default value as the property overrides
      // background-color which messes with light/dark mode switching
      values: [
        { name: "default", value: "#f0f0f0" },
        { name: "strong", value: "#484848" },
      ],
    },
  },

  tags: ["autodocs"],
};

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "I18n locale",
    toolbar: {
      icon: "globe",
      items: LOCALES.map((locale) => ({
        value: locale,
        title: locale.toUpperCase(),
        right: FLAG_EMOJIS[locale],
      })),
      showName: true,
    },
  },
};

export default preview;
