#!/usr/bin/env node
import fs from "fs";
import path from "path";
import process from "process";

try {
  /**
   * This script prepares the project to be used after being scaffolded.
   * It replaces all usages of __SM_APPLICATION__ with the provided name parameter
   * and converts the name to a constant-style format (e.g., sm-navigation-sidebar → __NAVIGATION_SIDEBAR__)
   */

  console.log("Starting project initialization...");

  // Parse command line arguments
  const args = process.argv.slice(2);
  console.log("Arguments received:", args);

  // Extract name from arguments
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

  // Convert name to constant format (e.g., sm-navigation-sidebar → __NAVIGATION_SIDEBAR__)
  const getConstantName = (name) => {
    // Remove 'sm-' or any other prefix if it exists
    const baseName = name.replace(/^[^-]+-/, "");
    return `__${baseName.toUpperCase().replace(/-/g, "_")}__`;
  };

  const constantName = getConstantName(name);
  console.log("Constant name:", constantName);

  // Get the project root directory (current working directory)
  const projectRoot = process.cwd();
  console.log("Project root:", projectRoot);

  // Manually find files that might contain the placeholder
  // This avoids using external dependencies like glob
  const findFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      // Skip node_modules, dist, and scripts directories
      if (file === "node_modules" || file === "dist" || file === "scripts") {
        return;
      }

      if (fs.statSync(filePath).isDirectory()) {
        findFiles(filePath, fileList);
      } else {
        // Only process .ts and .tsx files
        const ext = path.extname(file).toLowerCase();
        if ([".ts", ".tsx"].includes(ext)) {
          fileList.push(filePath);
        }
      }
    });

    return fileList;
  };

  const filesToProcess = findFiles(projectRoot);
  console.log(`Found ${filesToProcess.length} files to check`);

  // Replace the placeholder in all files
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

  console.log(`Replacement complete! Modified ${replacementCount} files.`);
  console.log(`Replaced __SM_APPLICATION__ with ${constantName}`);

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

  // delete package.json project:init script
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  delete packageJson.scripts["project:init"];
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Deleted package.json project:init script.");

  console.log("Project initialization complete.");
  process.exit(0);
} catch (error) {
  console.error("Error in initialization script:", error);
  process.exit(1);
}
