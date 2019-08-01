// @flow
import React from 'react';
import type { Node } from 'react';

import Button from '@material-ui/core/Button';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

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

export default function RedButton(props: Props) {
  return (
    <MuiThemeProvider theme={redTheme}>
      <Button color="primary" {...props}>
        {props.children}
      </Button>
    </MuiThemeProvider>
  );
}
