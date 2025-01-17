import type { Config } from "tailwindcss";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import merge from "lodash/merge";
import without from "lodash/without";
import adapters from "#src/tailwind.adapter";
import prettier from "prettier";

const SOURCE_FOLDER = path.resolve(__dirname, "../export/supernova");

const TAILWIND_THEME_PATH = path.resolve(__dirname, "./tailwind.theme.json");
const CSS_VARIABLES_PATH = path.resolve(__dirname, "./index.css");
// Theme that will be used for Tailwind theme definition
const DEFAULT_THEME = "light";

/**
 * Some default helpers that are in the default Tailwind theme
 * @see https://github.com/tailwindlabs/tailwindcss/blob/main/stubs/config.full.js
 */
const DEFAULT_TAILWIND_CONFIG: Partial<Config['theme']> = {
  borderWidth: { '0': '0' },
  borderRadius: { 'none': '0', 'full': '9999px' },
  colors: {},
  size: { '0': '0px' },
  spacing: { '0': '0px' },
  fontWeight: {},
  fontSize: {},
  lineHeight: {},
  opacity: { '0': '0', '100': '1' },
  boxShadow: { 'none': 'none' },
  transitionDuration: { '0': '0s' },
}

/**
 * Converts a given theme into a shard of CSS and a Tailwind Theme config.
 * @param theme Supernova theme defined by the name of folder inside SOURCE_FOLDER.
 */
const convertThemeToCSS = async (
  theme: string,
): Promise<{ cssContent: string; tailwindConfig: Config["theme"] }> => {
  const themePath = path.resolve(SOURCE_FOLDER, theme);
  const adaptersOutput = await Promise.all(
    adapters.map((adapter) => adapter(themePath)),
  );
  // Create exported values with a prefix kz- on the different theme classes
  const cssContent =
    (theme === DEFAULT_THEME ? ":root" : `.kz-${theme}`) +
    ` {
  ${adaptersOutput.flatMap(({ cssVariables }) => cssVariables).join("\n  ")}
}`;
  const tailwindConfig = adaptersOutput.reduce(
    (acc, { tailwindTheme }) => merge(acc, tailwindTheme),
    { ...DEFAULT_TAILWIND_CONFIG },
  );
  return { cssContent, tailwindConfig };
};

/**
 * Convert Supernova Tokens into Tailwind theme config.
 * @param outputType Type of output expected
 */
const importSupernovaTokens = async () => {
  // Check input
  if (!existsSync(SOURCE_FOLDER)) {
    throw new Error(
      `No folder ${path.relative(process.cwd(), SOURCE_FOLDER)} found. Please make sure you exported your tokens at the right path.`,
    );
  }
  const themes = await fs.readdir(SOURCE_FOLDER);
  if (!themes.length) {
    throw new Error(
      `No folder found inside ${path.relative(process.cwd(), SOURCE_FOLDER)}. Please make sure you exported your tokens at the right path.`,
    );
  }
  console.log(
    `ℹ️  Imported themes from ${path.relative(process.cwd(), SOURCE_FOLDER)}: ${themes.join(", ")}`,
  );

  // Convert
  const convertedThemes = await Promise.all(
    [DEFAULT_THEME, ...without(themes, DEFAULT_THEME)].map((theme) =>
      convertThemeToCSS(theme),
    ),
  );

  if (!existsSync(TAILWIND_THEME_PATH) || !existsSync(CSS_VARIABLES_PATH)) {
    throw new Error(
      `Invalid configuration in kaizen-primitive: ${path.relative(process.cwd(), existsSync(TAILWIND_THEME_PATH) ? TAILWIND_THEME_PATH : CSS_VARIABLES_PATH)} does not exist.`,
    );
  }

  // Format
  const formattedThemes: {
    cssContent: string;
    tailwindConfig: Config["theme"];
  }[] = await Promise.all(
    convertedThemes?.map(async (theme) => {
      const tailwindConfig = await prettier.format(
        JSON.stringify(theme.tailwindConfig),
        { parser: "json" },
      );
      const cssContent = await prettier.format(theme.cssContent, {
        parser: "css",
      });
      return {
        ...theme,
        tailwindConfig: JSON.parse(tailwindConfig) as Config["theme"],
        cssContent,
      };
    }),
  );

  // Write in files for Tailwind
  await fs.writeFile(
    TAILWIND_THEME_PATH,
    // We pick one the theme's as Tailwind theme config as it should be identical for all themes
    JSON.stringify(formattedThemes[0].tailwindConfig, null, 2) + "\n",
  );
  console.log(
    `✅ Tailwind theme config exported in ${path.relative(process.cwd(), TAILWIND_THEME_PATH)}`,
  );
  await fs.writeFile(
    CSS_VARIABLES_PATH,
    `@tailwind base;
@tailwind components;
@tailwind utilities;

${formattedThemes.map(({ cssContent }) => cssContent).join("\n")}`,
  );
  console.log(
    `✅ CSS Variables exported in ${path.relative(process.cwd(), CSS_VARIABLES_PATH)}`,
  );
};

export default importSupernovaTokens;
