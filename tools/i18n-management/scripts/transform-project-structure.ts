import { Command } from "commander";
import fs, { existsSync } from "fs";
import { readJSONSync, writeFileSync } from "fs-extra";
import { select as selectWithSearch } from "inquirer-select-pro";
import beautify from "json-beautify";
import { getMonorepoBasePathSync } from "packages/utils/monorepo/build";
import path from "path";

import {
  type ProjectConfig,
  ensureDir,
  getAppNamespaces,
  getInternationalizedApplications,
} from "./utils";

async function main({ project }: { project?: string }) {
  // Globals
  const monorepoBasePath = getMonorepoBasePathSync();
  let selectedProject: ProjectConfig;
  let finalNamespaces: string[];

  // Step 1: Select the project
  {
    const projects = await getInternationalizedApplications({ quiet: true });

    if (project) {
      // Validate the provided project
      const projectConfig = projects.find((proj) => proj.name === project);

      if (projectConfig) {
        selectedProject = projectConfig;
      } else {
        console.error(
          "❌ Unknown project name provided. Make sure this is an internationalized project",
        );
        process.exit(1);
      }
    } else {
      // Show a selector
      const projectConfig = await selectWithSearch({
        message: "Select your project",
        multiple: false,
        required: true,
        options: (input?: string) => {
          const baseList = projects.map((project) => ({
            name: project.name,
            value: project,
          }));

          if (!input) return baseList;

          return baseList.filter((option) => option.name.includes(input));
        },
      });

      if (projectConfig) {
        selectedProject = projectConfig;
      } else {
        console.error("❌ You did not select a project. Please select one.");
        process.exit(1);
      }
    }
    console.log(`✅ Selected project: ${selectedProject.name}`);
  }

  // Step 2: Transform the project
  {
    console.group("\n⏳ Start transforming i18n structure");
    console.time("✅ Successfully transformed i18n structure");

    const { pathToI18n } = selectedProject;
    const sourceDir = path.resolve(pathToI18n, "source");
    const localesDir = path.resolve(pathToI18n, "locales");
    const translationsDir = path.resolve(pathToI18n, "translations");

    console.log("> Read namespaces");
    const namespaces = getAppNamespaces(pathToI18n);

    console.log("> Infer namespaces from locales/en/translations.json");
    const sourceFilePath = path.resolve(localesDir, "en", "translations.json");
    if (!existsSync(sourceFilePath)) {
      console.error(
        `❌ File ${path.relative(monorepoBasePath, sourceFilePath)} does not exist. You may have already run the script !`,
      );
      process.exit(1);
    }
    const srcFile = readJSONSync(sourceFilePath) as Object;
    const realNamespaces = Object.keys(srcFile);

    const areEquals =
      realNamespaces.length === namespaces.length &&
      namespaces.filter((x) => realNamespaces.indexOf(x) < 0).length === 0;
    if (areEquals) {
      console.log("> Namespaces are well declared: ", namespaces.join(", "));
      finalNamespaces = namespaces;
    } else {
      console.error(
        `❌ There are discrepancies between namespaces.json (${namespaces}) and real namespaces (${realNamespaces}). Please solve it before running the script.`,
      );
      process.exit(1);
    }

    const locales = fs.readdirSync(localesDir);
    for (const locale of locales) {
      // For each locale, transform translations.json into {namespace}.json files
      const srcPath = path.join(localesDir, locale, "translations.json");
      console.group(`> Handle ${locale} files`);
      if (fs.existsSync(srcPath)) {
        const localeTranslations = readJSONSync(srcPath);

        for (const namespace of namespaces) {
          const fileName = `${namespace}.json`;
          const filePath = path.resolve(localesDir, locale, fileName);
          const fileContent = localeTranslations[namespace] ?? {};

          console.log(`> Create ${locale}/${fileName} file`);
          fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
        }

        console.log(`> Remove ${locale}/translations.json file`);
        fs.rmSync(srcPath);
      }
      console.groupEnd();
    }

    console.log("> Remove translations/**.ts files");
    if (fs.existsSync(translationsDir)) {
      fs.rmSync(translationsDir, { recursive: true, force: true });
    }

    console.log("> Create i18n/source directory");
    ensureDir(sourceDir);

    console.log('> Move "en" files to "source" folder');
    const englishFiles = fs.readdirSync(path.join(localesDir, "en"));
    for (const file of englishFiles) {
      const englishPath = path.join(localesDir, "en", file);
      const sourcePath = path.join(sourceDir, file);
      fs.copyFileSync(englishPath, sourcePath);
    }

    console.groupEnd();
    console.timeEnd("✅ Successfully transformed i18n structure");
  }

  // Step 3: Remove translations from the aggregated files in i18n-management
  {
    console.group("\n⏳ Start cleaning i18n-management files");

    const { name } = selectedProject;

    const i18nManagementSrc = path.resolve(process.cwd(), "src");
    const i18nManagementSourceFile = path.resolve(
      i18nManagementSrc,
      "source",
      "translations.json",
    );

    // Clean source file
    if (existsSync(i18nManagementSourceFile)) {
      console.log(`> Cleaning source/translations.json`);
      const localeTranslations = readJSONSync(i18nManagementSourceFile);

      if (localeTranslations[name]) {
        delete localeTranslations[name];
      }

      writeFileSync(
        i18nManagementSourceFile,
        beautify(localeTranslations, null as any, 2, 80),
      );
    }

    // CLean target files
    const i18nManagementLocalesFolder = path.resolve(
      i18nManagementSrc,
      "locales",
    );
    const i18nManagementLocalesFiles = fs.readdirSync(
      i18nManagementLocalesFolder,
    );

    for (const filename of i18nManagementLocalesFiles) {
      const file = path.resolve(i18nManagementLocalesFolder, filename);
      if (existsSync(file)) {
        console.log(`> Cleaning ${filename}`);
        const localeTranslations = readJSONSync(file);

        if (localeTranslations[name]) {
          delete localeTranslations[name];
        }

        writeFileSync(file, beautify(localeTranslations, null as any, 4));
      }
    }
    console.groupEnd();

    console.log("\n✅ Cleaning i18n-management files successfully");
  }

  // Step 4: Give further instructions
  {
    console.group(
      "\n\n⚠️  Update your 'src/utils/i18n.ts' config to import all your source translations",
    );
    console.log(
      "------------------------------------------------------------------------------",
    );
    console.log('import namespaces from "#src/i18n/namespaces.json";');
    for (const namespace of finalNamespaces) {
      console.log(
        `import type ${namespace}Translations from "#src/i18n/source/${namespace}.json;`,
      );
    }
    console.group("\ntype Translations = {");
    for (const namespace of finalNamespaces) {
      console.log(`${namespace}: typeof ${namespace}Translations;`);
    }
    console.groupEnd();
    console.log("};");
    console.log("\n...\n");
    console.log("} = instanciateAppI18n<Translations>({");
    console.log("\n...\n");
    console.log("export type TFunction = TFunctionGeneric<Translations>;");
    console.log(
      "------------------------------------------------------------------------------",
    );
    console.groupEnd();
  }

  console.log("\n\n✅ Transformation script completed !");
}
const program = new Command();

program
  .name("i18n:project:transform")
  .description("Transform the selected project to match the new i18n structure")
  .option(
    "-p, --project <string>",
    "Project to transform. If not provided, you'll be able to choose it in the list.",
  )
  .action(main)
  .parse(process.argv);
