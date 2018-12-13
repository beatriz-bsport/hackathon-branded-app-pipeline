// @flow

import { createMuiTheme } from '@material-ui/core/styles';

import { colors } from 'bsport-commons/lib/colors';

export default createMuiTheme({
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
});
