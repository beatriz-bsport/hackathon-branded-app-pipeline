import type { Config } from "tailwindcss";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { extractCSSVariables, hexToRGBA } from "#src/utils";
import { formatVariableName, formatVariableValue } from "#src/supernova.helper";

/**
 * This file contains all the adapters consuming a Supernova export file and transforming it into a Tailwind theme.
 * The output of these functions are:
 *  - a shard of CSS variables,
 *  - a partial Tailwind theme.
 *
 * Exclude from export all variables from the Figma collection (the variable names will include the string "Figma").
 * By convention, this variables are internally used by designers on Figma and should not be exported.
 */

/*
 Current files imported into a Tailwind theme
 - [ ] font-families.css (Not useful as agreed with Design)
 - [ ] paragraph-spacings.css
 - [ ] sizes.css (Not useful as agreed with Design)
 - [ ] strings.css (Not useful as agreed with Design)
 - [ ] typography.css (Not useful as agreed with Design)
 */

export type Output = {
  cssVariables: string[];
  tailwindTheme: Partial<Config["theme"]>;
};

/**
 * Import file in Supernova exports and extract CSS Variable as a dictionnary.
 * @param folderPath Absolute path of the Supernova export folder.
 * @param fileRelativePath Relative path where to find the file to export.
 */
async function importFileContent(folderPath: string, fileRelativePath: string) {
  const filePath = path.resolve(folderPath, fileRelativePath);
  if (!existsSync(filePath)) {
    console.warn(
      `❌  No file ${fileRelativePath} found in folder ${folderPath}`,
    );
  }
  return extractCSSVariables((await fs.readFile(filePath)).toString("utf-8"));
}

/**
 * Import exported border width tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importBorderWidths = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(
    folderPath,
    "styles/border-widths.css",
  );
  const formatCSSVariable = (name: string) => `kz-border-radius-${name}`;
  const formatName = formatVariableName(["borderWidth"]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
  });
  return Object.entries(cssContent).reduce(
    (acc: Output, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          ...acc.tailwindTheme,
          borderWidth: {
            ...acc.tailwindTheme?.borderWidth,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    { cssVariables: [], tailwindTheme: { borderWidth: {} } } as Output,
  );
};

/**
 * Convert exported colors from Supernova into a dictionary of colors and their associated Tailwind CSS value.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importColors = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(folderPath, "styles/colors.css");

  const formatCSSVariable = (name: string) => `kz-color-${name}`;
  const formatName = formatVariableName(["BaseColors", "color"]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
    formatValue: (color) => {
      const rgba = hexToRGBA(color);
      return rgba ? `${rgba.red} ${rgba.green} ${rgba.blue}` : "";
    },
  });

  const tailwindOtherColors: Record<string, string> = {};
  const tailwindBaseColors: {
    [color: string]: { [grade: string]: string };
  } = {};
  const cssVariables: string[] = [];

  Object.entries(cssContent).forEach(([cssName, cssValue]) => {
    if (cssName.includes("Figma")) return;

    const name = formatName(cssName);
    const value = formatValue(cssValue);

    if (!value) return;

    cssVariables.push(`--${formatCSSVariable(name)}: ${value};`);

    const baseColorRegex = /(.+)-([0-9]+)/;
    const baseColorMatch = baseColorRegex.exec(name);

    const tailwindValue = `rgb(var(--${formatCSSVariable(name)}) / <alpha-value>)`;

    if (!baseColorMatch) {
      tailwindOtherColors[name] = tailwindValue;
    } else {
      /*
        Make base colors (variables finishing with -{number} in their name) as a nested object as below:
        ```json
        {
          "teal": {
            "50": "#fofofo"
          }
        }
        ```
      */
      tailwindBaseColors[baseColorMatch[1]] = {
        ...(tailwindBaseColors[baseColorMatch[1]] || {}),
        [baseColorMatch[2]]: tailwindValue,
      };
    }
  });

  return {
    cssVariables,
    tailwindTheme: {
      colors: {
        ...tailwindBaseColors,
        ...tailwindOtherColors,
      },
    },
  };
};

