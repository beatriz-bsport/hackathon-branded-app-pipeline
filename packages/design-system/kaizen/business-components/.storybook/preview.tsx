import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";

import { setLocalAPIEnv } from "@bsport/fetch";
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
import { authenticateDev } from "./auth-helper";

import "../../primitive/core/src/globals.css";
import "../financial-services/src/globals.css";

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
  inMemoryTranslationsLoader,
});

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
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
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<p>Loading translations ...</p>}>
              <I18nProvider kaizenI18nInstance={i18nInstance}>
                <Story />
              </I18nProvider>
            </Suspense>
          </QueryClientProvider>
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
