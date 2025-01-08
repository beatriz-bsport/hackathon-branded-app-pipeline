import path from "path";
import util from "node:util";
import fs from "fs-extra";
import child_process from "child_process";
import { getMonorepoBasePath } from "@bsport/typescript-monorepo-utils";

import type { Command } from "commander";

const exec = util.promisify(child_process.exec);

const REPOSITORIES = {
  SAAS: "bsport-saas",
  WIDGET: "bsport-widget",
  COMMONS: "bsport-commons-js",
};

function getPrintFns({ quiet }: { quiet: boolean }) {
  return {
    print: (...msgs) => !quiet && console.log(...msgs),
    printGroup: (...msgs) => !quiet && console.group(...msgs),
    printGroupEnd: () => !quiet && console.groupEnd(),
  };
}

type PrintFn = (...msg: string[]) => void;

/**
 * @param {string} projectPath
 * @param {{repo: 'bsport-saas' | 'bsport-widget' | 'bsport-commons-js', quiet: boolean}} options
 */
async function action(
  projectPath: string,
  { repo, quiet }: { repo: string; quiet: boolean },
) {
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup("\n\t🚀    Start cleaning project    🚀");

  const monorepoPath = await getMonorepoBasePath();
  const projectAbsolutePath = path.resolve(monorepoPath, projectPath);

  printGroup("\n1️⃣  Update package.json");
  await updatePackageJson({ print, projectAbsolutePath });
  printGroupEnd();

  printGroup("\n2️⃣  Replace yarn with pnpm as package manager");
  await replaceYarnWithPnmp({ print, projectAbsolutePath, repo });
  printGroupEnd();

  printGroup("\n3️⃣  Check yarn has been removed");
  await checkYarnHasBeenRemoved({ print, projectAbsolutePath });
  printGroupEnd();

  printGroup("\n4️⃣  Install and clean dependencies with pnpm");
  await installDependenciesWithPnpm({ print, projectAbsolutePath, repo });
  printGroupEnd();

  printGroup("\n5️⃣  Fix all imports from @bsport/common with .js extension");
  await addExtensionsWhenImportingBsportCommon({ print, projectAbsolutePath });
  printGroupEnd();

  printGroup("\n6️⃣  Remove useless and breaking storybook");
  await removeStorybook({ print, projectAbsolutePath });
  printGroupEnd();

  printGroup("\n7️⃣  Fix broken tests");
  await fixTest({ print, projectAbsolutePath });
  printGroupEnd();

  printGroup("\n8️⃣  Commit changes");
  await commitChanges({ print, projectAbsolutePath });
  printGroupEnd();

  print(`\n✅ Successfully clean project !`);

  printGroupEnd();
}

