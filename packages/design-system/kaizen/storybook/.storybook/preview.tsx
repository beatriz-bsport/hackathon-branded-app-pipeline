import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";

import { setLocalAPIEnv } from "@bsport/fetch";
import "@bsport/kaizen-tokens/src/index.css";

import { authenticateDev } from "../../business-components/.storybook/auth-helper";
import { I18nProvider as FinancialServicesI18nProvider } from "../../business-components/financial-services/src/components/I18nProvider";
import {
  type Translations as FinancialServicesTranslations,
  i18nNamespacePrefix as financialServicesI18nNamespacePrefix,
  i18nNamespaces as financialServicesI18nNamespaces,
  inMemoryTranslationsLoader as financialServicesInMemoryTranslationsLoader,
  instanciateAppI18n as instanciateFinancialServicesI18n,
  switchLanguage as switchFinancialServicesLanguage,
} from "../../business-components/financial-services/src/i18n/index";
import { KaizenI18nProvider } from "../../primitive/core/src";
import {
  FLAG_EMOJIS,
  LOCALES,
  type Translations as PrimitiveTranslations,
  instanciateAppI18n,
  i18nNamespacePrefix as primitiveI18nNamespacePrefix,
  i18nNamespaces as primitiveI18nNamespaces,
  inMemoryTranslationsLoader as primitiveInMemoryTranslationsLoader,
  switchLanguage as switchPrimitiveLanguage,
} from "../../primitive/core/src/i18n/index";

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

// Initialize primitive i18n
const { i18nInstance: primitiveI18nInstance } =
  instanciateAppI18n<PrimitiveTranslations>({
    applicationName: primitiveI18nNamespacePrefix,
    namespaces: primitiveI18nNamespaces,
    inMemoryTranslationsLoader: primitiveInMemoryTranslationsLoader,
  });

// Initialize business components i18n
const { i18nInstance: financialServicesI18nInstance } =
  instanciateFinancialServicesI18n<FinancialServicesTranslations>({
    applicationName: financialServicesI18nNamespacePrefix,
    namespaces: financialServicesI18nNamespaces,
    inMemoryTranslationsLoader: financialServicesInMemoryTranslationsLoader,
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

      // When the locale global changes, set the new locale in both i18n instances
      useEffect(() => {
        switchPrimitiveLanguage(locale);
        switchFinancialServicesLanguage(locale);
      }, [locale]);

      return (
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<p>Loading translations ...</p>}>
              <KaizenI18nProvider kaizenI18nInstance={primitiveI18nInstance}>
                <FinancialServicesI18nProvider
                  kaizenI18nInstance={financialServicesI18nInstance}
                >
                  <Story />
                </FinancialServicesI18nProvider>
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
