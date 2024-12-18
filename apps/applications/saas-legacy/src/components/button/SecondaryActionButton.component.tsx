import React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';

const secondaryActionButtonTheme = createTheme({
  palette: {
    primary: {
      main: '#616161',
    },
  },
});

type Props = Omit<ButtonProps, 'color'>;

const SecondaryActionButton: React.FC<Props> = (props) => {
  return (
    <MuiThemeProvider theme={secondaryActionButtonTheme}>
      <Button color="primary" {...props}>
        {props.children}
      </Button>
    </MuiThemeProvider>
  );
};

export default React.memo(SecondaryActionButton);
