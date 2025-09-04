import child_process from "child_process";
import { Command } from "commander";
import fs from "fs";
import util from "node:util";
import path from "path";

import { getMonorepoBasePathSync } from "@bsport/typescript-monorepo-utils";

import { ensureDir, getAppNamespaces, getProjectConfig } from "./utils";

const exec = util.promisify(child_process.exec);

function copyPublicLocalesDir({
  locale,
  i18nDir,
  publicLocalesDir,
}: {
  locale: string;
  i18nDir: string;
  publicLocalesDir: string;
}) {
  const srcDir = path.resolve(publicLocalesDir, locale);
  const targetDir =
    locale === "en"
      ? path.resolve(i18nDir, "source")
      : path.resolve(i18nDir, "locales", locale);

  if (!fs.existsSync(srcDir)) return;
  if (!fs.statSync(srcDir).isDirectory()) return;

  ensureDir(targetDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    // Ensure the entry is a JSON file
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".json")) continue;

    const srcFile = path.join(srcDir, entry.name);
    const targetFile = path.join(targetDir, entry.name);

    fs.copyFileSync(srcFile, targetFile);
  }
}

async function main({
  cleanup,
  transform,
}: {
  cleanup: boolean;
  transform: boolean;
}) {
  // Globals
  const ichizenBasePath = getMonorepoBasePathSync();

  console.log("\n⏳ Start updating i18n structure of saas-legacy");
  if (transform) {
    console.log("* The script will transform the i18n structure");
  }
  if (cleanup) {
    console.log(
      "* The script will remove files from the old structure that are useless",
    );
  }

  // Step 1: Retrieve saas legacy project config
  const saasLegacyProject = await getProjectConfig("@bsport/saas-legacy");
  if (!saasLegacyProject) {
    console.error("❌ Could not find project saas-legacy");
    process.exit(1);
  }
  const { pathToI18n, pathToPublicLocales } = saasLegacyProject;

  // Step 2: Rebuild translations files
  {
    console.log(
      "\n⏳ Rebuilding {namespace}.json files of the public/locales folder ...",
    );
    await exec("pnpm --filter=@bsport/saas-legacy translation:update");
    console.log("✅ Successfully rebuilt translations !");
  }

  if (transform) {
    console.group("\n⏳ Transforming i18n structure ...");
    const timeString = "✅ Successfully transformed i18n structure";
    console.time(timeString);

    const sourceDir = path.resolve(pathToPublicLocales, "en");

    // Step 3: Check existence of folders
    {
      if (!fs.existsSync(pathToPublicLocales)) {
        console.error(
          `❌ Could not find public locales at ${path.relative(ichizenBasePath, pathToPublicLocales)}`,
        );
        process.exit(1);
      }

      if (!fs.existsSync(sourceDir)) {
        console.error(
          `❌ Could not find public/locales/en at ${path.relative(ichizenBasePath, sourceDir)}`,
        );
        process.exit(1);
      }

      ensureDir(pathToI18n);
    }

    // Step 4: Check namespaces
    {
      const namespaces = getAppNamespaces(pathToI18n);
      const sourceJsonFiles = fs.readdirSync(sourceDir);
      const realNamespaces = sourceJsonFiles.map((file) =>
        file.replace(".json", ""),
      );
      const areEquals =
        realNamespaces.length === namespaces.length &&
        namespaces.filter((x) => realNamespaces.indexOf(x) < 0).length === 0;
      if (areEquals) {
        console.log("> All namespaces are well declared in namespaces.json");
      } else {
        const _realNamespaces = new Set(realNamespaces);
        const _namespaces = new Set(namespaces);
        console.error(
          "> ❌ There are discrepancies between namespaces.json and real namespaces. Take a look to these namespaces:",
          _realNamespaces.difference(_namespaces),
        );
      }
    }

    // Step 5: Copy namespace translations files from public/locales to the right folder
    {
      const locales = fs.readdirSync(pathToPublicLocales);
      for (const locale of locales) {
        copyPublicLocalesDir({
          locale,
          i18nDir: pathToI18n,
          publicLocalesDir: pathToPublicLocales,
        });
        console.log(`> Generated {namespace}.json files for locale ${locale}`);
      }
    }

    console.groupEnd();
    console.timeEnd(timeString);
  }

  if (cleanup) {
    console.group("\n⏳ Cleaning old i18n structure ...");
    const timeString = "✅ Successfully cleaned old i18n structure";
    console.time(timeString);

    // Step 6: Remove js translations files
    {
      const translationsDir = path.resolve(pathToI18n, "translations");
      if (fs.existsSync(translationsDir)) {
        fs.rmSync(translationsDir, { recursive: true, force: true });
        console.log("> Removed i18n/translations folder");
      }
    }

    // Step 7: Remove deprecated folder
    {
      const deprecatedEnUSDir = path.resolve(pathToI18n, "en-US");
      if (fs.existsSync(deprecatedEnUSDir)) {
        fs.rmSync(deprecatedEnUSDir, { recursive: true, force: true });
        console.log("> Removed i18n/en-US folder");
      }

      const deprecatedEsDir = path.resolve(pathToI18n, "es");
      if (fs.existsSync(deprecatedEsDir)) {
        fs.rmSync(deprecatedEsDir, { recursive: true, force: true });
        console.log("> Removed i18n/es folder");
      }
    }

    // Step 8: Clean source folders
    {
      const sourceTranslationsJson = path.resolve(
        pathToI18n,
        "source",
        "translations.json",
      );
      if (fs.existsSync(sourceTranslationsJson)) {
        fs.rmSync(sourceTranslationsJson, { force: true });
        console.log("> Removed i18n/source/translations.json");
      }

      const englishDir = path.resolve(pathToI18n, "locales", "en");
      if (fs.existsSync(englishDir)) {
        fs.rmSync(englishDir, { recursive: true, force: true });
        console.log("> Removed i18n/locales/en folder");
      }
    }

    // Step 9: Clean locales folder by removing translations.json
    {
      const pathToLocales = path.resolve(pathToI18n, "locales");

      if (!fs.existsSync(pathToLocales)) {
        console.log("> Skipped: i18n/locales folder not found");
      } else {
        const locales = fs.readdirSync(pathToLocales);
        for (const locale of locales) {
          const localeTranslationsJson = path.resolve(
            pathToLocales,
            locale,
            "translations.json",
          );
          if (fs.existsSync(localeTranslationsJson)) {
            fs.rmSync(localeTranslationsJson);
            console.log(`> Removed i18n/locales/${locale}/translations.json`);
          }
        }
      }
    }

    console.groupEnd();
    console.timeEnd(timeString);
  }

  {
    console.log(
      "\n⏳ Rebuilding {namespace}.json files of the public/locales folder with the global script...",
    );
    await exec("pnpm -w translation:update");
    console.log("✅ Successfully rebuilt translations !");
  }

  console.log("\n\n✅ Transformation script completed !");
}

const program = new Command();

program
  .name("i18n:saas-legacy:transform")
  .description("Transform saas-legacy to match the new i18n structure")
  .option("-c, --cleanup", "Whether to run the cleanup section", false)
  .option("-t, --transform", "Whether to run the transform section", false)
  .action(main)
  .parse(process.argv);
