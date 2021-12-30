// @flow
import React from 'react';

import Fab from '@material-ui/core/Fab';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { colors } from '@bsport/common/lib/colors';

const greenTheme = createTheme({
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
  children: Node;
};

export default (props: Props) => (
  <MuiThemeProvider theme={greenTheme}>
    <Fab color="primary" {...props}>
      {props.children}
    </Fab>
  </MuiThemeProvider>
);
