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
  value: string;
  mainColor: string;
  icon?: string;
  iconColor?: string;
};

const getColor = (mainColor: string) => {
  let textColor = '#212121'; // default: dark grey
  if (mainColor) {
    textColor = mainColor;
  }
  const backgroundColor = alpha(textColor, 0.1);
  return { backgroundColor, textColor };
};

export const ReportChipDisplay = (props: Props) => {
  const { value, mainColor, icon } = props;
  const defaultTheme = useTheme();
  const { backgroundColor, textColor } = getColor(mainColor);

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
        label={value}
        size="small"
        color="primary"
        icon={icon ? <MuiIcon className={classes.icon} icon={icon} /> : null}
      />
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles<Theme, Props>((theme) => ({
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    color: (props) => props.iconColor ?? props.mainColor ?? '#212121',
  },
}));

export default React.memo(ReportChipDisplay);
