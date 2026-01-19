import { input } from "@inquirer/prompts";
import { Command } from "commander";
import path from "path";

import { LANGUAGES } from "#src/languages";
import { replaceTermInString } from "#src/utils/replace-term-in-string";
import { selectLanguages } from "#src/utils/select-languages";
import { selectProjects } from "#src/utils/select-projects";

import {
  ensureDir,
  getFlattenKeyValuePairs,
  joinDirJsonTranslations,
} from "../utils";
import { generateTranslationUpdateXlsx } from "./xlsx-utils";

const program = new Command();

program
  .name("i18n:new-naming:preview")
  .description(
    "Generate an excel for preview and validation of new terms rollout.\n" +
      "For each language you want to edit, you need to provide the singular and plural forms of the previous and the new terms.\n" +
      "The script is case sensitive, but will apply your inputs with lower case and first letter in upper case as well.\n" +
      "Example: Private pass/Private passes => It will handle Private pass (input), Private Pass (1st letter upper case), private pass (lowercase).\n" +
      "If you don't provide any language, an interactive selector will help you make the configuration.",
  )
  .option(
    "-p, --projects <string>",
    "Projects to scan. Separate the names with ','. To select them all, set to `*`",
  )
  .option(
    "-l, --languages <string>",
    "Languages to scan. Separate the names with ','. To select them all, set to `*`",
  )
  .action(main)
  .parse(process.argv);

type LanguageConfig = {
  id: string;
  previousTermSingular: string;
  previousTermPlural: string;
  newTermSingular: string;
  newTermPlural: string;
};

type TrackingDataStructure = {
  [key: string]: {
    previousString: string;
    newString: string;
  };
};

async function main({
  projects,
  languages,
}: {
  projects?: string;
  languages?: string;
}) {
  // Step 1 - Select projects to scan and transform
  const selectedProjects = await selectProjects({
    initialProjects: projects,
  });

  // Step 2 - Select languages to scan and transform
  const selectedLanguages = await selectLanguages({
    initialLanguages: languages,
  });

  // Step 3 - Request inputs with previous and new terms
  let title: string = "";
  const languagesConfigs: LanguageConfig[] = [];
  {
    for (const language of selectedLanguages) {
      const previousTermSingular = await input({
        message: `${language} | What is the word you wish to replace (singular) ?`,
        required: true,
      });

      const previousTermPlural = await input({
        message: `${language} | What is the word you wish to replace (plural) ?`,
        required: true,
        default: previousTermSingular,
      });

      const newTermSingular = await input({
        message: `${language} | What is the new term to replace with (singular) ?`,
        required: true,
      });

      const newTermPlural = await input({
        message: `${language} | What is the new term to replace with (plural) ?`,
        required: true,
        default: newTermSingular,
      });

      languagesConfigs.push({
        id: language,
        previousTermSingular,
        previousTermPlural,
        newTermSingular,
        newTermPlural,
      });

      if (!title) {
        // Define title for the xlsx file
        title = `transform-${previousTermSingular.toLowerCase()}-into-${newTermSingular.toLowerCase()}`;
      }
    }
  }

  // Step 4 - Retrieve all the occurences of the change
  const translationsUpdates = new Map<
    string, // unique key: {project}.{namespace}.{flattenKey}
    TrackingDataStructure
  >();
  for (const project of selectedProjects) {
    for (const languageConfig of languagesConfigs) {
      const { id: language, ...termConfig } = languageConfig;
      // Retrieve the path to the language folder
      const languagePath =
        language === LANGUAGES.ENGLISH ? "source" : `locales/${language}`;
      const languageDir = path.resolve(project.pathToI18n, languagePath);

      // Build a big JSON containing all strings of the language
      const languageTranslations = joinDirJsonTranslations(languageDir);

      // Convert this JSON in a list of flatten-key/string pair
      const flattenKeyValuePairs =
        getFlattenKeyValuePairs(languageTranslations);

      // Iterate through the list to detect the term
      flattenKeyValuePairs.map((pair) => {
        const { isPresent, updatedString } = replaceTermInString({
          sourceString: pair.value,
          ...termConfig,
        });

        if (isPresent) {
          const uniqueIdentifier = `${project.name}.${pair.flattenKey}`;

          // Possibly defined in other languages
          const currentValue = translationsUpdates.get(uniqueIdentifier) ?? {};

          const updatedObject = {
            ...currentValue,
            [language]: {
              previousString: pair.value,
              newString: updatedString,
            },
          } satisfies TrackingDataStructure;

          translationsUpdates.set(uniqueIdentifier, updatedObject);
        }
      });
    }
  }

  // Step 5 - Convert into list of rows
  const rows = Array.from(translationsUpdates).map(([compoundKey, data]) => {
    const [project, namespace, ...flattenKeyParts] = compoundKey.split(".");
    const flattenKeyInNamespace = flattenKeyParts.join(".");

    const row: Array<string | boolean> = [
      project,
      namespace,
      flattenKeyInNamespace,
    ];

    for (const language of selectedLanguages) {
      const entry = data[language];
      row.push(
        // Column {lang}_previous
        entry?.previousString ?? "",
        // Column {lang}_new
        entry?.newString ?? "",
        // Column {lang}_validated
        false,
      );
    }
    return row;
  });

  // Step 6 - Write XLSX file out of the data in __tmp__
  const destDir = path.join(__dirname, "../../__tmp__");
  ensureDir(destDir);
  generateTranslationUpdateXlsx({
    rows,
    selectedLanguages,
    title: `__tmp__/${title}`,
  });

  console.info(
    "🚀 Your XLSX has been generated:",
    `tools/i18n-management/__tmp__/${title}.xlsx`,
  );
  console.group("👣 Next steps:");
  console.info("¤ Upload the file to Google Drive");
  console.info(
    "¤ Convert the validated columns into Checkbox to ease the validation process",
  );
  console.info("¤ Share the file with your PM or content reviewer");
  /** @todo Next ticket -> do the "apply" */
  console.info(
    "¤ Once reviewed, use the implement-new-naming script to apply the xlsx file (updated version to download)",
  );
  console.groupEnd();
}
