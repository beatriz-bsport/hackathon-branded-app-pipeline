import { HttpResponse, http } from "msw";

import { LOCALES } from "#src/constants";

export type Locale = (typeof LOCALES)[number];

// Translation fixtures - inline data to avoid import issues
const translationFixtures: Record<Locale, Record<string, string>> = {
  en: {
    title: "Main title",
  },
  fr: {
    title: "Titre principal",
  },
  es: {
    title: "Título principal",
  },
  de: {
    title: "Haupttitel",
  },
  it: {
    title: "Titolo principale",
  },
  nl: {
    title: "Hoofdtitel",
  },
  pt: {
    title: "Título principal",
  },
  cimode: {
    title: "title",
  },
};

export const handlers = [
  // Match translation file requests: /locales/{locale}/test-app_main.json
  http.get(/\/locales\/([^/]+)\/test-app_main\.json$/, ({ request }) => {
    const url = new URL(request.url);
    const pathMatch = url.pathname.match(
      /\/locales\/([^/]+)\/test-app_main\.json$/,
    );

    if (pathMatch) {
      let locale = pathMatch[1];

      // Handle fallbacks for locales like en-US -> en
      if (locale === "en-US" || locale === "en-GB") {
        locale = "en";
      }

      const translationData = translationFixtures[locale as Locale];
      if (translationData) {
        return HttpResponse.json(translationData);
      }
    }

    // Return 404 for unknown files
    return HttpResponse.json({}, { status: 404 });
  }),
];
