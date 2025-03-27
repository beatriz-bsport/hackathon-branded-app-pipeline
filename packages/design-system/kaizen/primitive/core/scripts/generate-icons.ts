import fs from "fs/promises";
import path from "path";
import { dirname } from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_FOLDER_PATH = path.resolve(
  __dirname,
  "../src/components/Icon/assets",
);
const ICONS_FILE_PATH = path.resolve(
  __dirname,
  "../src/components/Icon/icons.ts",
);

/**
 * Function allowing the user to update the icons to the library by
 * reading the `src/components/Icon/assets`folder and
 * updating the `src/components/Icon/icons.ts` file
 */
async function generateIcons() {
  const EXISTING_ICONS = await fs.readdir(ASSETS_FOLDER_PATH);

  const newIcons = EXISTING_ICONS.filter((file) => file.endsWith(".svg")).map(
    (file) => {
      const iconName = file.replace(".svg", "");
      const iconKey =
        iconName.includes(" ") || iconName.includes("-")
          ? `"${iconName}"`
          : iconName;
      const iconFilePath = path.resolve(ASSETS_FOLDER_PATH, file);
      const relativeIconFilePath = path.relative(
        path.dirname(ICONS_FILE_PATH),
        iconFilePath,
      );

      return `${iconKey}: React.lazy(async () => await import("./${relativeIconFilePath}?react"))`;
    },
  );

  const newIconsFileContent = `
// DO NOT REMOVE - ICON GENERATOR
import React from 'react';

const icons = {
  ${newIcons.join(",\n")}
} as const;

export default icons;
`;

  const formattedContent = await prettier.format(newIconsFileContent, {
    parser: "typescript",
  });

  await fs.writeFile(ICONS_FILE_PATH, formattedContent);
}

generateIcons().then(() =>
  console.log(
    `✅  File updated: ${path.relative(process.cwd(), ICONS_FILE_PATH)}`,
  ),
);
