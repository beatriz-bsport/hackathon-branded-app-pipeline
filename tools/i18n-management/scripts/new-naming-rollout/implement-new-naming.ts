import { Command } from "commander";
import fs from "fs";
import path from "path";

import { ProjectConfig } from "#src/types";
import { getLanguageTranslation } from "#src/utils/get-language-translations";

import {
  addValueToTranslations,
  getInternationalizedApplications,
} from "../utils";
import {
  groupSheetRowsByProjectAndLanguage,
  readXlsxAsJson,
} from "./xlsx-utils";

const program = new Command();

program
  .name("i18n:new-naming:preview")
  .description(
    "Generate new translations key-pair based on an xlsx.\n" +
      "The XLSX file must have been generated (or follow the pattern) with the translation:preview-new-naming command.\n" +
      "The script will create a new key with `_revamp` suffix for updates that have been validated (marked as true).",
  )
  .argument(
    "<file-path>",
    "Path to the xlsx file containing the data. It should be relative from the root folder or i18n-management.",
  )
  .option(
    "-o, --override",
    "Whether to override an existing string instead of creating a new one. This will prevent using feature flags.",
    false,
  )
  .option(
    "-f, --force",
    "Whether to update all strings, no matter their `validated` status.",
    false,
  )
  .action(main)
  .parse(process.argv);

async function main(
  filePath: string,
  options: {
    override: boolean;
    force: false;
  },
) {
  // Step 1 - Retrieve JSON data fromm the file
  const rows = readXlsxAsJson(filePath);

  // Step 2 - Regroup data by project and by language
  const aggregatedRows = groupSheetRowsByProjectAndLanguage({
    rows,
    override: options.override,
    force: options.force,
  });

  // Step 3 - Retrieve projects configs
  const mapProjectNameToConfig = new Map<string, ProjectConfig>();
  const projectConfigs = await getInternationalizedApplications();
  for (const config of projectConfigs) {
    mapProjectNameToConfig.set(config.name, config);
  }

  // Step 4 - Loop over projects and languages to inject new key
  for (const projectName of Object.keys(aggregatedRows)) {
    const config = mapProjectNameToConfig.get(projectName);

    if (!config) {
      continue;
    }

    const projectData = aggregatedRows[projectName];

    for (const [language, updatedTranslations] of Object.entries(projectData)) {
      const { languageTranslations, targetDir } = getLanguageTranslation({
        language,
        pathToI18n: config.pathToI18n,
      });

      const updatedFiles = new Set<string>();
      for (const newKeyValuePair of updatedTranslations) {
        addValueToTranslations({
          key: newKeyValuePair.i18nKey,
          translations: languageTranslations,
          value: newKeyValuePair.newValue,
        });

        const namespace = newKeyValuePair.i18nKey.split(".")[0];
        updatedFiles.add(namespace);
      }

      // Step 6 - Rebuild JSON per file
      for (const [file, content] of Object.entries(languageTranslations)) {
        const filePath = path.join(targetDir, `${file}.json`);
        if (updatedFiles.has(file)) {
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
        }
      }
    }
  }

  console.info("🚀 Your XLSX has been applied ! You can check the git diff.");
}
