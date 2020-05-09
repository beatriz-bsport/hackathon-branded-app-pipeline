// @flow
import React from 'react';
import type { Node } from 'react';

import Fab from '@material-ui/core/Fab';
import {
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

import { colors } from '@bsport/common/lib/colors';

const redTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.orange,
    },
  },
  typography: {
    useNextVariants: true,
  },
});

type Props = {
  children: Node,
};

export default (props: Props) => (
  <MuiThemeProvider theme={redTheme}>
    <Fab color="primary" {...props}>
      {props.children}
    </Fab>
  </MuiThemeProvider>
);
