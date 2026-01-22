import path from "path";

import { LANGUAGES } from "#src/languages";

import { joinDirJsonTranslations } from "../../scripts/utils";

export function getLanguageTranslation({
  language,
  pathToI18n,
}: {
  language: string;
  pathToI18n: string;
}) {
  // Retrieve the path to the language folder
  const languagePath =
    language === LANGUAGES.ENGLISH ? "source" : `locales/${language}`;
  const languageDir = path.resolve(pathToI18n, languagePath);

  // Build a big JSON containing all strings of the language
  return {
    languageTranslations: joinDirJsonTranslations(languageDir),
    targetDir: languageDir,
  };
}
