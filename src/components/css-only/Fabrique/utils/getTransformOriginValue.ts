import { Origins } from '../Types';

/**
 * Generates the transform origin values.
 * @param {Origins} transformOrigin - The object containing horizontal and vertical transform origin values.
 * @returns {string} The transform origin value formatted as 'horizontal vertical', e.g. 10px 10px.
 */
export function getTransformOriginValue(transformOrigin: Origins) {
  return [transformOrigin.horizontal, transformOrigin.vertical]
    .map((value) => (typeof value === 'number' ? `${value}px` : value))
    .join(' ');
}
