import kebabCase from "lodash/kebabCase";
import { hexToRGB } from "#src/utils";

/**
 * Clean color variables from Supernova
 * @example
 * ```ts
 * cleanColorVariableName('colorKaizenBaseColorsBsportTurquoiseAlpha600')
 * // bsport-turquoise-alpha-600
 * ```
 */
export const cleanColorVariableName = (variableName: string) =>
  "kz-" +
  kebabCase(
    variableName
      .replace("colorKaizen", "")
      .replace("BaseColors", "")
      .replace("Color", ""),
  );

/**
 * Clean the value of a color variable and make sure that variable's reference are coherent
 * after variable name cleaning and based
 * @example
 * ```
 * cleanColorVariableName(' var(--colorKaizenBaseColorsBsportTurquoiseAlpha600)')
 * // var(--bsport-turquoise-alpha-600)
 *
 * cleanColorVariableName('#000000')
 * // 0 0 0
 * ```
 */
export const cleanColorVariableValue = (variableValue: string): string => {
  const regex = /var\(--(.+)\)/;
  const varMatch = regex.exec(variableValue);
  if (varMatch) {
    return `var(--${cleanColorVariableName(varMatch[1])})`;
  }
  const rgb = hexToRGB(variableValue);
  return `${rgb.r} ${rgb.b} ${rgb.g}`;
};
