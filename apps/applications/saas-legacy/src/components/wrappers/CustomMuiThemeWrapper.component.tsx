import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import useTheme from '@material-ui/core/styles/useTheme';

type Props = {
  children: React.ReactNode;
  primary?: string;
  secondary?: string;
};

const CustomMuiThemeWrapper: React.FC<Props> = ({
  children,
  primary,
  secondary,
}) => {
  const defaultTheme = useTheme();

  const getNewColor = React.useCallback(
    (color: string) => {
      switch (color) {
        case 'error':
          return defaultTheme.palette.error.main;
        case 'info':
          return defaultTheme.palette.info.main;
        case 'success':
          return defaultTheme.palette.success.main;
        case 'warning':
          return defaultTheme.palette.warning.main;
        default:
          return color;
      }
    },
    [defaultTheme.palette],
  );

  const newTheme = createTheme({
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      primary: {
        ...defaultTheme.palette.primary,
        main: getNewColor(primary) || defaultTheme.palette.primary.main,
      },
      secondary: {
        ...defaultTheme.palette.secondary,
        main: getNewColor(secondary) || defaultTheme.palette.secondary.main,
      },
    },
  });
  return <MuiThemeProvider theme={newTheme}>{children}</MuiThemeProvider>;
};

export default React.memo(CustomMuiThemeWrapper);
