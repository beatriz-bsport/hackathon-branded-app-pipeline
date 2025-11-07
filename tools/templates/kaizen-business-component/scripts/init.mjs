#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";
import readline from "readline";

/**
 * This script prepares the business component package to be used after being scaffolded.
 * It uses the component name from CLI args or prompts for it.
 */

/**
 * Parse CLI arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  args.forEach((arg) => {
    const match = arg.match(/^--(\w+)=(.+)$/);
    if (match) {
      parsed[match[1]] = match[2];
    }
  });

  return parsed;
}

/**
 * Prompts the user for input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} The user's answer
 */
function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Main function to run the initialization process
 */
async function main() {
  try {
    console.log("Starting Kaizen Business Component initialization...");
    console.log("");

    // Get the project root directory (current working directory)
    const projectRoot = process.cwd();
    console.log("Project root:", projectRoot);
    console.log("");

    // Get component name from CLI args or prompt
    const cliArgs = parseArgs();
    let componentName = cliArgs.name;

    if (!componentName) {
      componentName = await prompt(
        "Enter the business component name (e.g., 'payment', 'appointment'): ",
      );
    } else {
      console.log(`Using component name from arguments: ${componentName}`);
    }

    if (!componentName || !/^[a-z-]+$/.test(componentName)) {
      console.error(
        "Error: Component name must be lowercase with hyphens only (e.g., 'payment-method')",
      );
      process.exit(1);
    }

    console.log(`Component name: ${componentName}`);
    console.log("");

    // Update package name and namespace
    console.log("Updating package configuration...");
    updatePackageJson(projectRoot, componentName);

    // Update i18n namespace
    console.log("Updating i18n configuration...");
    updateI18nNamespace(projectRoot, componentName);

    // Note: CI scripts are at business-components root (shared Storybook)
    console.log("Note: Storybook is shared at business-components/ root");

    // Create .env file
    console.log("Creating .env file...");
    createEnvFile(projectRoot, componentName);

    // Update TypeScript configuration paths
    console.log("Updating TypeScript configuration paths...");
    updateTsConfigPaths(projectRoot);

    // Build the project
    console.log("Building project...");
    buildProject(projectRoot);

    // Clean up scripts and package.json
    cleanupScripts(projectRoot);

    console.log("");
    console.log("✅ Project initialization complete!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Add your first component: pnpm run component:add");
    console.log("2. View in Storybook: cd ../ && pnpm run dev");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("Error in initialization script:", error);
    process.exit(1);
  }
}

// Execute the main function
main();

/* Auxiliary functions */

/**
 * Updates package.json with the component name
 * @param {string} projectRoot - The project root directory
 * @param {string} componentName - The component name
 */
