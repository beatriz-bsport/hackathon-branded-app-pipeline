import type { Config } from "tailwindcss";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import kebabCase from "lodash/kebabCase";
import { extractCSSVariables } from "#src/utils";
import {
  cleanColorVariableName,
  cleanColorVariableValue,
} from "#src/supernova.helper";

/*
 Current files imported into a Tailwind theme
  - [x] border-widths.css
  - [x] colors.css
  - [ ] dimensions.css
  - [ ] font-families.css
  - [x] font-sizes.css
  - [x] font-weights.css
  - [x] line-heights.css
  - [x] opacities.css
  - [ ] paragraph-spacings.css
  - [x] radii.css
  - [x] shadows.css
  - [ ] sizes.css
  - [ ] strings.css
  - [ ] typography.css
 */

const SOURCE_FOLDER = path.resolve(__dirname, "../export/supernova");

// TODO to be replaced with a monorepo utils function giving programatically the path to the ui-components project
const TARGET_FOLDER = path.resolve(__dirname, "../../ui-components");

/**
 * Import exported border width tokens from Supernova.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importBorderWidthsToJSON = async (
  theme: string,
): Promise<{
  [widths: string]: "string";
}> => {
  const filePath = path.resolve(
    SOURCE_FOLDER,
    theme,
    "styles/border-widths.css",
  );
  if (!existsSync(filePath)) {
    console.warn(`❌  No border-widths.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(filePath)).toString("utf-8"),
  );
  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [kebabCase(variable.replace("borderWidthKaizen", ""))]:
        cssContent[variable],
    }),
    {},
  );
};

/**
 * Import exported border width tokens from Supernova.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importRadiiToJSON = async (
  theme: string,
): Promise<{
  [widths: string]: "string";
}> => {
  const filePath = path.resolve(SOURCE_FOLDER, theme, "styles/radii.css");
  if (!existsSync(filePath)) {
    console.warn(`❌  No radii.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(filePath)).toString("utf-8"),
  );
  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [kebabCase(variable.replace("borderRadiusKaizenBorderRadius", ""))]:
        cssContent[variable],
    }),
    {},
  );
};

/**
 * Convert exported colors from Supernova into a dictionary of colors and their associated Tailwind CSS value.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importCSSColorsToJSON = async (
  theme: string,
): Promise<{
  [colorName: string]: string;
}> => {
  const colorsFilePath = path.resolve(
    SOURCE_FOLDER,
    theme,
    "styles/colors.css",
  );
  if (!existsSync(colorsFilePath)) {
    console.warn(`❌  No colors.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(colorsFilePath)).toString("utf-8"),
  );

  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [cleanColorVariableName(variable)]: cleanColorVariableValue(
        cssContent[variable],
      ),
    }),
    {},
  );
};

/**
 * Import exported font weights tokens from Supernova.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importFontWeigthsToJSON = async (
  theme: string,
): Promise<{
  [widths: string]: "string";
}> => {
  const filePath = path.resolve(
    SOURCE_FOLDER,
    theme,
    "styles/font-weights.css",
  );
  if (!existsSync(filePath)) {
    console.warn(`❌  No font-weights.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(filePath)).toString("utf-8"),
  );
  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [kebabCase(variable.replace("fontWeight", ""))]: cssContent[variable],
    }),
    {},
  );
};

/**
 * Import exported font size tokens from Supernova.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importFontSizesToJSON = async (
  theme: string,
): Promise<{
  [widths: string]: "string";
}> => {
  const filePath = path.resolve(SOURCE_FOLDER, theme, "styles/font-sizes.css");
  if (!existsSync(filePath)) {
    console.warn(`❌  No font-sizes.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(filePath)).toString("utf-8"),
  );
  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [kebabCase(variable.replace("fontSizeKaizen", ""))]: cssContent[variable],
    }),
    {},
  );
};

/**
 * Import exported line height tokens from Supernova.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importLineHeightsToJSON = async (
  theme: string,
): Promise<{
  [widths: string]: "string";
}> => {
  const filePath = path.resolve(
    SOURCE_FOLDER,
    theme,
    "styles/line-heights.css",
  );
  if (!existsSync(filePath)) {
    console.warn(`❌  No line-heights.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(filePath)).toString("utf-8"),
  );
  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [kebabCase(variable.replace("lineHeight", ""))]: cssContent[variable],
    }),
    {},
  );
};

/**
 * Import exported opacity tokens from Supernova.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importOpacitiesToJSON = async (
  theme: string,
): Promise<{
  [widths: string]: "string";
}> => {
  const filePath = path.resolve(SOURCE_FOLDER, theme, "styles/opacities.css");
  if (!existsSync(filePath)) {
    console.warn(`❌  No opacities.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(filePath)).toString("utf-8"),
  );
  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [kebabCase(variable.replace("opacity", ""))]: cssContent[variable],
    }),
    {},
  );
};

/**
 * Import exported shadow tokens from Supernova.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const importShadowsToJSON = async (
  theme: string,
): Promise<{
  [widths: string]: "string";
}> => {
  const filePath = path.resolve(SOURCE_FOLDER, theme, "styles/shadows.css");
  if (!existsSync(filePath)) {
    console.warn(`❌  No shadows.css found for theme ${theme}`);
  }
  const cssContent = extractCSSVariables(
    (await fs.readFile(filePath)).toString("utf-8"),
  );
  return Object.keys(cssContent).reduce(
    (acc, variable) => ({
      ...acc,
      [kebabCase(variable.replace("shadowKaizenElevation", ""))]:
        cssContent[variable],
    }),
    {},
  );
};

/**
 * Converts a given theme into a shard of CSS and a Tailwind Theme config.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const convertThemeToCSS = async (
  theme: string,
): Promise<[string, undefined | Config["theme"]]> => {
  const cssLines: string[] = [];

  // BORDER WIDTHS
  const borderWidth = await importBorderWidthsToJSON(theme);
  console.log(`ℹ️  Border widths imported for theme ${theme}.`);

  // BORDER RADII
  const borderRadius = await importRadiiToJSON(theme);
  console.log(`ℹ️  Border radii imported for theme ${theme}.`);

  // COLORS
  const cssVariables = await importCSSColorsToJSON(theme);
  const tailwindOtherColors: Record<string, string> = {};
  const tailwindBaseColors: {
    [color: string]: { [grade: string]: string };
  } = {};
  Object.entries(cssVariables).forEach(([name, value]) => {
    cssLines.push(`--${name}: ${value};`);

    const tailwindValue = `rgb(var(--${name}) / <alpha-value>)`;

    const baseColorRegex = /(.+)-([0-9]+)/;
    const baseColorMatch = baseColorRegex.exec(name);

    if (!baseColorMatch) {
      tailwindOtherColors[name] = tailwindValue;
    } else {
      // Make base colors (variables finishing with -{number} in their name) as a nested object
      tailwindBaseColors[baseColorMatch[1]] = {
        ...(tailwindBaseColors[baseColorMatch[1]] || {}),
        [baseColorMatch[2]]: tailwindValue,
      };
    }
  });
  const colors = {
    ...tailwindBaseColors,
    ...tailwindOtherColors,
  };
  console.log(`ℹ️  Colors imported for theme ${theme}.`);

  // FONT SIZES
  const fontSize = await importFontSizesToJSON(theme);
  console.log(`ℹ️  Font size imported for theme ${theme}.`);

  // FONT WEIGHTS
  const fontWeight = await importFontWeigthsToJSON(theme);
  console.log(`ℹ️  Font weight imported for theme ${theme}.`);

  // OPACITIES
  const lineHeight = await importLineHeightsToJSON(theme);
  console.log(`ℹ️  Line heights imported for theme ${theme}.`);

  // OPACITIES
  const opacity = await importOpacitiesToJSON(theme);
  console.log(`ℹ️  Shadows imported for theme ${theme}.`);

  // SHADOW
  const boxShadow = await importShadowsToJSON(theme);
  console.log(`ℹ️  Shadows imported for theme ${theme}.`);

  // Create exported values
  const cssContent = `
  .${theme} {
    ${cssLines.join("\n    ")}
  }`;
  const tailwindConfig: Config["theme"] = {
    borderWidth,
    borderRadius,
    boxShadow,
    colors,
    fontSize,
    fontWeight,
    lineHeight,
    opacity,
  };

  return [cssContent, tailwindConfig];
};

/**
 * Convert Supernova CSS Variables into tokens
 * @param outputType Type of output expected
 */
