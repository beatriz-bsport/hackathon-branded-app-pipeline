import inquirer from "inquirer";
import kebabCase from "lodash/kebabCase";
import path from "path";
import fs from "fs/promises";

const ASSETS_FOLDER_PATH = path.resolve(__dirname, "../src/Icon/assets");
const ICONS_FILE_PATH = path.resolve(__dirname, "../src/Icon/icons.ts");

/**
 * Function allowing the user to add SVG icons as options to the Icon component located in `src/components/Icon`
 * Currently the icons are stored in `src/components/Icon/assets` and loaded in `src/components/Icon/icons.ts`
 */
async function addIconToLibrary() {
  let shouldRunAgain = true;

  const EXISTING_ICONS = await fs
    .readdir(ASSETS_FOLDER_PATH)
    .then((files) => files.map((file) => file.replace(".svg", "")));

  while (shouldRunAgain) {
    const { iconName, iconContent }: { iconName: string; iconContent: string } =
      await inquirer.prompt([
        {
          name: "iconName",
          type: "input",
          message:
            "Icon name (must be kebabCased, do not include the extension): ",
          validate: (value: string) => {
            if (!value) {
              return "The icon name is required.";
            }
            if (EXISTING_ICONS.includes(value)) {
              return `Icon "${value}" does already exist.`;
            }
            if (kebabCase(value) !== value) {
              return "The icon name must be kebab-case.";
            }
            return true;
          },
        },
        {
          name: "iconContent",
          type: "editor",
          message:
            "SVG content of the icon (copy-paste the content of the SVG icon): ",
          validate: (value: string) => {
            return !value ? "Please provide a non-empty SVG." : true;
          },
        },
      ]);

    // TODO - Clean SVG content

    // Write icon in assets folder.
    const iconFilePath = path.resolve(ASSETS_FOLDER_PATH, `${iconName}.svg`);
    await fs.writeFile(iconFilePath, iconContent);
    console.log(
      `✅  SVG created at path: ${path.relative(process.cwd(), iconFilePath)}`,
    );

    // Add the icon to the icons.ts file.
    const iconsFileContent = (await fs.readFile(ICONS_FILE_PATH)).toString(
      "utf-8",
    );
    const iconKey = iconName.includes("-") ? `"${iconName}"` : iconName;
    await fs.writeFile(
      ICONS_FILE_PATH,
      iconsFileContent.replace(
        "// DO NOT REMOVE - ICON GENERATOR",
        `${iconKey}: React.lazy(async () => await import("./${path.relative(path.dirname(ICONS_FILE_PATH), iconFilePath)}?react")),
  // DO NOT REMOVE - ICON GENERATOR`,
      ),
    );
    console.log(
      `✅  File update: ${path.relative(process.cwd(), ICONS_FILE_PATH)}`,
    );

    // Ask if the user would like to add an other icon
    const { shouldPromptAgain } = await inquirer.prompt([
      {
        name: "shouldPromptAgain",
        type: "confirm",
        message: "Do you want to add another icon ? ",
        default: false,
      },
    ]);
    shouldRunAgain = shouldPromptAgain;
  }
  console.log(`👋  Bye.`);
}

addIconToLibrary();
