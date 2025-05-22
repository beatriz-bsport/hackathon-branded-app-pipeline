#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";

/**
 * This script prepares the store package to be used after being scaffolded.
 * It updates TypeScript config paths to point to the correct location.
 */

/**
 * Main function to run the initialization process
 */
function main() {
  try {
    console.log("Starting project initialization...");

    // Get the project root directory (current working directory)
    const projectRoot = process.cwd();
    console.log("Project root:", projectRoot);

    // Update TypeScript configuration paths
    console.log("Updating TypeScript configuration paths...");
    updateTsConfigPaths(projectRoot);

    // Build the project
    console.log("Building project...");
    buildProject(projectRoot);

    // Clean up scripts and package.json
    cleanupScripts(projectRoot);

    console.log("Project initialization complete.");
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
  const tsConfigFile = path.join(projectRoot, "tsconfig.json");

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

  // Update each TypeScript config file
  let updatedCount = 0;
  if (fs.existsSync(tsConfigFile)) {
    try {
      const config = JSON.parse(fs.readFileSync(tsConfigFile, "utf8"));
      let content = fs.readFileSync(tsConfigFile, "utf8");
      let updated = false;

      // Update the extends path
      if (config.extends && typeof config.extends === "string") {
        // Create a new path that uses the correct relative path to tools
        const newExtendsPath = `${relativePathToTools}/config/typescript/src/ts-package/${path.basename(config.extends)}`;

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
