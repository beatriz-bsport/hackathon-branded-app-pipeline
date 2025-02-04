import type { Command } from "commander";
import type { DistinctQuestion } from "inquirer";
import type { PackageJson } from "@bsport/typescript-monorepo-utils";
import { spawn } from "child_process";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import kebabCase from "lodash/kebabCase";
import {
  getMonorepoBasePath,
  getProjectsPackageJsons,
  declareEnvVariable,
} from "@bsport/typescript-monorepo-utils";

const bsportName = "bsport";

/**
 * Main command parameters
 */
type ActionParameters = {
  name: string;
  title: string;
  path: string;
  template: string;
};

const templateSetupPnpmCommand = "project:init";

export default function projectCreate(program: Command) {
  program
    .command("project:create")
    .description(
      `
Creates a new project from a template and installs its dependencies and:

 - sets \`"name": "@bsport/{params.name}"\` in package.json,
 - sets \`"description": "params.title"\` in package.json,
 - sets \`"author": "{gitUserName} <{gitUserEmail}>"\` in package.json (being pulled from the local git configuration),
 - removes the prefix \`placeholder:\` from all scripts names in \`package.json\` (if any),
 - if the \`package.json\` file of the template includes a \`${templateSetupPnpmCommand}\` script, runs \`pnpm run ${templateSetupPnpmCommand} --name {params.name} --title {params.title}\`,
 - if the project is not recognised by the monorepo, prints a warning and suggests to add it to pnpm-workspace.yaml.
 `,
    )
    .option("--name <projectName>", "The name of the project to create.")
    .option("--title <projectTitle>", "Human readable title of the project.")
    .option(
      "--path <projectPath>",
      "The path where the project should be created (relative from the monorepo root path). Ex: apps/applications/specialist/test-app",
    )
    .option(
      "--template <template>",
      "Template that should be the base for the project.",
    )
    .option(
      "-q, --quiet",
      "suppress all output, unless an error occurs.",
      false,
    )
    .action(main);
  return program;
}

async function getTemplatesDirPath() {
  const monorepoBasePath = await getMonorepoBasePath();
  return path.resolve(monorepoBasePath, "tools/templates");
}

/**
 * Runs the command.
 */
