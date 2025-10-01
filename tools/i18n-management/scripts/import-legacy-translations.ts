import { exec } from "child_process";
import { Command } from "commander";
import { existsSync, mkdirSync, readJSONSync, writeFileSync } from "fs-extra";
import { select as selectWithSearch } from "inquirer-select-pro";
import beautify from "json-beautify";
import path from "path";

import { getMonorepoBasePathSync } from "@bsport/typescript-monorepo-utils";

import { LOCALES } from "../src";
import {
  type KeyValuePair,
  type ProjectConfig,
  type Translations,
  addValueToTranslations,
  getAppNamespaces,
  getFlattenKeyValuePairs,
  getNamespacesTranslations,
  selectProject,
} from "./utils";

// ----- Utils -----

/**
 * Filter a base list of KeyValuePair if the input matches key or value.
 * It checks whether the key or the value contains the specified input.
 *
 * @param keyValuePairs Base list for options
 * @param input String to filter options, regarding keys or values
 *
 * @return A list of Key-Value pair matching the input pattern
 *
 * @example
 * const flattenTranslations = [
 *  { flattenKey: "key1.nestedKey1", value: "Hello !" },
 *  { flattenKey: "key1.nestedKey2.item1", value: "Bonjour !" },
 *  { flattenKey: "key1.nestedKey2.item2", value: "Hola !" },
 *  ...
 * ];
 *
 * const filteredFlattenTranslations = getFilteredKeyValueOptions(flattenTranslations, "nestedKey2");
 * // Equals to
 * [
 *  { flattenKey: "key1.nestedKey2.item1", value: "Bonjour !" },
 *  { flattenKey: "key1.nestedKey2.item2", value: "Hola !" },
 * ];
 */
function getFilteredKeyValueOptions({
  keyValuePairs,
  input,
}: {
  keyValuePairs: KeyValuePair[];
  input?: string;
}) {
  return keyValuePairs
    .filter((pair) =>
      input
        ? pair.flattenKey.includes(input) || pair.value.includes(input)
        : true,
    )
    .map((pair: KeyValuePair) => ({
      name: `${pair.flattenKey} (${pair.value})`,
      value: pair.flattenKey,
      disabled: false,
    }));
}

/**
 * Check whether two inputs share the same i18n interpolation variables (e.g variables between `{{ }}`).
 *
 * @param sourceBaseValue First string input
 * @param targetBaseValue Second string input
 *
 * @returns [boolean] Whether the two inputs have exactly the same interpolation variables.
 *
 * @example
 * checkInterpolationSchema("Hello {{ name }} !", "Good morning {{ name }} !"); // return true
 * checkInterpolationSchema("Hello {{ name }} !", "Hello {{ first_name }} !"); // return false
 */
function checkInterpolationSchema(
  sourceBaseValue: string,
  targetBaseValue: string,
): boolean {
  const extractVariables = (str: string): string[] => {
    const regex = /{{(.*?)}}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      variables.push(match[1].trim());
    }
    return variables;
  };

  const sourceVariables = extractVariables(sourceBaseValue);
  const targetVariables = extractVariables(targetBaseValue);

  if (sourceVariables.length !== targetVariables.length) {
    return false;
  }

  return sourceVariables.every((variable) =>
    targetVariables.includes(variable),
  );
}

