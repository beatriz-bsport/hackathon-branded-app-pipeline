import { select as selectWithSearch } from "inquirer-select-pro";

import { LOCALES } from "#src/languages";
import type { Language } from "#src/types";

/**
 * Show a selector in the terminal to interactively choose the languages to target
 */
export async function selectLanguages({
  initialLanguages,
}: {
  initialLanguages?: string;
}): Promise<Language[]> {
  if (initialLanguages) {
    if (initialLanguages === "*") {
      logSelection([...LOCALES]);
      return [...LOCALES];
    }

    const wrongLanguages: string[] = [];
    const selectedLanguages = initialLanguages
      .trim()
      .split(",")
      .filter((language) => {
        if (!language) {
          // Empty entries
          return false;
        }

        const sanitizedLanguage = language.toLowerCase();
        const isValidLanguage = LOCALES.includes(sanitizedLanguage as Language);

        if (!isValidLanguage) {
          wrongLanguages.push(sanitizedLanguage);
        }

        return isValidLanguage;
      });

    if (wrongLanguages.length > 0) {
      console.error(
        `❌ Please fix the name of the following languages before continuing: ${wrongLanguages.join(",")}.\n` +
          `Make sure to select only in the following list: ${LOCALES.join(",")}.`,
      );
      process.exit(1);
    }

    logSelection(selectedLanguages);
    return selectedLanguages as Language[];
  }

  const selectedLanguages = await selectWithSearch({
    message: "Select the languages to update.",
    multiple: true,
    required: true,
    canToggleAll: true,
    options: (input?: string) => {
      const baseList = LOCALES.map((locale) => ({
        name: locale.toUpperCase(),
        value: locale,
      }));

      if (!input) return baseList;

      return baseList.filter((option) =>
        option.name.includes(input.toUpperCase()),
      );
    },
  });

  logSelection(selectedLanguages);

  return selectedLanguages;
}

function logSelection(languages: string[]) {
  console.info(`✅ Selected languages: ${languages.join(",")}`);
}
