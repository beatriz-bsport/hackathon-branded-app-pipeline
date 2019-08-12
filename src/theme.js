// @flow

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import { colors } from '@bsport/common/lib/colors';

const defaultThemeParams = {
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    error: colors.red,
  },
  typography: {
    useNextVariants: true,
  },
  props: {
    MuiWithWidth: {
      // Initial width property
      initialWidth: 'lg',
    },
  },
};

export const getTheme = (theme) => {
  if (theme) {
    return createMuiTheme({
      ...defaultThemeParams,
      palette: {
        primary: {
          main: theme.primary_color,
        },
        secondary: { main: theme.secondary_color },
      },
    });
  }
  return createMuiTheme(defaultThemeParams);
};

export default getTheme();
