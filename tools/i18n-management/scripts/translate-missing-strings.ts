#!/usr/bin/env ts-node
import { Command } from "commander";
import fs from "fs";
import { select } from "inquirer-select-pro";
import path from "path";

import { LANGUAGES, LOCALES } from "../src/languages";
import {
  type KeyValuePair,
  type ProjectConfig,
  addValueToTranslations,
  ensureDir,
  getFlattenKeyValuePairs,
  getSourceTranslations,
  joinDirJsonTranslations,
  selectProject,
} from "./utils";

const program = new Command();

program
  .name("i18n:project:translate")
  .description(
    "Translate untranslated strings of a project in the selected languages using DeepL API",
  )
  .option("-p, --project <string>", "Project to translate")
  .option("--fr", "Translate missing strings to French")
  .option("--es", "Translate missing strings to Spanish")
  .option("--nl", "Translate missing strings to Dutch")
  .option("--de", "Translate missing strings to German")
  .option("--it", "Translate missing strings to Italian")
  .option("--pt", "Translate missing strings to Portuguese")
  .action(main)
  .parse(process.argv);

async function main(opts: {
  project?: string;
  fr?: boolean;
  es?: boolean;
  nl?: boolean;
  de?: boolean;
  it?: boolean;
  pt?: boolean;
}) {
  // Step 1 - Retrieve project config
  const selectedProject: ProjectConfig = await selectProject({
    initialProject: opts.project,
  });

  // Step 2 - Load source translations
  const sourceTranslations = getSourceTranslations(selectedProject);

  // Step 3 - Flatten
  const flattenSource = getFlattenKeyValuePairs(sourceTranslations);

  // Step 4 - Target languages
  const targetLanguages: string[] = [];
  if (opts.fr) targetLanguages.push(LANGUAGES.FRENCH);
  if (opts.es) targetLanguages.push(LANGUAGES.SPANISH);
  if (opts.nl) targetLanguages.push(LANGUAGES.DUTCH);
  if (opts.de) targetLanguages.push(LANGUAGES.GERMAN);
  if (opts.it) targetLanguages.push(LANGUAGES.ITALIAN);
  if (opts.pt) targetLanguages.push(LANGUAGES.PORTUGUESE);

  if (targetLanguages.length === 0) {
    const answers = await select({
      multiple: true,
      required: true,
      message: "Select one or several target languages:",
      options: (input?: string) => {
        const baseList = LOCALES.filter(
          (language) => language !== LANGUAGES.ENGLISH,
        ).map((locale) => ({
          name: locale,
          value: locale,
        }));
        if (!input) return baseList;
        return baseList.filter((option) =>
          option.name.includes(input.toLocaleLowerCase()),
        );
      },
    });

    targetLanguages.push(...answers);
  }

  // Step 5 - Translate
  for (const targetLang of targetLanguages) {
    const targetDir = path.resolve(
      selectedProject.pathToI18n,
      "locales",
      targetLang.toLowerCase(),
    );

    ensureDir(targetDir);
    const targetTranslations = joinDirJsonTranslations(targetDir);
    const flattenTarget = getFlattenKeyValuePairs(targetTranslations);

    const translatedPairs = flattenTarget.filter(
      (pair) => pair.value?.length > 0,
    );
    const translatedKeys = new Set(
      translatedPairs.map((pair) => pair.flattenKey),
    );
    const missingPairsSource = flattenSource.filter(
      (pair) => !translatedKeys.has(pair.flattenKey),
    );
    const missingKeys = missingPairsSource.map((pair) => pair.flattenKey);

    if (missingPairsSource.length === 0) {
      console.log(`✅ No missing keys for ${targetLang}`);
      continue;
    }

    console.log(
      `🔄 Translating ${missingPairsSource.length} keys to ${targetLang}...`,
    );

    const newTargetTranslations = await callDeepL(
      missingPairsSource.map((pair) => pair.value),
      targetLang,
    );

    console.log(newTargetTranslations);

    // Merge translations into target
    const newTranslatedPairs: KeyValuePair[] = missingKeys.map((key, idx) => {
      return { flattenKey: key, value: newTargetTranslations[idx] };
    });
    newTranslatedPairs.forEach((pair) => {
      try {
        addValueToTranslations({
          translations: targetTranslations,
          key: pair.flattenKey,
          value: pair.value,
        });
      } catch (error) {
        console.error(
          `Failed to addValueToTranslations with pair "${pair.flattenKey}":"${pair.value}"`,
          error,
        );
      }
    });

    // Step 6 - Rebuild JSON per file
    for (const [file, content] of Object.entries(targetTranslations)) {
      const filePath = path.join(targetDir, `${file}.json`);
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
    }

    console.log(`✅ Updated ${targetLang} translations`);
  }
}

/**
 * Call DeepL API.
 */
async function callDeepL(
  texts: string[],
  targetLang: string,
): Promise<string[]> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY not set");

  const url = "https://api-free.deepl.com/v2/translate";
  const params = new URLSearchParams();
  texts.forEach((t) => params.append("text", t));
  params.append("target_lang", targetLang);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`DeepL API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    translations: { text: string }[];
  };

  return data.translations.map((t) => t.text);
}
