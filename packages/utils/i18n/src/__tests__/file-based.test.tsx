import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { LOCALES } from "#src/constants";
import { instanciateAppI18n } from "#src/instanciateAppI18n";
import type { Locale } from "#src/types";

// Define the translation structure type for our test
type TestTranslations = {
  main: {
    title: string;
  };
};

// Expected translations for each locale
const expectedTranslations: Record<Locale, string> = {
  en: "Main title",
  fr: "Titre principal",
  es: "Título principal",
  de: "Haupttitel",
  it: "Titolo principale",
  nl: "Hoofdtitel",
  cs: "Hlavní nadpis",
  pt: "Título principal",
};

describe("i18n with file-based translations", () => {
  it.each(LOCALES)(
    "loads translations from files for locale %s",
    async (locale) => {
      const { useTranslation, AppI18nextProvider } =
        instanciateAppI18n<TestTranslations>({
          applicationName: "test-app",
          namespaces: ["main"],
          debug: true,
        });

      const Example = () => {
        const { t, i18n, ready } = useTranslation();

        React.useEffect(() => {
          const changeLanguage = async () => {
            await i18n.changeLanguage(locale);
          };
          changeLanguage();
        }, [i18n]);

        if (!ready || i18n.language !== locale) {
          return <div>Loading...</div>;
        }

        return (
          <div>
            <h1>{t("title")}</h1>
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
    },
  );
});
