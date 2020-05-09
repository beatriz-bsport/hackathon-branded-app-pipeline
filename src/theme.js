// @flow

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

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

export default getTheme();
