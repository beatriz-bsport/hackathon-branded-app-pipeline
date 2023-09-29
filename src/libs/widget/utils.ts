import moment from 'moment-timezone';
import chroma from 'chroma-js';

import memoize from 'memoize-one';
import { getTextColorFromRGB } from '../../utils/color';
import { WidgetCustomCSS } from '#libs/theme/types';

export const getIntercomLink = () =>
  `https://intercom.help/bsport-helpcenter/${moment
    .locale()
    .slice(0, 2)}/articles/4942264`;

export const getCustomWidgetStyle = memoize((styles: WidgetCustomCSS) => {
  const {
    fontFamily,
    spacing,
    border,
    backgroundPaper,
    secondaryBackgroundPaper,
    background,
    primaryColor,
    secondaryColor,
    greyDark,
    grey,
    borderColor,
  } = styles;

  let classes = '';
  let id = '';

  if (spacing !== undefined && !Number.isNaN(spacing)) {
    classes += `--spacing-1: ${spacing}px; \n`;
    id += `
      --spacing-2: calc(${spacing}px * 2);
      --spacing-3: calc(${spacing}px * 3);
      --spacing-4: calc(${spacing}px * 4);
      --spacing-5: calc(${spacing}px * 5);
      --spacing-6: calc(${spacing}px * 6);
      --spacing-7: calc(${spacing}px * 7);
      --spacing-8: calc(${spacing}px * 8);
      --spacing-9: calc(${spacing}px * 9);
      --spacing-10: calc(${spacing}px * 10);
      --spacing-11: calc(${spacing}px * 11);
      --spacing-12: calc(${spacing}px * 12);
      --spacing-13: calc(${spacing}px * 13);
      --spacing-14: calc(${spacing}px * 14);
      --spacing-15: calc(${spacing}px * 15);
      --spacing-16: calc(${spacing}px * 16);
    `;
  }
  if (border !== undefined && !Number.isNaN(border)) {
    classes += `--border-radius-1: ${border}px; \n`;
    id += `
      --border-radius-2: calc(${border}px * 2); \n
      --border-radius-3: calc(${border}px * 3); \n
      --border-radius-4: calc(${border}px * 4); \n
      --border-radius-5: calc(${border}px * 5); \n
      --border-radius-6: calc(${border}px * 6); \n
      --border-radius-7: calc(${border}px * 7); \n
      --border-radius-8: calc(${border}px * 8); \n
      --border-radius-9: calc(${border}px * 9); \n
      --border-radius-10: calc(${border}px * 10); \n
    `;
  }
  if (backgroundPaper) {
    classes += `--color-background-paper: ${backgroundPaper}; \n`;
  }
  if (secondaryBackgroundPaper) {
    classes += `--color-secondary-background-paper: ${secondaryBackgroundPaper}; \n`;
    classes += `--color-secondary-background-paper-transparent: ${chroma(
      secondaryBackgroundPaper,
    ).alpha(0.1)}; \n`;
  }
  if (background) {
    classes += `--color-background: ${background}; \n`;
  }
  if (greyDark) {
    classes += `--color-grey-dark: ${greyDark}; \n`;
  }
  if (grey) {
    classes += `--color-grey-main: ${grey}; \n`;
  }
  if (borderColor) {
    classes += `--border-color: ${borderColor}; \n`;
  }
  if (primaryColor) {
    classes += `--color-primary-main: ${primaryColor}; \n`;
    classes += `--color-primary-contrastText: ${getTextColorFromRGB(
      chroma(primaryColor).rgb(),
    )}; \n`;
    classes += `--color-primary-dark: ${chroma(primaryColor)
      .darken()
      .hex()}; \n`;
    classes += `--color-primary-light: ${chroma(primaryColor)
      .brighten()
      .hex()}; \n`;
  }

  if (secondaryColor) {
    classes += `--color-secondary-main: ${secondaryColor}; \n`;
    classes += `--color-secondary-contrastText: ${getTextColorFromRGB(
      chroma(secondaryColor).rgb(),
    )}; \n`;
    classes += `--color-secondary-dark: ${chroma(secondaryColor)
      .darken()
      .hex()}; \n`;
    classes += `--color-secondary-light: ${chroma(secondaryColor)
      .brighten()
      .hex()}; \n`;
  }

  if (fontFamily) {
    classes += `--fontFamily: ${fontFamily}; \n`;
    id += `
    --body1-fontFamily: ${fontFamily}; \n
    --body2-fontFamily: ${fontFamily}; \n
    --button-fontFamily: ${fontFamily}; \n
    --caption-fontFamily: ${fontFamily}; \n
    --h1-fontFamily: ${fontFamily}; \n
    --h2-fontFamily: ${fontFamily}; \n
    --h3-fontFamily: ${fontFamily}; \n
    --h4-fontFamily: ${fontFamily}; \n
    --h5-fontFamily: ${fontFamily}; \n
    --h6-fontFamily: ${fontFamily}; \n
    `;
  }

  return {
    classes,
    id,
  };
});

export const cleanCSSFile = (css: string) => {
  const propertyRegex = /{[^}]*}/gm;

  return css.replace(propertyRegex, '{\n    \n}');
};

export const interpolateCSSVar = (css: string, isDomLoaded: boolean) => {
  /*
  This methods interpolate the variable in the theme, thus using
  this and saving a css configuration we lose the synchronization if 
  any variable is updated after.
  */
  if (!isDomLoaded) return css;

  const newRegex = /var\((--[^)]*)\)/gm;
  const wrapper = document.getElementById('bs-setup-derived-variable');

  if (!wrapper) return css;
  const computedStyle = getComputedStyle(wrapper);

  return css.replace(newRegex, (correpondance, key) => {
    const style = computedStyle?.getPropertyValue(key);
    if (style === '') return correpondance;

    return style;
  });
};
