import React, { Suspense, useEffect } from "react";
import type { Preview } from "@storybook/react";
import "@bsport/kaizen-tokens/src/index.css";
import { withThemeByClassName } from "@storybook/addon-themes";
import { I18nextProvider, FLAG_EMOJIS, LOCALES } from "@bsport/i18n";
import { i18nInstance } from "./i18n";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const { locale } = context.globals;

      // When the locale global changes, set the new locale in i18n
      useEffect(() => {
        i18nInstance.changeLanguage(locale);
      }, [locale]);

      return (
        <Suspense fallback={<p>Loading translations ...</p>}>
          <I18nextProvider i18n={i18nInstance}>
            <Story />
          </I18nextProvider>
        </Suspense>
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
