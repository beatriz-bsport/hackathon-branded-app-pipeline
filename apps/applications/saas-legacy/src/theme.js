// @flow
import chroma from 'chroma-js';
import { responsiveFontSizes, createTheme } from '@material-ui/core/styles';
import { captureException } from '@sentry/react';

import { colors } from '@bsport/common/lib/colors.js';

import { FranchiseTheme } from './libs/franchise/types';

const defaultThemeParams = {
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    error: colors.error,
  },
  props: {
    MuiWithWidth: {
      // Initial width property
      initialWidth: 'lg',
    },
  },
};

const hardcodedDefaultThemeParams = {
  palette: {
    primary: {
      main: 'rgb(20, 158, 122)', // @bsport/common colors
    },
    secondary: {
      main: 'rgb(36, 54, 92)', // @bsport/common colors
    },
  },
  props: {
    MuiWithWidth: {
      // Initial width property
      initialWidth: 'lg',
    },
  },
};

const formatThemeHint = (theme) => {
  try {
    return `primary main : ${theme?.palette?.primary?.main}; secondary main : ${theme?.palette?.secondary?.main}`;
  } catch (err) {
    return 'unknwon errror';
  }
};

export const getTheme = (theme?: CompanyTheme) => {
  if (theme) {
    const providedTheme = {
      ...defaultThemeParams,
      palette: {
        primary: {
          main: theme.primary_color,
        },
        secondary: { main: theme.secondary_color },
      },
    };
    // This warning will show up on sentry if an error is raised after
    let themeJSON = '';
    let providedThemeJson = '';
    try {
      themeJSON = JSON.stringify(theme);
      providedThemeJson = JSON.stringify(providedTheme);
    } catch (_err) {
      themeJSON = '';
    }
    console.warn(
      'Create theme with provided theme :',
      `\n->theme : primary is ${theme.primary_color}, secondary is ${theme.secondary_color}`,
      `\n->provided theme : ${formatThemeHint(providedTheme)}`,
      `\n->full theme : ${themeJSON}`,
      `\n->full provided theme: ${providedThemeJson}`,
    );
    try {
      return responsiveFontSizes(createTheme(providedTheme));
    } catch (errorWithProvidedTheme) {
      captureException(
        new Error(
          `${errorWithProvidedTheme?.message || ''} - ${formatThemeHint(
            providedTheme,
          )}`,
        ),
      );
      try {
        return responsiveFontSizes(createTheme(defaultThemeParams));
      } catch (errorWithDefaultTheme) {
        captureException(
          new Error(
            `${errorWithDefaultTheme?.message || ''} - ${formatThemeHint(
              defaultThemeParams,
            )}`,
          ),
        );
        return responsiveFontSizes(createTheme(hardcodedDefaultThemeParams));
      }
    }
  }
  console.warn(
    'Create theme with default theme :',
    formatThemeHint(defaultThemeParams),
  );
  try {
    return responsiveFontSizes(createTheme(defaultThemeParams));
  } catch (errorWithDefaultTheme2) {
    captureException(
      new Error(
        `${errorWithDefaultTheme2?.message || ''} - ${formatThemeHint(
          defaultThemeParams,
        )}`,
      ),
    );
    return responsiveFontSizes(createTheme(hardcodedDefaultThemeParams));
  }
};

export const getFranchiseTheme = (theme: FranchiseTheme) => {
  if (theme) {
    return responsiveFontSizes(
      createTheme({
        ...defaultThemeParams,
        palette: {
          primary: {
            main: chroma(
              theme.primaryRGB[0],
              theme.primaryRGB[1],
              theme.primaryRGB[2],
            ).hex(),
          },
          secondary: {
            main: chroma(
              theme.secondaryRGB[0],
              theme.secondaryRGB[1],
              theme.secondaryRGB[2],
            ).hex(),
          },
        },
      }),
    );
  }
  return responsiveFontSizes(createTheme(defaultThemeParams));
};

export default getTheme();
