// @flow
import React from 'react';
import type { Node } from 'react';

import IconButton from '@material-ui/core/IconButton';
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
    <IconButton color="primary" {...props}>
      {props.children}
    </IconButton>
  </MuiThemeProvider>
);