async function updatePackageJson({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  const packageJsonPath = path.resolve(projectAbsolutePath, "package.json");
  if (!fs.existsSync(packageJsonPath)) return;

  const packageJson = fs.readJSONSync(packageJsonPath);

  // Add node22 to engines
  print("¤ Add engines node 22 to package.json");
  packageJson["engines"] = { node: ">=22" };

  // Remove nvmrc to prefer the monorepo nvmrc file
  const nvmrcPath = path.resolve(projectAbsolutePath, ".nvmrc");
  if (fs.existsSync(nvmrcPath)) {
    fs.unlinkSync(nvmrcPath);
    print(`¤ Remove .nvmrc in ${projectAbsolutePath}`);
  }

  // Remove husky script
  if (packageJson["scripts"]["prepare"]) {
    print("¤ Remove 'prepare' script from package.json");
    delete packageJson["scripts"]["prepare"];
  }

  // Sort the package.json fields
  print("¤ Sort dependencies");
  const sortedDependencies = _sortPackageJsonField({
    initialJsonObject: packageJson["dependencies"],
  });
  if (sortedDependencies) {
    packageJson["dependencies"] = sortedDependencies;
  }
  print("¤ Sort devDependencies");
  const sortedDevDependencies = _sortPackageJsonField({
    initialJsonObject: packageJson["devDependencies"],
  });
  if (sortedDevDependencies) {
    packageJson["devDependencies"] = sortedDevDependencies;
  }
  print("¤ Sort scripts");
  const sortedScripts = _sortPackageJsonField({
    initialJsonObject: packageJson["scripts"],
  });
  if (sortedScripts) {
    packageJson["scripts"] = sortedScripts;
  }

  // Write and commit the changes
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function _sortPackageJsonField({
  initialJsonObject,
}: {
  initialJsonObject: object;
}) {
  if (!initialJsonObject) return null;
  const orderedObjectAsArray = Object.entries(initialJsonObject).sort(
    (dep1, dep2) => dep1[0].localeCompare(dep2[0]),
  );
  return Object.fromEntries(orderedObjectAsArray);
}

async function _replaceString({
  print,
  projectAbsolutePath,
  previousString,
  nextString,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
  previousString: string;
  nextString: string;
}) {
  print(`¤ Replace "${previousString}" with "${nextString}"`);
  const previousStringOccurences = (
    await exec(`git grep -l "${previousString}" | wc -l`, {
      cwd: projectAbsolutePath,
    })
  ).stdout.trim();
  if (previousStringOccurences === "0") {
    print("¤ No occurences of this content ! Already good.");
  } else {
    const gitCommand = `git grep -l "${previousString}" | xargs sed -i "s/${previousString}/${nextString}/g"`;
    print(`> ${gitCommand}`);
    await exec(gitCommand, { cwd: projectAbsolutePath });
  }
}

async function replaceYarnWithPnmp({
  print,
  projectAbsolutePath,
  repo,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
  repo: string | undefined;
}) {
  const replaceString = (previousString: string, nextString: string) =>
    _replaceString({ print, projectAbsolutePath, previousString, nextString });

  if (repo === REPOSITORIES.SAAS) {
    print("¤ Set useYarn in build commands to false");
    await replaceString(
      "const useYarn = fs.existsSync(paths.yarnLockFile);",
      "const useYarn = false;",
    );
  }

  await replaceString("\\*\\*yarn\\*\\*", "\\*\\*pnpm\\*\\*");

  await replaceString("yarn-error.log\\*", "pnpm-debug.log\\*");

  await replaceString("yarn-debug.log\\*", ""); // No equivalent

  await replaceString("yarnLockFile: resolveApp('yarn.lock'),", "");

  await replaceString("yarn prettier", "pnpm exec prettier");

  await replaceString("yarn jest", "pnpm exec jest");

  await replaceString("yarn run", "pnpm run");

  await replaceString("yarn", "pnpm run");

  const yarnLockPath = path.resolve(projectAbsolutePath, "yarn.lock");
  if (fs.existsSync(yarnLockPath)) {
    print(`¤ Remove yarn.lock in ${projectAbsolutePath}`);
    fs.unlinkSync(yarnLockPath);
  }

  const packageJsonPath = path.resolve(projectAbsolutePath, "package.json");
  const packageJson = fs.readJSONSync(packageJsonPath);
  if (packageJson["resolutions"]) {
    print("¤ Remove 'resolutions' (yarn-specific) in package.json");
    delete packageJson["resolutions"];
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function checkYarnHasBeenRemoved({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  print("> git grep 'yarn' | wc -l");
  const yarnOccurences = (
    await exec("git grep 'yarn' | wc -l", { cwd: projectAbsolutePath })
  ).stdout.trim();
  const yarnHasBeenRemoved = yarnOccurences === "0";
  if (yarnHasBeenRemoved) {
    print("¤ Yarn has been removed successfully ! Commit changes");
  } else {
    print(`! Yarn has been found ${yarnOccurences} times !`);
    print("> git grep 'yarn'");
    await exec("git grep 'yarn'", { cwd: projectAbsolutePath });
    throw new Error(
      "! Please, manually update the remaining yarn occurences and relaunch the script",
    );
  }
}

async function installDependenciesWithPnpm({
  print,
  projectAbsolutePath,
  repo,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
  repo: string;
}) {
  print("¤ Install dependencies from package.json");
  print("> pnpm install");
  await exec("pnpm install", { cwd: projectAbsolutePath });
  print("¤ Dependencies installed with success");

  if (repo === REPOSITORIES.SAAS) {
    await _installSaaSDependencies({ print, projectAbsolutePath });
  }

  if (repo === REPOSITORIES.WIDGET) {
    await _installWidgetDependencies({ print, projectAbsolutePath });
  }
}

async function _installSaaSDependencies({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  print("¤ Install missing dependencies of bsport-saas");
  print(
    "> pnpm add react-draggable react-transition-group @types/react-transition-group",
    "clsx resize-observer-polyfill tinycolor2",
  );
  await exec(
    "pnpm add clsx react-draggable react-transition-group resize-observer-polyfill tinycolor2 react-error-overlay@6.0.9",
    { cwd: projectAbsolutePath },
  );
  await exec("pnpm add --save-dev @types/react-transition-group", {
    cwd: projectAbsolutePath,
  });
  print("¤ Missing dependencies installed with success");

  print("¤ Upgrade jest dependencies to solve test issues");
  print(
    "> pnpm add --save-dev enzyme enzyme-adapter-react-16 jest@latest",
    "enzyme-to-json@latest @testing-library/jest-dom@6.4.6 cheerio@1.0.0-rc.12",
  );
  await exec(
    "pnpm add --save-dev enzyme enzyme-adapter-react-16 jest@latest \
    enzyme-to-json@latest @testing-library/jest-dom@6.4.6 cheerio@1.0.0-rc.12",
    {
      cwd: projectAbsolutePath,
    },
  );
  print("¤ Jest dependencies upgraded with success");
}

async function _installWidgetDependencies({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  print("¤ Install missing dependencies of bsport-widget");
  print("> pnpm add --save-dev classnames");
  await exec("pnpm add --save-dev classnames", { cwd: projectAbsolutePath });
  print("¤ Missing dependencies installed with success");

  const packageJsonPath = path.resolve(projectAbsolutePath, "package.json");
  const packageJson = fs.readJSONSync(packageJsonPath);
  const dependencies = packageJson["dependencies"];
  print("¤ Add @bsport/saas-legacy to dependencies");
  dependencies["@bsport/saas-legacy"] = "workspace:*";
  const sortedDependencies = _sortPackageJsonField({
    initialJsonObject: dependencies,
  });
  packageJson["dependencies"] = sortedDependencies;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  await exec("pnpm i", { cwd: projectAbsolutePath });
  print("¤ @bsport/saas-legacy installed with success");

  const tsConfigJsonPath = path.resolve(projectAbsolutePath, "tsconfig.json");
  const tsConfigJson = fs.readJsonSync(tsConfigJsonPath);
  if (tsConfigJson["exclude"]) {
    print("¤ Remove tsconfig exclude of bsport-saas");
    delete tsConfigJson["exclude"];
  }
  fs.writeFileSync(tsConfigJsonPath, JSON.stringify(tsConfigJson, null, 2));

  print(
    "¤ Replace bsport-saas with @bsport/saas-legacy to use internal monorepo folder",
  );
  await _replaceString({
    print,
    projectAbsolutePath,
    previousString: "bsport-saas",
    nextString: "@bsport\\/saas-legacy",
  });
}

async function addExtensionsWhenImportingBsportCommon({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  print("¤ Check each file has correct import of bsport-commmon");
  print(
    "¤ Add .js extensions to all incompleted imports, with the following regex : /@bsport/common/[^.']*'/ ",
  );
  print("¤ Fix imports from @bsport/common/src to @bsport/common/lib");

  function findAndFixBsportCommonImport(dirPath: string, subPath: string) {
    const fullPath = path.join(dirPath, subPath);
    const expectedExtensions = [".js", ".ts", ".tsx", ".jsx", ".mdx"];
    if (fs.statSync(fullPath).isDirectory()) {
      const _files = fs.readdirSync(fullPath);
      for (const _file of _files) {
        findAndFixBsportCommonImport(fullPath, _file);
      }
    } else if (expectedExtensions.some((val) => fullPath.endsWith(val))) {
      const content = fs.readFileSync(fullPath, "utf-8");

      // Regex to find imports starting with @bsport/common without an extension
      const regex = /@bsport\/common\/[^.']*'/;

      // If no content matching the regex, continue to next file
      if (regex.exec(content) === null) return;

      let updatedContent = content.replace(
        "bsport/common/src",
        "bsport/common/lib",
      );
      while (regex.exec(updatedContent) !== null) {
        // Replace does not work with the regex for all occurences
        // Thus update the content while it matches
        updatedContent = updatedContent.replace(regex, (match) => {
          return match.slice(0, -1) + ".js'"; // Replace the trailing `'` with `.js`
        });
      }
      fs.writeFileSync(fullPath, updatedContent, "utf-8");
    }
  }

  const files = fs.readdirSync(projectAbsolutePath);
  for (const file of files) {
    findAndFixBsportCommonImport(projectAbsolutePath, file);
  }
}

async function removeStorybook({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  const storybookPath = path.resolve(projectAbsolutePath, ".storybook");
  if (fs.existsSync(storybookPath)) {
    print("¤ Drop storybook config folder");
    fs.removeSync(storybookPath);
    print("¤ Dropped .storybook with success");
  }

  print("¤ Remove storybook scripts in package.json");
  const packageJsonPath = path.resolve(projectAbsolutePath, "package.json");
  const packageJson = fs.readJSONSync(packageJsonPath);
  const scripts = ["storybook", "build-storybook", "test-storybook"];
  scripts.forEach((scriptName) => {
    if (packageJson["scripts"][scriptName])
      delete packageJson["scripts"][scriptName];
  });
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  print("¤ Remove storybook build from CI");
  const replaceString = (previousString: string, nextString: string) =>
    _replaceString({ print, projectAbsolutePath, previousString, nextString });
  await replaceString(
    "\\- local: '\\/ci\\/storybook.yml'",
    "# \\- local: '\\/ci_\\/storybook.yml'",
  );
  await replaceString("\\- storybook", "# \\- storybook");
}

async function fixTest({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  await _replaceString({
    print,
    projectAbsolutePath,
    previousString: "'node_modules\\/(?!(@bsport|uuid)\\/)',",
    nextString: "'<rootDir>\\/node_modules\\/(?!(@bsport\\/common|uuid)\\/)',",
  });
}

async function commitChanges({
  print,
  projectAbsolutePath,
}: {
  print: PrintFn;
  projectAbsolutePath: string;
}) {
  // Add cleaning changes
  print(`> git add -A ${projectAbsolutePath}`);
  await exec(`git add -A .`, { cwd: projectAbsolutePath });

  // Add pnpm-lock.yaml changes
  const monorepoBasePath = await getMonorepoBasePath();
  print("> git add pnpm-lock.yaml");
  await exec("git add pnpm-lock.yaml", { cwd: monorepoBasePath });

  // Commit
  print("¤ Set ECOSYSTEM_SKIP_HOOKS to true to skip commitizen");
  const applicationName = projectAbsolutePath.split("/").pop();
  const gitCommitCommand = `export ECOSYSTEM_SKIP_HOOKS=true; git commit -m 'migrate(${applicationName}): Clean project' --no-verify`;
  print(`> ${gitCommitCommand}`);
  await exec(gitCommitCommand, { cwd: projectAbsolutePath });
}

export default function projectClean(program: Command) {
  const repoAcceptedValues = Object.values(REPOSITORIES).join(", ");
  program
    .command("project:clean")
    .description(
      "Clean a bsport project that have been imported in the monorepository.",
    )
    .argument(
      "<project-path>",
      "The path of the project inside the monorepository.",
    )
    .option(
      "-r, --repo <repo>",
      `which specific bsport repository the script is cleaning. Valid inputs : ${repoAcceptedValues}`,
      "",
    )
    .option(
      "-q, --quiet",
      "suppress all output, unless an error occurs.",
      false,
    )
    .action(action);
  return program;
}
