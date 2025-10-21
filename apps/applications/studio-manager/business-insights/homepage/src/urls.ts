import { getIsoDateString } from "@bsport/datetime-manipulation";

import { LANGUAGES } from "#src/utils/i18n";

const BLOG_LANGUAGES: string[] = [
  LANGUAGES.FRENCH,
  LANGUAGES.ENGLISH,
  LANGUAGES.GERMAN,
  LANGUAGES.DUTCH,
  LANGUAGES.SPANISH,
  LANGUAGES.ITALIAN,
];

export const PUBLIC_URLS = {
  PRODUCT_UPDATES:
    "https://bright-shovel-41b.notion.site/Releases-EN-version-8591033ee29e4fea815c233a41f3eecb",
  BLOG: (language: string) => {
    const finalLanguage = BLOG_LANGUAGES.includes(language)
      ? language
      : LANGUAGES.ENGLISH;
    return `https://pro.bsport.io/${finalLanguage}/blog`;
  },
};

export const LEGACY_URLS = {
  CALENDAR_OFFER: ({ date, sessionId }: { date: Date; sessionId: number }) =>
    `/calendar/${getIsoDateString(date).replaceAll("-", "/")}/${sessionId}`,
} as const;
