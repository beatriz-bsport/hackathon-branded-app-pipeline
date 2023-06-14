import React from 'react';
import {
  Theme,
  createTheme,
  MuiThemeProvider,
  useTheme,
  alpha,
  makeStyles,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import MuiIcon from '#components/MuiIcon.component';

// typing to confirm
export type Props = {
  displayedValue: string;
  mainColor?: string;
  icon?: string;
  iconColor?: string;
};

const getColor = (theme: Theme, mainColor?: string) => {
  const textColor = mainColor || theme.palette.grey[900];
  const backgroundColor = alpha(textColor, 0.1);
  return { backgroundColor, textColor };
};

export const CustomChip = (props: Props) => {
  const { displayedValue, mainColor, icon } = props;
  const defaultTheme = useTheme();
  const { backgroundColor, textColor } = getColor(defaultTheme, mainColor);

  const theme = backgroundColor
    ? createTheme({
        palette: {
          primary: {
            main: backgroundColor,
            contrastText: textColor,
          },
        },
      })
    : defaultTheme;

  const classes = useStyles(props);

  return (
    <MuiThemeProvider theme={theme}>
      <Chip
        className={classes.chip}
        label={displayedValue}
        size="small"
        color="primary"
        icon={!!icon && <MuiIcon className={classes.icon} icon={icon} />}
      />
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles<Theme, Props>((theme) => ({
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    color: (props) =>
      props.iconColor ?? props.mainColor ?? theme.palette.grey[900],
  },
  chip: {
    borderRadius: '4px',
  },
}));

export default React.memo(CustomChip);
