import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import React, { Suspense, useEffect } from "react";

import "@bsport/kaizen-tokens/src/index.css";

// Business components i18n
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
          <Suspense fallback={<p>Loading translations ...</p>}>
            <KaizenI18nProvider kaizenI18nInstance={primitiveI18nInstance}>
              <FinancialServicesI18nProvider
                kaizenI18nInstance={financialServicesI18nInstance}
              >
                <Story />
              </FinancialServicesI18nProvider>
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
