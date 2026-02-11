import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import React, { useEffect } from "react";

import { setLocalAPIEnv } from "@bsport/fetch";
import { FLAG_EMOJIS, LOCALES, switchLanguage } from "@bsport/i18n";
import "@bsport/kaizen-primitive-core/styles";

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

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const { locale } = context.globals || { locale: "en" };

      useEffect(() => {
        switchLanguage(locale || "en");
      }, [locale]);

      return (
        <React.StrictMode>
          <Story />
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
