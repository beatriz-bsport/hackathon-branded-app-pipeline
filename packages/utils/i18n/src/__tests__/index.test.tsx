import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { LOCALES } from "#src/constants";
import { instanciateAppI18n } from "#src/instanciateAppI18n";

export type Locale = (typeof LOCALES)[number];

const translations: Record<string, Record<string, Record<string, object>>> = {
  default: {
    en: {
      main: {
        title: "Main title",
      },
    },
    es: {
      main: {
        title: "Título principal",
      },
    },
    fr: {
      main: {
        title: "Titre principal",
      },
    },
    nl: {
      main: {
        title: "Hoofdtitel",
      },
    },
    de: {
      main: {
        title: "Haupttitel",
      },
    },
    it: {
      main: {
        title: "Titolo principale",
      },
    },
    pt: {
      main: {
        title: "Título principal",
      },
    },
    cimode: {
      main: {
        title: "main.title",
      },
    },
  },
};

const getTitle = (locale: Locale) => {
  // @ts-expect-error to match i18n contructor
  return translations.default[locale].main.title;
};
const expectedTranslations: Record<Locale, string> = {
  en: getTitle("en"),
  es: getTitle("es"),
  fr: getTitle("fr"),
  nl: getTitle("nl"),
  de: getTitle("de"),
  it: getTitle("it"),
  pt: getTitle("pt"),
  cimode: getTitle("cimode"),
};

describe("i18n", () => {
  it.each(LOCALES)("useTranslation works for locale %s", async (locale) => {
    const { useTranslation, AppI18nextProvider } = instanciateAppI18n<
      (typeof translations)["default"]
    >({
      applicationName: "test-app",
      namespaces: ["default"],
      debug: true,
      inMemoryTranslationsLoader: async (locale, namespace) => {
        return translations[namespace][locale];
      },
    });

    const Example = () => {
      const { t, i18n } = useTranslation();

      React.useEffect(() => {
        i18n.changeLanguage(locale);
      }, [i18n]);

      return (
        <div>
          <h1>{t("main.title")}</h1>
          <div>Locale: {i18n.language}</div>
        </div>
      );
    };

    const { findByText, getByText } = render(
      <AppI18nextProvider>
        <Example />
      </AppI18nextProvider>,
    );

    const expectedTranslation = expectedTranslations[locale];
    expect(await findByText(expectedTranslation)).toBeInTheDocument();
    expect(getByText(`Locale: ${locale}`)).toBeInTheDocument();
  });
});
