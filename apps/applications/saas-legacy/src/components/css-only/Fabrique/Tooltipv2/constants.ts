import { HorizontalEnum, VerticalEnum } from '#Fabrique/constants';

export enum colorEnum {
  STRONG = 'strong',
  WEAK = 'weak',
}

export enum placementEnum {
  TOP = 'top',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  LEFT = 'left',
  RIGHT = 'right',
}

export const placementToOrigins = {
  [placementEnum.TOP]: {
    anchorOriginHorizontal: HorizontalEnum.CENTER,
    anchorOriginVertical: VerticalEnum.TOP,
    transformOriginHorizontal: HorizontalEnum.CENTER,
    transformOriginVertical: VerticalEnum.BOTTOM,
  },
  [placementEnum.TOP_LEFT]: {
    anchorOriginHorizontal: HorizontalEnum.LEFT,
    anchorOriginVertical: VerticalEnum.TOP,
    transformOriginHorizontal: HorizontalEnum.RIGHT,
    transformOriginVertical: VerticalEnum.BOTTOM,
  },
  [placementEnum.TOP_RIGHT]: {
    anchorOriginHorizontal: HorizontalEnum.RIGHT,
    anchorOriginVertical: VerticalEnum.TOP,
    transformOriginHorizontal: HorizontalEnum.LEFT,
    transformOriginVertical: VerticalEnum.BOTTOM,
  },
  [placementEnum.BOTTOM]: {
    anchorOriginHorizontal: HorizontalEnum.CENTER,
    anchorOriginVertical: VerticalEnum.BOTTOM,
    transformOriginHorizontal: HorizontalEnum.CENTER,
    transformOriginVertical: VerticalEnum.TOP,
  },
  [placementEnum.BOTTOM_LEFT]: {
    anchorOriginHorizontal: HorizontalEnum.LEFT,
    anchorOriginVertical: VerticalEnum.BOTTOM,
    transformOriginHorizontal: HorizontalEnum.RIGHT,
    transformOriginVertical: VerticalEnum.TOP,
  },
  [placementEnum.BOTTOM_RIGHT]: {
    anchorOriginHorizontal: HorizontalEnum.RIGHT,
    anchorOriginVertical: VerticalEnum.BOTTOM,
    transformOriginHorizontal: HorizontalEnum.LEFT,
    transformOriginVertical: VerticalEnum.TOP,
  },
  [placementEnum.LEFT]: {
    anchorOriginHorizontal: HorizontalEnum.LEFT,
    anchorOriginVertical: VerticalEnum.CENTER,
    transformOriginHorizontal: HorizontalEnum.RIGHT,
    transformOriginVertical: VerticalEnum.CENTER,
  },
  [placementEnum.RIGHT]: {
    anchorOriginHorizontal: HorizontalEnum.RIGHT,
    anchorOriginVertical: VerticalEnum.CENTER,
    transformOriginHorizontal: HorizontalEnum.LEFT,
    transformOriginVertical: VerticalEnum.CENTER,
  },
};
// Margin between the tooltip and the anchor component
export const TOOLTIP_MARGIN = 8;

// Timeout to show the tooltip
export const TOOLTIP_DELAY = 100;
