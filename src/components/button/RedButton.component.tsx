// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

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

type Props = any;

export default function RedButton(props: Props) {
  return (
    <MuiThemeProvider theme={redTheme}>
      <Button color="primary" {...props}>
        {props.children}
      </Button>
    </MuiThemeProvider>
  );
}
