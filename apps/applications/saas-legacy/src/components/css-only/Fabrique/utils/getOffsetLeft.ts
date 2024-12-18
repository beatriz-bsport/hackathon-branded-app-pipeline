import { Horizontal } from '../Types';

/**
 * Calculates the horizontal offset based on the provided parameters
 *
 * @export
 * @param {DOMRect} rect The DOMRect object representing the element's size and position.
 * @param {Horizontal} horizontal Horizontal position indicator or numerical offset.
 * @return {number} The calculated horizontal offset.
 */
export function getOffsetLeft(rect: DOMRect, horizontal: Horizontal) {
  let offset = 0;

  if (typeof horizontal === 'number') {
    offset = horizontal;
  } else if (horizontal === 'center') {
    offset = rect.width / 2;
  } else if (horizontal === 'right') {
    offset = rect.width;
  }

  return offset;
}