function updatePackageJson(projectRoot, componentName) {
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Update package name
  packageJson.name = `@bsport/kaizen-business-${componentName}`;
  packageJson.description = `Kaizen business component - ${componentName}`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Updated package name to: ${packageJson.name}`);
}

/**
 * Updates i18n namespace in public locale files
 * @param {string} projectRoot - The project root directory
 * @param {string} componentName - The component name
 */
function updateI18nNamespace(projectRoot, componentName) {
  const publicLocalesDir = path.join(projectRoot, "public", "locales");
  const namespace = `kaizen-business-${componentName}`;

  // Rename locale files
  ["de", "es", "fr", "it", "nl"].forEach((lang) => {
    const oldPath = path.join(
      publicLocalesDir,
      lang,
      "kaizen-business-CHANGEME_default.json",
    );
    const newPath = path.join(
      publicLocalesDir,
      lang,
      `${namespace}_default.json`,
    );

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    }
  });

  console.log(`Updated i18n namespace to: ${namespace}`);
}

/**
 * Creates .env file with the component name
 * @param {string} projectRoot - The project root directory
 * @param {string} componentName - The component name
 */
function createEnvFile(projectRoot, componentName) {
  const envPath = path.join(projectRoot, ".env");
  const namespace = `kaizen-business-${componentName}`;

  fs.writeFileSync(envPath, `VITE_I18N_NAMESPACE_PREFIX=${namespace}\n`);
  console.log(`Created .env file with namespace: ${namespace}`);
}

/**
 * Builds the project using pnpm build
 * @param {string} projectRoot - The project root directory
 */
function buildProject(projectRoot) {
  try {
    console.log("Running pnpm build...");
    execSync("pnpm build", {
      cwd: projectRoot,
      stdio: "inherit", // Show output in console
    });

    console.log("Build completed successfully.");
  } catch (error) {
    console.error("Error building project:", error.message);
    throw error; // Rethrow to be caught by the main function
  }
}

/**
 * Cleans up the scripts directory and removes the init script
 * @param {string} projectRoot - The project root directory
 */
function cleanupScripts(projectRoot) {
  // Unlink the current script file first
  fs.unlinkSync(process.argv[1]);
  console.log("Unlinked current script file.");

  // Check if scripts directory has other files
  const scriptsDir = path.join(projectRoot, "scripts");
  try {
    const remainingFiles = fs.readdirSync(scriptsDir);

    if (remainingFiles.length === 0) {
      // If no other files exist, delete the scripts directory
      fs.rmdirSync(scriptsDir);
      console.log("Deleted empty scripts directory.");
    } else {
      console.log(
        `Scripts directory still contains ${remainingFiles.length} files, not deleting.`,
      );
    }
  } catch (err) {
    console.error("Error checking scripts directory:", err.message);
  }

  // Delete package.json project:init script
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  delete packageJson.scripts["project:init"];
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Deleted package.json project:init script.");
}

/**
 * Finds the ichizen repository root directory
 * @param {string} currentPath - The starting path to search from
 * @returns {string|null} The ichizen root path or null if not found
 */
function findIchizenRoot(currentPath) {
  let testPath = currentPath;

  while (testPath !== "/") {
    if (fs.existsSync(path.join(testPath, "tools", "config", "typescript"))) {
      return testPath;
    }
    testPath = path.dirname(testPath);
  }
  return null;
}

/**
 * Updates TypeScript configuration paths to point to the correct location
 * @param {string} projectRoot - The project root directory
 */
function updateTsConfigPaths(projectRoot) {
  const ichizenRoot = findIchizenRoot(projectRoot);
  if (!ichizenRoot) {
    console.warn(
      "Could not find ichizen root directory. TypeScript config paths may need manual adjustment.",
    );
    return;
  }

  // Calculate the relative path from the project to the tools directory
  const relativePathToTools = path.relative(
    projectRoot,
    path.join(ichizenRoot, "tools"),
  );
  console.log(`Relative path to tools directory: ${relativePathToTools}`);

  // Update all TypeScript config files
  const tsConfigFiles = [
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "tsconfig.storybook.json",
  ];

  let updatedCount = 0;

  for (const configFileName of tsConfigFiles) {
    const tsConfigFile = path.join(projectRoot, configFileName);

    if (!fs.existsSync(tsConfigFile)) {
      continue;
    }

    try {
      const config = JSON.parse(fs.readFileSync(tsConfigFile, "utf8"));
      let content = fs.readFileSync(tsConfigFile, "utf8");
      let updated = false;

      // Update the extends path
      if (config.extends && typeof config.extends === "string") {
        // Determine the correct config type based on the current extends path
        const configType = config.extends.includes("/application/")
          ? "application"
          : "ts-package";

        // Create a new path that uses the correct relative path to tools
        const newExtendsPath = `${relativePathToTools}/config/typescript/src/${configType}/${path.basename(config.extends)}`;

        if (newExtendsPath !== config.extends) {
          // Escape special characters for the regex pattern
          const escapedPath = config.extends.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          content = content.replace(
            new RegExp(`"extends":[ \t]*"${escapedPath}"`),
            `"extends": "${newExtendsPath}"`,
          );
          updated = true;
        }
      }

      if (updated) {
        fs.writeFileSync(tsConfigFile, content, "utf8");
        updatedCount++;
        console.log(
          `Updated TypeScript config path in: ${path.relative(projectRoot, tsConfigFile)}`,
        );
      }
    } catch (err) {
      console.error(
        `Error updating TypeScript config file ${tsConfigFile}:`,
        err.message,
      );
    }
  }

  console.log(`Updated ${updatedCount} TypeScript configuration files.`);
}
