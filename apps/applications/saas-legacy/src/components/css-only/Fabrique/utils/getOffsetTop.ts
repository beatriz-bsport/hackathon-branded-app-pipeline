import { Vertical } from '../Types';

/**
 * Calculates the vertical offset based on the provided parameters
 *
 * @export
 * @param {DOMRect} rect The DOMRect object representing the element's size and position.
 * @param {Vertical} vertical Vertical position indicator or numerical offset.
 * @return {number} The calculated vertical offset.
 */
export function getOffsetTop(rect: DOMRect, vertical: Vertical) {
  let offset = 0;

  if (typeof vertical === 'number') {
    offset = vertical;
  } else if (vertical === 'center') {
    offset = rect.height / 2;
  } else if (vertical === 'bottom') {
    offset = rect.height;
  }

  return offset;
}
