import fs from "fs";
import path from "path";

import {
  ensureDir,
  getInternationalizedApplications,
  getProjectPrefix,
} from "./utils";

/**
 * Copy namespace translations of a locale into project/public/locales/[locale]/[prefix]_[namespace].translations.json
 */
function copyLocaleDir({
  locale,
  localesDir,
  sourceDir,
  publicLocalesDir,
  prefix,
}: {
  locale: string;
  localesDir: string;
  sourceDir: string;
  publicLocalesDir: string;
  prefix: string;
}) {
  const localePath =
    locale === "en" ? sourceDir : path.join(localesDir, locale);
  if (!fs.existsSync(localePath)) return;
  if (!fs.statSync(localePath).isDirectory()) return;

  const destDir = path.join(publicLocalesDir, locale);
  ensureDir(destDir);

  const entries = fs.readdirSync(localePath, { withFileTypes: true });
  for (const entry of entries) {
    // Ensure the entry is a file
    if (!entry.isFile()) continue;
    const srcPath = path.join(localePath, entry.name);

    const destBase = entry.name.endsWith(".translations.json")
      ? entry.name.slice(0, -".translations.json".length) + ".json" // Remove .translations. if presents
      : entry.name;
    const destPath = path.join(destDir, `${prefix}${destBase}`);
    fs.copyFileSync(srcPath, destPath);
  }
}

async function main() {
  const projectList = (await getInternationalizedApplications()).filter(
    (proj) => proj.hasTransifexStructure,
  );

  console.group(
    "🕰️  Start uploading translations files to public/locales folder",
  );
  for (const project of projectList) {
    try {
      const { pathToI18n, name, pathToPublicLocales } = project;
      const sourceDir = path.resolve(pathToI18n, "source");
      const localesDir = path.resolve(pathToI18n, "locales");

      const prefix = getProjectPrefix(name);

      // Copy from "source" → "en"
      if (fs.existsSync(sourceDir)) {
        copyLocaleDir({
          locale: "en",
          localesDir: sourceDir,
          prefix,
          sourceDir,
          publicLocalesDir: pathToPublicLocales,
        });
      }

      // Copy from "locales/{locale}"
      if (fs.existsSync(localesDir)) {
        const locales = fs.readdirSync(localesDir);
        for (const locale of locales) {
          copyLocaleDir({
            locale,
            localesDir,
            prefix,
            sourceDir,
            publicLocalesDir: pathToPublicLocales,
          });
        }
      }
      console.log(`✅ Successfully uploaded translations for project ${name}`);
    } catch (error) {
      console.error(
        "❌ Failed to upload translations for project ",
        project.name,
      );
    }
  }
  console.groupEnd();
}

main();
