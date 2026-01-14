import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import React, { Suspense, useEffect } from "react";

import "@bsport/kaizen-tokens/src/index.css";

import { I18nProvider } from "../financial-services/src/components/I18nProvider";
import {
  FLAG_EMOJIS,
  LOCALES,
  type Translations,
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
  instanciateAppI18n,
  switchLanguage,
} from "../financial-services/src/i18n/index";

import "../../primitive/core/src/globals.css";
import "../financial-services/src/globals.css";

const { i18nInstance } = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader,
});

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const { locale } = context.globals || { locale: "en" };

      useEffect(() => {
        switchLanguage(locale || "en");
      }, [locale]);

      return (
        <React.StrictMode>
          <Suspense fallback={<p>Loading translations ...</p>}>
            <I18nProvider kaizenI18nInstance={i18nInstance}>
              <Story />
            </I18nProvider>
          </Suspense>
        </React.StrictMode>
      );
    },
    withThemeByClassName({
      themes: {
        light: "kz-light",
        dark: "kz-dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    backgrounds: {
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
