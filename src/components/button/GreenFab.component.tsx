// @flow
import React from 'react';

import Fab from '@material-ui/core/Fab';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { colors } from '@bsport/common/lib/colors';

const greenTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.greenGradientRight,
    },
  },
  typography: {
    useNextVariants: true,
  },
});

type Props = {
  children: React.ReactChildren;
};

export default (props: Props) => (
  <MuiThemeProvider theme={greenTheme}>
    <Fab color="primary" {...props}>
      {props.children}
    </Fab>
  </MuiThemeProvider>
);
