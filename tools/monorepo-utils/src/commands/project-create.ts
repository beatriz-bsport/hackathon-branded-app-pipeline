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
} from "@bsport/typescript-monorepo-utils";

/**
 * Main command parameters
 */
type ActionParameters = {
  name: string;
  title: string;
  path: string;
  template: string;
};

const npmSetupCommand = "project:init";

async function getTemplatesDirPath() {
  const monorepoBasePath = await getMonorepoBasePath();
  return path.resolve(monorepoBasePath, "tools/templates");
}

/**
 * Runs the command.
 */
async function main(options: Partial<ActionParameters> & { quiet: boolean }) {
  const print: typeof console.log = (...args) =>
    !options.quiet && console.log(...args);

  const monorepoBasePath = await getTemplatesDirPath();
  const templatesDirectoryPath = await getTemplatesDirPath();

  const params = await promptMissingParameters(options, { print });

  const projectAbsPath = path.resolve(monorepoBasePath, params.path);
  const templateAbsPath = path.resolve(templatesDirectoryPath, params.template);
  fs.copySync(templateAbsPath, projectAbsPath);
  print(`✅ Project created at ${projectAbsPath}`);

  print("⏳ Updating package.json...");
  const packageJSON = await writePackageJson({
    projectAbsPath,
    serviceName: params.name,
    serviceTitle: params.title,
    templateAbsPath,
  });
  print("✅ package.json updated");

  print("⏳ Installing dependencies...");
  await installDependencies({ projectAbsPath });
  print("✅ Dependencies installed.");

  print("⏳ Checking if the project is recognised by the monorepo...");
  await checkIfProjectInMonorepo({ projectName: packageJSON.name });
  print("✅ The package has been successfully declared in the monorepo.");

  await runSetupCommand({ params, print, projectAbsPath, packageJSON });

  print("✅ Done! 🎉");
}

/**
 * Writes information in packageJson.
 */
async function writePackageJson({
  serviceName,
  serviceTitle,
  projectAbsPath,
  templateAbsPath,
}: {
  projectAbsPath: string;
  serviceName: string;
  serviceTitle: string;
  templateAbsPath: string;
}) {
  const packageJSONPath = path.resolve(projectAbsPath, "package.json");
  try {
    const projectName = `@bsport/${serviceName}`;
    const packageJSON = fs.readJsonSync(packageJSONPath) as PackageJson;
    packageJSON.name = projectName;
    packageJSON.description = serviceTitle;
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
    return packageJSON;
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

/**
 * Runs `pnpm install` while printing shell output.
 */
async function installDependencies({
  projectAbsPath,
}: {
  projectAbsPath: string;
}) {
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
}

/**
 * Runs the setup script if it exists.
 */
async function runSetupCommand({
  params,
  print,
  projectAbsPath,
  packageJSON,
}: {
  params: ActionParameters;
  projectAbsPath: string;
  print: typeof console.log;
  packageJSON: PackageJson;
}) {
  if (!packageJSON.scripts[npmSetupCommand]) {
    return;
  }
  const command = `pnpm run ${npmSetupCommand} --name="${
    params.name
  }" --title="${params.title.replace(/"/g, '\\"')}"`;
  print(`ℹ️  Setup script "${npmSetupCommand}" found. Running: ${command}...`);
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
            `Setup script "${npmSetupCommand}" failed with code ${code}`,
          ),
        );
      }
      resolve();
    });
  });
}

/**
 * Prompts the user for missing params.
 */
async function promptMissingParameters(
  options: Parameters<typeof main>[0],
  { print }: { print: typeof console.log },
): Promise<ActionParameters> {
  const templatesDirectoryPath = await getTemplatesDirPath();
  const templates = fs
    .readdirSync(templatesDirectoryPath)
    .filter((template) => !template.startsWith("."))
    .map((template) => {
      try {
        const packageJson = fs.readJsonSync(
          path.resolve(templatesDirectoryPath, template, "package.json"),
        );
        const name = packageJson.name.replace("template-", "");
        return {
          name: `${name}${packageJson.description ? " - " : ""}${
            packageJson.description
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
        if (value[0] !== value[0].toUpperCase()) {
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
        const monorepoBasePath = await getMonorepoBasePath();
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
  const when = (fieldName: string) => () => {
    if (!options[fieldName]) {
      return true;
    }
    if (!parametersDescription[fieldName].validate) {
      return false;
    }
    const validation = parametersDescription[fieldName].validate(
      options[fieldName],
    );
    if (validation !== true) {
      console.log("❌ " + (validation || `Invalid input: ${options.name}`));
      process.exit(1);
    }
  };

  const answers = await inquirer.prompt(
    Object.entries(parametersDescription).map(([fieldName, question]) => ({
      ...question,
      name: fieldName,
      when: when(fieldName),
    })),
  );
  Object.entries(parametersDescription).forEach(([paramName, description]) => {
    print(`ℹ️  ${description.message} ${options[paramName]}`);
  });
  return { ...options, ...answers };
}

/**
 * Returns if the created project is recognised by the monorepo.
 */
async function checkIfProjectInMonorepo({
  projectName,
}: {
  projectName: string;
}) {
  const monorepoProjects = await getProjectsPackageJsons();
  const isInMonorepo = Object.keys(monorepoProjects).includes(projectName);

  if (!isInMonorepo) {
    const monorepoBasePath = await getMonorepoBasePath();
    throw new Error(`❌ The package is not recognised by the monorepo.
Please edit the following file to include it: ${path.resolve(
      monorepoBasePath,
      "pnpm-workspace.yaml",
    )}`);
  }
}

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
 - if the \`package.json\` file of the template includes a \`${npmSetupCommand}\` script, runs \`pnpm run ${npmSetupCommand} --name {params.name} --title {params.title}\`,
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
