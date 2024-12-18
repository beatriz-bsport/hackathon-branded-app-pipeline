// @flow
import React, { Node } from 'react';

import Button from '@material-ui/core/Button';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import memoize from 'memoize-one';

const myTheme = memoize((color) =>
  createTheme({
    palette: {
      primary: {
        main: color,
      },
    },
    typography: {
      useNextVariants: true,
    },
  }),
);

type Props = {
  children: Node,
  color: string,
};

export default function CustomColorButton(props: Props) {
  return (
    <MuiThemeProvider theme={myTheme(props.color)}>
      <Button {...props} color="primary">
        {props.children}
      </Button>
    </MuiThemeProvider>
  );
}
