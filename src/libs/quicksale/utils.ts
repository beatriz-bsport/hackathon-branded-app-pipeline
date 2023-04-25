import chroma from 'chroma-js';
import { QuicksaleItemColor, QuicksaleSectionColor } from './constants';

export const getBorderColorFromBackgroundColor = (
  backgroundColor: QuicksaleItemColor,
) => {
  // This function retrieves the border color of an item card of the quicksale
  // configuration based on the background color of the card.
  const colorKey = Object.keys(QuicksaleItemColor).find(
    (key: keyof typeof QuicksaleItemColor) =>
      QuicksaleItemColor[key] === backgroundColor,
  );
  if (colorKey)
    return QuicksaleSectionColor[
      colorKey as keyof typeof QuicksaleSectionColor
    ];
  return QuicksaleSectionColor.Black;
};

const DEFAULT_BRIGHTNESS_THRESHOLD = 0.25;

export function determinePropertyFromBrightness<T>(
  color: string,
  highBrightnessProperty: T,
  lowBrightnessProperty: T,
  threshold: number = DEFAULT_BRIGHTNESS_THRESHOLD,
): T {
  // If the color's brightness is above the threshold, returns the high brightness property
  // Otherwise, returns the low brightness property
  return chroma(color).luminance() > threshold
    ? highBrightnessProperty
    : lowBrightnessProperty;
}
