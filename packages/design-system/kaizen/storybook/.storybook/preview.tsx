import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";

import "@bsport/kaizen-tokens/src/index.css";

import { AppI18nextProvider as SmSessionI18nextProvider } from "../../../../../apps/applications/studio-manager/booking/session/src/utils/i18n";
import { authenticateDev } from "../../business/.storybook/auth-helper";
import { KaizenI18nProvider } from "../../primitive/core/src";
import {
  FLAG_EMOJIS,
  LOCALES,
  type Translations as PrimitiveTranslations,
  instanciateAppI18n,
  i18nNamespacePrefix as primitiveI18nNamespacePrefix,
  i18nNamespaces as primitiveI18nNamespaces,
  inMemoryTranslationsLoader as primitiveInMemoryTranslationsLoader,
  switchLanguage,
} from "../../primitive/core/src/i18n/index";

// Set API environment to dev for local storybook
if (typeof window !== "undefined") {
  window.__SM_RUNTIME__ = {
    API_BASE_URL: "https://api.dev.bsport.io",
  };
}

// Authenticate with dev credentials on Storybook load
if (typeof window !== "undefined") {
  authenticateDev().catch((error) => {
    console.warn("Failed to authenticate in Storybook:", error);
  });
}

// Initialize primitive i18n
const { i18nInstance: primitiveI18nInstance } =
  instanciateAppI18n<PrimitiveTranslations>({
    applicationName: primitiveI18nNamespacePrefix,
    namespaces: primitiveI18nNamespaces,
    inMemoryTranslationsLoader: primitiveInMemoryTranslationsLoader,
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
      const { locale = "en" } = context.globals || {};

      // Broadcasts to every i18n instance on the page — Kaizen and any
      // team-owned area (e.g. sm-session)
      useEffect(() => {
        switchLanguage(locale);
      }, [locale]);

      return (
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<p>Loading translations ...</p>}>
              <KaizenI18nProvider kaizenI18nInstance={primitiveI18nInstance}>
                <SmSessionI18nextProvider>
                  <Story />
                </SmSessionI18nextProvider>
              </KaizenI18nProvider>
            </Suspense>
          </QueryClientProvider>
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