async function main(options: Partial<ActionParameters> & { quiet: boolean }) {
  const print = (...args) => !options.quiet && console.log(...args);
  const monorepoBasePath = await getMonorepoBasePath();
  const templatesDirectoryPath = await getTemplatesDirPath();

  let packageJSON: PackageJson;
  let params: ActionParameters;
  let projectAbsPath: string;
  let templateAbsPath: string;

  // Get parameters based on options and prompt the missing ones.
  {
    const templates = await getTemplates();
    const parametersDescription: {
      [paramName: string]: DistinctQuestion<ActionParameters>;
    } = {
      name: {
        type: "input",
        message: "Project name: ",
        validate: (value) => {
          if (!value) {
            return "Project name is required.";
          }
          if (kebabCase(value) !== value) {
            return "Project name must be kebab-case.";
          }
          return true;
        },
      },
      title: {
        type: "input",
        message: "Project title: ",
        validate: (value) => {
          if (!value) {
            return "Project title is required.";
          }
          // Project name should start with an uppercase letter unless the first word is bsport
          if (
            value.split(" ")[0] !== bsportName &&
            value[0] !== value[0].toUpperCase()
          ) {
            return "Project title must start with an uppercase letter.";
          }
          return true;
        },
      },
      path: {
        type: "input",
        message: "Directory where to create the project: ",
        validate: async (value) => {
          if (!value) {
            return "Project path is required.";
          }
          const projectFullPath = path.resolve(monorepoBasePath, value);
          if (fs.existsSync(projectFullPath)) {
            return `${projectFullPath} already exists. Please select a different path to create your project.`;
          }
          return true;
        },
      },
      template: {
        type: "list",
        message: "Template to base the project from: ",
        choices: templates,
        default: "template-package",
        validate: (value) => {
          if (!templates.map((t) => t.value).includes(value)) {
            return `Template ${value} does not exist.`;
          }
          return true;
        },
      },
    };
    const questions = Object.entries(parametersDescription).map(
      ([fieldName, question]) => {
        return {
          ...question,
          name: fieldName,
          when: async () => {
            if (!options[fieldName]) {
              return true;
            }
            if (!parametersDescription[fieldName].validate) {
              return false;
            }
            const validation = await parametersDescription[fieldName].validate(
              options[fieldName],
            );
            if (validation !== true) {
              console.log(
                "❌ " + (validation || `Invalid input: ${options.name}`),
              );
              process.exit(1);
            }
          },
        };
      },
    );

    const answers = await inquirer.prompt(questions);
    params = { ...options, ...answers };
    projectAbsPath = path.resolve(monorepoBasePath, params.path);
    templateAbsPath = path.resolve(templatesDirectoryPath, params.template);
    Object.entries(parametersDescription).forEach(
      ([paramName, description]) => {
        print(`ℹ️  ${description.message} ${params[paramName]}`);
      },
    );
  }

  // Copy the template at the target path
  {
    fs.copySync(templateAbsPath, projectAbsPath, {
      filter(src) {
        return !src.split("/").includes("node_modules");
      },
    });
    print(`✅ Project created at ${projectAbsPath}`);
  }

  // Writes information in package.json
  {
    print("⏳ Updating package.json...");
    const packageJSONPath = path.resolve(projectAbsPath, "package.json");
    try {
      packageJSON = fs.readJsonSync(packageJSONPath) as PackageJson;
      packageJSON.name = `@bsport/${params.name}`;
      packageJSON.description = params.title;
      packageJSON.version = "0.0.0";
      const gitConfig = fs.readFileSync(
        path.resolve(process.env.HOME, ".gitconfig"),
        "utf8",
      );
      const gitConfigLines = gitConfig.split("\n");
      const gitUserName = gitConfigLines
        .find((line) => line.startsWith("\tname = "))
        ?.replace("\tname = ", "");
      const gitUserEmail = gitConfigLines
        .find((line) => line.startsWith("\temail = "))
        ?.replace("\temail = ", "");
      packageJSON.author = `${gitUserName} <${gitUserEmail}>`;

      Object.keys(packageJSON.scripts).forEach((scriptName) => {
        if (!scriptName.startsWith("placeholder:")) {
          return;
        }
        const newScriptName = scriptName.replace("placeholder:", "");
        packageJSON.scripts[newScriptName] = packageJSON.scripts[scriptName];
        packageJSON.scripts[scriptName] = undefined;
      });
      fs.writeJsonSync(packageJSONPath, packageJSON, { spaces: 2 });
    } catch (e) {
      throw new Error(`
❌ Error while updating package.json: ${e.message}
❌ Please fix:
- the template's package.json at ${path.resolve(
        templateAbsPath,
        "package.json",
      )}
- the project's package.json at ${packageJSONPath}
`);
    }
  }

  // Runs `pnpm install` while printing shell output.
  {
    print("⏳ Installing dependencies...");
    await new Promise<void>((resolve, reject) => {
      const subShell = spawn("pnpm install", [], {
        stdio: "inherit",
        shell: true,
        cwd: projectAbsPath,
      });
      subShell.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`pnpm install exited with code ${code}`));
          return;
        }
        resolve();
      });
    });
    print("✅ Dependencies installed.");
  }

  // Returns if the created project is recognised by the monorepo.
  {
    print("⏳ Checking if the project is recognised by the monorepo...");
    const monorepoProjects = await getProjectsPackageJsons();
    const isInMonorepo = Object.keys(monorepoProjects).includes(
      packageJSON.name,
    );

    if (!isInMonorepo) {
      throw new Error(`❌ The package is not recognised by the monorepo.
Please edit the following file to include it: ${path.resolve(
        monorepoBasePath,
        "pnpm-workspace.yaml",
      )}`);
    }
    print("✅ The package has been successfully declared in the monorepo.");
  }

  // Populate env variables
  {
    print("⏳ Populating env variables...");
    // Read the env variables from the .env file
    const envFile = path.resolve(projectAbsPath, ".env");
    if (fs.existsSync(envFile)) {
      // Override or create specific variables with the right value

      // Override VITE_I18N_NAMESPACE_PREFIX if it exists with the app name
      declareEnvVariable({
        filename: envFile,
        name: "VITE_I18N_NAMESPACE_PREFIX",
        value: params.name,
        overrideOnly: true,
      });
    }
    print(
      "✅ The env variables has been successfully setup in the new project !",
    );
  }

  // Symlink .prettierignore configuration
  {
    const ignoreFile = path.resolve(projectAbsPath, ".prettierignore");

    if (fs.readlinkSync(ignoreFile)) {
      print("⏳ Found .prettierignore - fixing symlink...");

      try {
        fs.removeSync(ignoreFile);

        const target = path.relative(
          projectAbsPath,
          path.join(monorepoBasePath, ".prettierignore"),
        );

        fs.symlinkSync(target, ignoreFile);
      } catch (e) {
        throw new Error(`❌ Error while symlinking: ${e.message}`);
      }
    }
  }

  // Runs the setup script if it exists.
  {
    if (!packageJSON.scripts[templateSetupPnpmCommand]) {
      return;
    }
    const command = `pnpm run ${templateSetupPnpmCommand} --name="${
      params.name
    }" --title="${params.title.replace(/"/g, '\\"')}"`;
    print(
      `ℹ️  Setup script "${templateSetupPnpmCommand}" found. Running: ${command}...`,
    );
    await new Promise<void>((resolve, reject) => {
      const subShell = spawn(command, [], {
        stdio: "inherit",
        shell: true,
        cwd: projectAbsPath,
      });
      subShell.on("close", (code) => {
        if (code !== 0) {
          return reject(
            new Error(
              `Setup script "${templateSetupPnpmCommand}" failed with code ${code}`,
            ),
          );
        }
        resolve();
      });
    });
  }
  print("✅ Done! 🎉");
}

/**
 * Returns list of templates to select from
 */
const getTemplates = async () => {
  const templatesDirectoryPath = await getTemplatesDirPath();
  const templates = fs
    .readdirSync(templatesDirectoryPath)
    // List directories in the templates folder
    .filter(
      (template) =>
        !!template &&
        !template.startsWith(".") &&
        fs
          .lstatSync(path.resolve(templatesDirectoryPath, template))
          .isDirectory(),
    )
    .map((template) => {
      try {
        const packageJson = fs.readJsonSync(
          path.resolve(templatesDirectoryPath, template, "package.json"),
        );
        const name = packageJson.name.replace("template-", "");
        // Format templates names for display
        return {
          name: `${name}${packageJson.description ? " - " : ""}${
            packageJson.description || ""
          }`,
          value: template,
        };
      } catch (e) {
        console.error(e);
        return {
          name: template,
          value: template,
          disabled: "Invalid package.json",
        };
      }
    });
  return templates;
};