/**
 * Import exported dimension tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importDimension = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(
    folderPath,
    "styles/dimensions.css",
  );
  const formatCSSVariable = (name: string) => `kz-dimension-${name}`;
  const formatName = formatVariableName([
    "dimension",
    "baseUnits",
    "spacing",
    "sizing",
  ]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
  });
  return Object.entries(cssContent).reduce(
    (acc, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          ...acc.tailwindTheme,
          spacing: {
            ...acc.tailwindTheme?.spacing,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
          size: {
            ...acc.tailwindTheme?.size,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    {
      cssVariables: [],
      tailwindTheme: { size: {}, spacing: {} },
    } as Output,
  );
};

/**
 * Import exported font weights tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importFontWeigths = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(
    folderPath,
    "styles/font-weights.css",
  );
  const formatCSSVariable = (name: string) => `kz-font-weight-${name}`;
  const formatName = formatVariableName(["fontWeight"]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
    // Known bug on Supernova: font-weights are exported with a "..." surronding them.
    formatValue: (str) => str.replace(/"/g, ""),
  });
  return Object.entries(cssContent).reduce(
    (acc, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          fontWeight: {
            ...acc.tailwindTheme?.fontWeight,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    {
      cssVariables: [],
      tailwindTheme: { fontWeight: {} },
    } as Output,
  );
};

/**
 * Import exported font size tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importFontSizes = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(
    folderPath,
    "styles/font-sizes.css",
  );
  const formatCSSVariable = (name: string) => `kz-font-size-${name}`;
  const formatName = formatVariableName(["fontSize"]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
  });
  return Object.entries(cssContent).reduce(
    (acc: Output, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          ...acc.tailwindTheme,
          fontSize: {
            ...acc.tailwindTheme?.fontSize,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    { cssVariables: [], tailwindTheme: { fontSize: {} } } as Output,
  );
};

/**
 * Import exported line height tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importLineHeights = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(
    folderPath,
    "styles/line-heights.css",
  );
  const formatCSSVariable = (name: string) => `kz-line-height-${name}`;
  const formatName = formatVariableName(["lineHeight"]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
  });
  return Object.entries(cssContent).reduce(
    (acc: Output, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          ...acc.tailwindTheme,
          lineHeight: {
            ...acc.tailwindTheme?.lineHeight,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    { cssVariables: [], tailwindTheme: { lineHeight: {} } } as Output,
  );
};

/**
 * Import exported opacity tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importOpacities = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(
    folderPath,
    "styles/opacities.css",
  );
  const formatCSSVariable = (name: string) => `kz-opacity-${name}`;
  const formatName = formatVariableName(["opacity"]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
  });
  return Object.entries(cssContent).reduce(
    (acc: Output, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          ...acc.tailwindTheme,
          opacity: {
            ...acc.tailwindTheme?.opacity,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    { cssVariables: [], tailwindTheme: { opacity: {} } } as Output,
  );
};

/**
 * Import exported border radii tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importRadii = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(folderPath, "styles/radii.css");
  const formatCSSVariable = (name: string) => `kz-border-radius-${name}`;
  const formatName = formatVariableName(["BorderRadius"]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
  });
  return Object.entries(cssContent).reduce(
    (acc: Output, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          ...acc.tailwindTheme,
          borderRadius: {
            ...acc.tailwindTheme?.borderRadius,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    { cssVariables: [], tailwindTheme: { borderRadius: {} } } as Output,
  );
};

/**
 * Import exported shadow tokens from Supernova.
 * @param folderPath Path of the folder containing the Supernova export.
 */
const importShadows = async (folderPath: string): Promise<Output> => {
  const cssContent = await importFileContent(folderPath, "styles/shadows.css");

  const formatCSSVariable = (name: string) => `kz-shadow-${name}`;
  const formatName = formatVariableName([
    "shadowKaizen",
    "elevation",
    "shadow",
  ]);
  const formatValue = formatVariableValue(formatName, {
    formatCSSVariable,
  });
  return Object.entries(cssContent).reduce(
    (acc: Output, [cssName, cssValue]) => {
      if (cssName.includes("Figma")) return acc;

      const name = formatName(cssName);
      const value = formatValue(cssValue);
      return {
        cssVariables: [
          ...acc.cssVariables,
          `--${formatCSSVariable(name)}: ${value};`,
        ],
        tailwindTheme: {
          ...acc.tailwindTheme,
          boxShadow: {
            ...acc.tailwindTheme?.boxShadow,
            [name]: `var(--${formatCSSVariable(name)})`,
          },
        },
      };
    },
    { cssVariables: [], tailwindTheme: { boxShadow: {} } } as Output,
  );
};

const adapters: ((folderPath: string) => Promise<Output>)[] = [
  importBorderWidths,
  importRadii,
  importColors,
  importDimension,
  importFontWeigths,
  importFontSizes,
  importLineHeights,
  importOpacities,
  importShadows,
];

export default adapters;
