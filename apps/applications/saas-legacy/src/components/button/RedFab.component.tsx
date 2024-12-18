import React, { ReactNode } from 'react';

import Fab from '@material-ui/core/Fab';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { colors } from '@bsport/common/lib/colors';

const redTheme = createTheme({
  palette: {
    primary: {
      main: colors.orange,
    },
  },
  typography: {
    // @ts-expect-error
    useNextVariants: true,
  },
});

type Props = {
  children: ReactNode;
  id: string;
  className: string;
  onClick: () => void;
};

export default (props: Props) => (
  <MuiThemeProvider theme={redTheme}>
    <Fab color="primary" {...props}>
      {props.children}
    </Fab>
  </MuiThemeProvider>
);
