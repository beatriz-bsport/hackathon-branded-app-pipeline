// @flow
import React from 'react';
import type { Node } from 'react';

import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';

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