const convertToTokens = async () => {
  if (!existsSync(SOURCE_FOLDER)) {
    throw new Error(
      `No folder found ${path.relative(process.cwd(), SOURCE_FOLDER)}. Please make sure you exported your variables at the right path.`,
    );
  }

  const themes = await fs.readdir(SOURCE_FOLDER);
  if (!themes.length) {
    throw new Error(
      `No folder found inside ${path.relative(process.cwd(), SOURCE_FOLDER)}. Please make sure you exported your variables at the right path.`,
    );
  }
  console.log(
    `ℹ️  Imported themes from ${path.relative(process.cwd(), SOURCE_FOLDER)}: ${themes.join(", ")}`,
  );

  const convertedTheme = await Promise.all(
    themes.map((theme) => convertThemeToCSS(theme)),
  );

  // We pick one the theme's as Tailwind theme config
  const tailwindConfig = {
    theme: convertedTheme[0][1],
  };
  const cssFileContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
${convertedTheme.map(([cssTheme]) => cssTheme).join("\n\n")}
}
`;

  // Write in the target folder in ui-components
  const tailwindPath = path.resolve(TARGET_FOLDER, "tailwind.theme.json");
  await fs.writeFile(tailwindPath, JSON.stringify(tailwindConfig, null, 2));
  console.log(
    `✅ Tailwind theme config exported in ${path.relative(process.cwd(), tailwindPath)}`,
  );
  const cssVariablesPath = path.resolve(TARGET_FOLDER, "src/index.css");
  await fs.writeFile(cssVariablesPath, cssFileContent);
  console.log(
    `✅ CSS Variables exported in ${path.relative(process.cwd(), cssVariablesPath)}`,
  );
};

export default convertToTokens;
