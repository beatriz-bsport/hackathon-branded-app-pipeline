import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";

import { setLocalAPIEnv } from "@bsport/fetch";
import { FLAG_EMOJIS, LOCALES, switchLanguage } from "@bsport/i18n";
import { instanciateAppI18n } from "@bsport/i18n";
import {
  KaizenI18nProvider,
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "@bsport/kaizen-primitive-core";
import "@bsport/kaizen-primitive-core/styles";

import { authenticateDev } from "./auth-helper";

import "../src/globals.css";

const { i18nInstance: kaizenI18nInstance } = instanciateAppI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader: inMemoryTranslationsLoader,
  debug: process.env.NODE_ENV !== "production",
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
            <Suspense fallback={<p>...Loading translations</p>}>
              <KaizenI18nProvider kaizenI18nInstance={kaizenI18nInstance}>
                <Story />
              </KaizenI18nProvider>
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
