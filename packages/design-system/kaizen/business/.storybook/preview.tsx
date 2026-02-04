import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import React, { Suspense, useEffect } from "react";

import { setLocalAPIEnv } from "@bsport/fetch";
import "@bsport/kaizen-primitive-core/styles";

import { KaizenBusinessI18nProvider } from "../src/components/structural/i18n-provider";
import {
  FLAG_EMOJIS,
  LOCALES,
  type Translations,
  i18nNamespacePrefix,
  i18nNamespaces,
  instanciateAppI18n,
  switchLanguage,
} from "../src/i18n";
import { authenticateDev } from "./auth-helper";

// Set API environment to dev for local storybook
if (typeof window !== "undefined") {
  setLocalAPIEnv("dev");
}

// Authenticate with dev credentials on Storybook load
if (typeof window !== "undefined") {
  authenticateDev().catch((error) => {
    console.warn("Failed to authenticate in Storybook:", error);
  });
}

const { i18nInstance } = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
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
            <KaizenBusinessI18nProvider kaizenI18nInstance={i18nInstance}>
              <Story />
            </KaizenBusinessI18nProvider>
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
      options: {
        default: { name: "default", value: "#f0f0f0" },
        strong: { name: "strong", value: "#484848" },
      },
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
