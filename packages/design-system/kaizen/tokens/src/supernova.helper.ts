import kebabCase from "lodash/kebabCase";

/**
 * Clean variables from Supernova
 * @param superNovaPrefixes Prefixes added by Designers on supernova that need to be stripped out.
 * @param name Name of the css variable as exported by Supernova.
 * @example
 * ```ts
 * formatVariableName(['color', 'baseColors'])('colorKaizenBaseColorsBsportTurquoiseAlpha600')
 * // bsport-turquoise-alpha-600
 * ```
 */
export const formatVariableName =
  (superNovaPrefixes: string[] = []) =>
  (name: string): string => {
    const defaultStringsToRemove = ["kz", "kaizen"];
    const nameAsKebab = kebabCase(
      superNovaPrefixes
        .concat(...defaultStringsToRemove)
        .map((pattern) => new RegExp(pattern, "ig"))
        .reduce((acc, prefix) => acc.replace(prefix, ""), name),
    );

    // Specific case: 10-xl => 10xl or 2-xs => 2xs
    return nameAsKebab.replace(/([0-9]+)-/, "$1");
  };

/**
 * Clean the value of a color variable and make sure that variable's reference are coherent
 * after variable name cleaning and based
 * @param formatName Function formatting the raw Supernova name into a clean name use in Tailwind.
 * @param options.formatValue Function formatting the value exported by Supernova
 * @param options.formatCSSVariable Function formatting the name cleaned by `formatName` to a clean CSS variable name used by Tailwind
 * @param value Value of the CSS Variable
 * @param
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
    const VAR_REGEX = /var\((\s|\n)*--(.+)(\s|\n)*\)/;
    const formatValue = options?.formatValue ?? ((name: string) => name);
    const formatCSSVariable = options.formatCSSVariable;

    const varMatch = VAR_REGEX.exec(value);
    if (varMatch) {
      // Add a prefix kz- to color CSS Variables
      return `var(--${formatCSSVariable(formatName(varMatch[2]))})`;
    }
    return formatValue(value);
  };
