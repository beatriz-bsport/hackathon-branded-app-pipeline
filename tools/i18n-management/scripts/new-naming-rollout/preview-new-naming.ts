import { input } from "@inquirer/prompts";
import { Command } from "commander";
import path from "path";

import { getLanguageTranslation } from "#src/utils/get-language-translations";
import { replaceTermInString } from "#src/utils/replace-term-in-string";
import { selectLanguages } from "#src/utils/select-languages";
import { selectProjects } from "#src/utils/select-projects";

import { ensureDir, getFlattenKeyValuePairs } from "../utils";
import { generateTranslationUpdateXlsx } from "./xlsx-utils";

const program = new Command();

program
  .name("i18n:new-naming:preview")
  .description(
    "Generate an excel for preview and validation of new terms rollout.\n" +
      "For each language you want to edit, you need to provide the singular and plural forms of the previous and the new terms.\n" +
      "You can provide multiple previous terms by separating them with ';'. Careful: the order is important.\n" +
      "Example: VOD;Videos & eBooks;eBooks;Videos. Note that we first replace Videos & eBooks, and then eBooks alone.\n" +
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
  .option(
    "-sp, --skip-plural",
    "Whether to skip the inputs to provide plural, in case singular=plural (no distinction).",
    false,
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
  skipPlural,
}: {
  projects?: string;
  languages?: string;
  skipPlural?: boolean;
}) {
  // Step 1 - Select projects to scan and transform
  const selectedProjects = await selectProjects({
    initialProjects: projects,
  });

  // Step 2 - Select languages to scan and transform
  const selectedLanguages = (
    await selectLanguages({
      initialLanguages: languages,
    })
  ).sort((a, b) => {
    // English first
    if (a === "en") {
      return -1;
    }
    if (b === "en") {
      return 1;
    }
    return 0;
  });

  // Step 3 - Request inputs with previous and new terms
  let title: string = "";
  const languagesConfigs: LanguageConfig[] = [];
  {
    for (const language of selectedLanguages) {
      const previousTermsSingular = await input({
        message: `${language} | What are the words you wish to replace (singular) ?`,
        required: true,
      });

      const previousTermsPlural = skipPlural
        ? previousTermsSingular
        : await input({
            message: `${language} | What are the words you wish to replace (plural) ?`,
            required: true,
            default: previousTermsSingular,
            validate: (value) => {
              const singularLength = previousTermsSingular.split(";").length;
              const pluralLength = value.split(";").length;
              return pluralLength === singularLength;
            },
          });

      const newTermSingular = await input({
        message: `${language} | What is the new term to replace with (singular) ?`,
        required: true,
      });

      const newTermPlural = skipPlural
        ? newTermSingular
        : await input({
            message: `${language} | What is the new term to replace with (plural) ?`,
            required: true,
            default: newTermSingular,
          });

      const previousTermSingularList = previousTermsSingular.split(";");
      const previousTermsPluralList = previousTermsPlural.split(";");

      if (previousTermSingularList.length !== previousTermsPluralList.length) {
        throw new Error(
          `Singular and plural lists don't have the same length for language ${language}`,
        );
      }

      for (let idx = 0; idx < previousTermSingularList.length; idx++) {
        languagesConfigs.push({
          id: language,
          previousTermSingular: previousTermSingularList[idx],
          previousTermPlural: previousTermsPluralList[idx],
          newTermSingular,
          newTermPlural,
        });
      }

      if (!title) {
        // Define title for the xlsx file
        const sanitizedPrevious = previousTermSingularList[0]
          .toLowerCase()
          .replaceAll(" ", "-");
        const sanitizedNew = newTermSingular.toLowerCase().replaceAll(" ", "-");
        title = `transform-${sanitizedPrevious}-into-${sanitizedNew}`;
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

      // Build a big JSON containing all strings of the language
      const { languageTranslations } = getLanguageTranslation({
        language,
        pathToI18n: project.pathToI18n,
      });

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
        // Column {lang}_notes
        "",
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
  console.info(
    "¤ Once reviewed, use the translation:implement-new-naming script to apply the xlsx file (updated version to download)",
  );
  console.groupEnd();
}
