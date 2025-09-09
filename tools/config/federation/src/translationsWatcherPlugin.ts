import { exec as execCallback } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { promisify } from "util";
import { Plugin } from "vite";

const exec = promisify(execCallback);

const I18N_SOURCE_PATH = path.join("i18n", "source");

/**
 * Creates a Vite plugin that watches for changes in translation files and automatically updates translations.
 *
 * This plugin monitors the i18n/source directory for file changes. When a translation file
 * is modified  —after saved—, it automatically runs the 'translation:update' script to regenerate translation assets.
 * This ensures that the application always has the latest translations during development.
 *
 * @param {string} baseDir - The base directory of the project where the translation files are located
 * @returns {Plugin} A Vite plugin configured to watch and update translation files
 */
export function translationsWatcher(baseDir: string): Plugin {
  return {
    name: "@bsport/translations-watcher-plugin",
    apply: "serve",
    configureServer(server) {
      // Watch for changes in the i18n/source directory
      const translationsDir = path.resolve(baseDir, "src", I18N_SOURCE_PATH);
      if (existsSync(translationsDir)) {
        server.watcher.add(translationsDir);
      }

      server.watcher.on("change", async (filePath) => {
        // Check if the changed file is in the source directory
        if (filePath.includes(I18N_SOURCE_PATH)) {
          console.log(
            "\n🌐 Translation file changed:",
            path.relative(baseDir, filePath),
          );
          console.log("🔄 Running translation:update script...");

          // Execute the translation:update script asynchronously
          try {
            const { stdout, stderr } = await exec(
              "pnpm run translation:update",
              { cwd: baseDir },
            );

            if (stderr) {
              console.error("⚠️ Script stderr:", stderr);
            }

            console.log("✅ Translation update completed successfully!");
            if (stdout) {
              console.log(stdout);
            }
          } catch (error) {
            console.error("❌ Error running translation:update script:", error);
          }
        }
      });
    },
  };
}
