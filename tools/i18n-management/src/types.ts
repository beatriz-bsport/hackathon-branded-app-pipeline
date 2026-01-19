import { LOCALES } from "./languages";

export type ProjectConfig = {
  /** Name of the project in package.json */
  name: string;
  /** Absolute path to the project in the codebase */
  pathToProject: string;
  /** Absolute path to the i18n folder of the project */
  pathToI18n: string;
  /** Absolute path to the /public/locales folder of the project */
  pathToPublicLocales: string;
  /** Whether the project has been migrated to the new i18n structure */
  hasTransifexStructure: boolean;
};

export type Language = (typeof LOCALES)[number];
