import kebabCase from "lodash/kebabCase";

/**
 * Clean variables from Supernova
 * @param superNovaPrefixes Prefixes added by Designers on supernova that need to be stripped out.
 * @param removeFirstOccurence If true, only the first occurence of the prefixes will be removed.
 * @example
 * ```ts
 * formatVariableName(['color', 'baseColors'])('colorKaizenBaseColorsBsportTurquoiseAlpha600')
 * // bsport-turquoise-alpha-600
 * ```
 */
export const formatVariableName =
  (superNovaPrefixes: string[] = [], removeFirstOccurence: boolean = false) =>
  (name: string): string => {
    const defaultStringsToRemove = ["kz", "kaizen"];
    const patterns = superNovaPrefixes
      .concat(...defaultStringsToRemove)
      .map((pattern) => new RegExp(pattern, "i"));

    let formattedName = name;
    if (removeFirstOccurence) {
      patterns.forEach((pattern) => {
        formattedName = formattedName.replace(pattern, "");
      });
    } else {
      patterns.forEach((pattern) => {
        formattedName = formattedName.replace(new RegExp(pattern, "ig"), "");
      });
    }

    const nameAsKebab = kebabCase(formattedName);

    // Specific case: 10-xl => 10xl or 2-xs => 2xs
    return nameAsKebab.replace(/([0-9]+)-/, "$1");
  };

/**
 * Clean the value of a color variable and make sure that variable's reference are coherent
 * after variable name cleaning and based
 * @param formatName Function formatting the raw Supernova name into a clean name use in Tailwind.
 * @param options Object containing the formatting functions
 * @param options.formatValue Function formatting the value exported by Supernova
 * @param options.formatCSSVariable Function formatting the name cleaned by `formatName` to a clean CSS variable name used by Tailwind
 */
export const formatVariableValue =
  (
    formatName: (variableName: string) => string,
    options: {
      formatValue?: (value: string) => string;
      formatCSSVariable: (cleanName: string) => string;
    },
  ) =>
  (value: string) => {
    const VAR_REGEX = /var\(\s*--([^)]+)\s*\)/g; // Improved regex for capturing the full variable name
    const formatValue = options?.formatValue ?? ((name: string) => name);
    const formatCSSVariable = options.formatCSSVariable;

    // Replace all occurrences of var(--...) with formatted variable names
    const formattedValue = value.replace(VAR_REGEX, (_match, p1) => {
      const originalVariableName = p1;
      const formattedVariableName = formatCSSVariable(
        formatName(originalVariableName),
      );
      return `var(--${formattedVariableName})`;
    });

    return formatValue(formattedValue);
  };