async function main({
  allKeys,
  autoSource,
}: {
  allKeys: boolean;
  autoSource: boolean;
}) {
  console.log("⏳ Start importing legacy translations ...\n");

  // Define globals (multi steps usage)
  const monorepoBasePath = getMonorepoBasePathSync();
  const saasLegacyPath = path.resolve(
    monorepoBasePath,
    "apps/applications/saas-legacy",
  );
  const saasLegacyI18nPath = path.resolve(saasLegacyPath, "src/i18n");

  // Update translations to be sure all translations are in build files
  await exec("pnpm run -w translation:update", { cwd: process.cwd() });
  await exec("pnpm run translation:update", { cwd: saasLegacyPath });

  // Step 1: Select your project
  const projectToTranslate: ProjectConfig = await selectProject();

  // Step 2: Select keys you want to translate (targetKeys)
  let targetKeyValuePairs: KeyValuePair[];
  {
    const namespaces = getAppNamespaces(projectToTranslate.pathToI18n);
    const projectTranslations = await getNamespacesTranslations({
      pathToI18n: projectToTranslate.pathToI18n,
      namespaces,
    });
    const projectKeyValuePairs = getFlattenKeyValuePairs(projectTranslations);
    if (allKeys) {
      // Automatically select all keys
      targetKeyValuePairs = projectKeyValuePairs;
    } else {
      // Inquirer selection of target keys
      const targetKeys = await selectWithSearch({
        message: "Select keys you want to translate",
        multiple: true,
        options: (input?: string) => {
          return getFilteredKeyValueOptions({
            keyValuePairs: projectKeyValuePairs,
            input,
          });
        },
      });
      targetKeyValuePairs = projectKeyValuePairs.filter((pair) =>
        targetKeys.includes(pair.flattenKey),
      );
    }
    if (targetKeyValuePairs.length === 0) {
      throw new Error("❌ No keys have been selected. Stop the script.");
    }
  }

  // Step 3: Select saas-legacy namespaces
  let selectedSaasLegacyNamespaces: string[];
  {
    const saasLegacyNamespaces = getAppNamespaces(saasLegacyI18nPath);
    selectedSaasLegacyNamespaces = autoSource
      ? // Automatically select all saas legacy namespaces
        saasLegacyNamespaces
      : // Inquirer selection of target namespaces
        await selectWithSearch({
          message: "Select saas-legacy namespaces that contain your values",
          multiple: true,
          required: true,
          options: (input?: string) =>
            saasLegacyNamespaces
              .filter((namespace) => (input ? namespace.includes(input) : true))
              .map((namespace) => ({
                name: namespace,
                value: namespace,
                disabled: false,
              })),
        });
    if (selectedSaasLegacyNamespaces.length === 0) {
      throw new Error(
        "❌ No source namespaces have been selected. Stop the script.",
      );
    }
  }

  // Step 4: Retrieve saas-legacy translations and select sourceKey for each targetKey
  const migrationItems = [];
  {
    const saasLegacyTranslations = await getNamespacesTranslations({
      pathToI18n: saasLegacyI18nPath,
      namespaces: selectedSaasLegacyNamespaces,
    });
    const sourceKeyValuePairs = getFlattenKeyValuePairs(saasLegacyTranslations);
    for (const targetPair of targetKeyValuePairs) {
      let sourcePair: KeyValuePair | undefined = undefined;

      if (autoSource) {
        // Automaticaly finds the right translation if it exists
        const inferedSource = sourceKeyValuePairs.find(
          (sourcePair) => sourcePair.value === targetPair.value,
        );
        if (inferedSource) {
          sourcePair = inferedSource;
          console.log(
            `✅ Automatically find a match for ${targetPair.flattenKey}`,
          );
        } else {
          // Add default value to add warning in the final outputs file
          sourcePair = { flattenKey: "", value: "" };
        }
      } else {
        // Inquirer a manual selection
        const sourceKey = await selectWithSearch({
          multiple: false,
          message: `Select sourceKey for targetKey: ${targetPair.flattenKey} (${targetPair.value})`,
          options: (input?: string) => {
            return getFilteredKeyValueOptions({
              keyValuePairs: sourceKeyValuePairs,
              input,
            });
          },
        });
        sourcePair = sourceKeyValuePairs.find(
          (pair) => pair.flattenKey === sourceKey,
        );
      }

      if (sourcePair) {
        migrationItems.push({
          sourceKey: sourcePair.flattenKey,
          sourceBaseValue: sourcePair.value,
          targetKey: targetPair.flattenKey,
          targetBaseValue: targetPair.value,
        });
      }
    }
    if (migrationItems.length === 0) {
      throw new Error(
        "❌ No migrations items have been created. Stop the script.",
      );
    }
  }

  // Step 5: Check interpolation matching
  let outputs: Record<string, Array<string>> = {};
  let validMigrationItems = [];
  {
    console.log(
      "> Filter out migration items when interpolation does not match ...",
    );
    const interpolationIssues: Array<string> = [
      "----- Interpolation issues between values -----",
    ];
    validMigrationItems = migrationItems.filter((item) => {
      const isMatching = checkInterpolationSchema(
        item.sourceBaseValue,
        item.targetBaseValue,
      );
      if (!isMatching) {
        interpolationIssues.push(
          `❌ ${item.sourceKey} and ${item.targetKey} don't match`,
        );
      }
      return isMatching;
    });
    outputs["interpolationIssues"] = interpolationIssues;
  }

  // Step 6: Migrate translations values for each language
  {
    LOCALES.forEach((locale) => {
      console.log(`> Start migrating translations for ${locale} ...`);
      // Define an entry for the outputs
      const localeOutputs = [
        `----- Results for ${locale} values migration -----`,
      ];

      // Retrieve current app translations from JSON
      const translationsPath = path.resolve(
        process.cwd(),
        `src/locales/${locale}.translations.json`,
      );
      const translations = existsSync(translationsPath)
        ? readJSONSync(translationsPath)
        : {};
      const appTranslations = translations[projectToTranslate.name] || {};

      // Retrive saas-legacy translations from JSON and flatten them (to access with flattenKey the value)
      const legacyTranslations = readJSONSync(
        path.resolve(saasLegacyI18nPath, `locales/${locale}/translations.json`),
      );
      const selectedLegacyTranslations: Translations = {};
      for (const namespace of selectedSaasLegacyNamespaces) {
        selectedLegacyTranslations[namespace] = legacyTranslations[namespace];
      }
      const flattenLegacyTranslations = getFlattenKeyValuePairs(
        selectedLegacyTranslations,
      );

      // For each migration item, transpose legacy translation into new one
      validMigrationItems.forEach((item) => {
        const legacyPair = flattenLegacyTranslations.find(
          (pair) => pair.flattenKey === item.sourceKey,
        );
        if (!legacyPair) {
          localeOutputs.push(
            item.sourceKey
              ? `⚠️ Missing value for ${item.sourceKey}, could not set ${item.targetKey}`
              : `⚠️ Could not set ${item.targetKey}`,
          );
        } else {
          addValueToTranslations({
            translations: appTranslations,
            key: item.targetKey,
            value: legacyPair.value,
          });
          localeOutputs.push(
            `✅ ${item.targetKey} has been successfully updated`,
          );
        }
      });

      // Update translation build file and outputs
      translations[projectToTranslate.name] = appTranslations;
      writeFileSync(translationsPath, beautify(translations, null as any, 4));
      outputs[locale] = localeOutputs;
    });
  }

  // Step 7 : Write outputs to __tmp__/migrateTranslationsOutputs-datetime.json
  let outputPath: string = "";
  {
    const dir = path.resolve(monorepoBasePath, "__tmp__");
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    outputPath = path.resolve(
      dir,
      `migrateTranslationsOutputs-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    );
    writeFileSync(outputPath, JSON.stringify(outputs, null, 2));
  }

  // Finalize translations by splitting aggregated builds into applications
  await exec("pnpm run -w translation:update", { cwd: process.cwd() });

  console.log(`✅ Migration complete ! Outputs written to ${outputPath}`);
}

const program = new Command();

program
  .command("translation:migrate")
  .description(
    "Import legacy translations into new application translations." +
      "\nTo see a full guide on how to use this script, visit our Notion page :" +
      "\nhttps://www.notion.so/bright-shovel-41b/How-to-migrate-translations-from-saas-legacy-to-new-application-1bd137e4c64080758a64d62ff794307f",
  )
  .option(
    "-ak, --all-keys",
    "Automatically select all keys of the selected projects to be targeted by the script." +
      "\nIf true, bypass the manual selection of target keys to be translated.",
    false,
  )
  .option(
    "-as, --auto-source",
    "Automatically select translations values from sources based on matching patterns." +
      "\nIf true, bypass the manual selection of the sources per selected target.",
    false,
  )
  .action(main)
  .parse(process.argv);
