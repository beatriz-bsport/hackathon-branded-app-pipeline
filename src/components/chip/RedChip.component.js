// @flow
import React, { Node } from 'react';

import Chip from '@material-ui/core/Chip';
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

type Props = {
  children: Node,
};

export default function RedButton(props: Props) {
  return (
    <MuiThemeProvider theme={redTheme}>
      <Chip color="primary" {...props}>
        {props.children}
      </Chip>
    </MuiThemeProvider>
  );
}
