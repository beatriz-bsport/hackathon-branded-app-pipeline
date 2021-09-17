// @flow
import chroma from 'chroma-js';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import { colors } from '@bsport/common/lib/colors';

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

export const getTheme = (theme: ?CompanyTheme) => {
  if (theme) {
    return responsiveFontSizes(
      createMuiTheme({
        ...defaultThemeParams,
        palette: {
          primary: {
            main: theme.primary_color,
          },
          secondary: { main: theme.secondary_color },
        },
      }),
    );
  }
  return responsiveFontSizes(createMuiTheme(defaultThemeParams));
};

export const getFranchiseTheme = (theme: FranchiseTheme) => {
  if (theme) {
    return responsiveFontSizes(
      createMuiTheme({
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
  return responsiveFontSizes(createMuiTheme(defaultThemeParams));
};

export default getTheme();
