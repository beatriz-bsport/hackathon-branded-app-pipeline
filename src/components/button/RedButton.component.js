import React from 'react';

import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';

import { colors } from 'bsport-commons/lib/colors';

const redTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.orange,
    },
  },
});

export default function RedButton(props) {
  return (
    <MuiThemeProvider theme={redTheme}>
      <Button color="primary" {...props}>
        {props.children}
      </Button>
    </MuiThemeProvider>
  );
}
