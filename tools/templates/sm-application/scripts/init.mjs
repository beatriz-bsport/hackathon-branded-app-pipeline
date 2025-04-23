#!/usr/bin/env node
import fs from "fs";
import path from "path";
import process from "process";

/**
 * This script prepares the project to be used after being scaffolded.
 * It replaces all usages of __SM_APPLICATION__ with the provided name parameter
 * and converts the name to a constant-style format (e.g., sm-navigation-sidebar → __NAVIGATION_SIDEBAR__)
 * It also updates TypeScript config paths to point to the correct location.
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

    // Extract and process the name parameter
    const name = extractNameFromArgs();
    const constantName = getConstantName(name);
    console.log("Constant name:", constantName);

    // Replace placeholders in files
    const replacementCount = replacePlaceholders(projectRoot, constantName);
    console.log(`Replacement complete! Modified ${replacementCount} files.`);
    console.log(`Replaced __SM_APPLICATION__ with ${constantName}`);

    // Clean up scripts and package.json
    cleanupScripts(projectRoot);

    // Update TypeScript configuration paths
    updateTsConfigPaths(projectRoot);

    console.log("Project initialization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error in initialization script:", error);
    process.exit(1);
  }
}

// Execute the main function
main();

/* Auxiliary functions


/**
 * Extracts the name parameter from command line arguments
 * @returns {string} The extracted name
 */
function extractNameFromArgs() {
  const args = process.argv.slice(2);
  console.log("Arguments received:", args);

  let name = "";
  for (const arg of args) {
    const cleanArg = arg.replace(/^"|"$/g, ""); // Remove quotes if present
    if (cleanArg.startsWith("--name=")) {
      name = cleanArg.substring(7);
      break;
    }
  }

  if (!name) {
    console.error("Error: --name parameter is required");
    console.error("Received arguments:", args);
    process.exit(1);
  }

  console.log("Using name:", name);
  return name;
}

/**
 * Converts a name to constant format (e.g., sm-navigation-sidebar → __NAVIGATION_SIDEBAR__)
 * @param {string} name - The name to convert
 * @returns {string} The converted constant name
 */
function getConstantName(name) {
  // Remove 'sm-' or any other prefix if it exists
  const baseName = name.replace(/^[^-]+-/, "");
  return `__${baseName.toUpperCase().replace(/-/g, "_")}__`;
}

/**
 * Recursively finds TypeScript files in a directory
 * @param {string} dir - The directory to search
 * @param {Array<string>} fileList - Accumulator for found files
 * @returns {Array<string>} List of TypeScript files
 */
function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // Skip node_modules, dist, and scripts directories
    if (file === "node_modules" || file === "dist" || file === "scripts") {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else {
      // Only process .ts and .tsx files
      const ext = path.extname(file).toLowerCase();
      if ([".ts", ".tsx"].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Replaces placeholders in TypeScript files
 * @param {string} projectRoot - The project root directory
 * @param {string} constantName - The constant name to replace placeholders with
 * @returns {number} Number of files modified
 */
function replacePlaceholders(projectRoot, constantName) {
  const filesToProcess = findTypeScriptFiles(projectRoot);
  console.log(`Found ${filesToProcess.length} files to check`);

  let replacementCount = 0;

  filesToProcess.forEach((filePath) => {
    try {
      let content = fs.readFileSync(filePath, "utf8");

      // Skip if file doesn't contain the placeholder
      if (!content.includes("__SM_APPLICATION__")) {
        return;
      }

      const originalContent = content;

      // Replace the placeholder with the constant name
      content = content.replace(/__SM_APPLICATION__/g, constantName);

      // Only write if content has changed
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, "utf8");
        replacementCount++;
        console.log(`Updated: ${path.relative(projectRoot, filePath)}`);
      }
    } catch (err) {
      console.error(`Error processing file ${filePath}:`, err.message);
    }
  });

  return replacementCount;
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
  const tsConfigFiles = [
    path.join(projectRoot, "tsconfig.json"),
    path.join(projectRoot, "tsconfig.node.json"),
    path.join(projectRoot, "tsconfig.app.json"),
  ];

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
  tsConfigFiles.forEach((configPath) => {
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        let content = fs.readFileSync(configPath, "utf8");
        let updated = false;

        // Update the extends path
        if (config.extends && typeof config.extends === "string") {
          // Create a new path that uses the correct relative path to tools
          const newExtendsPath = `${relativePathToTools}/config/typescript/src/application/${path.basename(config.extends)}`;

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
          fs.writeFileSync(configPath, content, "utf8");
          updatedCount++;
          console.log(
            `Updated TypeScript config path in: ${path.relative(projectRoot, configPath)}`,
          );
        }
      } catch (err) {
        console.error(
          `Error updating TypeScript config file ${configPath}:`,
          err.message,
        );
      }
    }
  });

  console.log(`Updated ${updatedCount} TypeScript configuration files.`);
}
