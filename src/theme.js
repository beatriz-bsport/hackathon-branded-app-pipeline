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

export default createMuiTheme(defaultThemeParams);
