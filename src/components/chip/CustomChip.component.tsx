import React, { useMemo } from 'react';
import classnames from 'classnames';
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
import ToolTip from '#components/Tooltip.component';

type StylesProps = {
  mainColor?: string;
  iconColor?: string;
  maxWidth?: string;
};

export type CustomChipProps = {
  displayedValue: string;
  icon?: string;
  chipClass?: string;
  withBackground?: boolean;
  blackText?: boolean;
  toolTip?: boolean;
} & StylesProps;

const getColor = (
  theme: Theme,
  mainColor?: string,
  withBackground?: boolean,
  blackText?: boolean,
) => {
  const textColor = blackText
    ? theme.palette.common.black
    : mainColor || theme.palette.grey[900];
  const backgroundColor = alpha(
    mainColor || theme.palette.grey[900],
    withBackground ? 0.1 : 0,
  );
  return { backgroundColor, textColor };
};

export const CustomChip: React.FC<CustomChipProps> = ({
  displayedValue,
  icon,
  chipClass,
  withBackground = true,
  blackText,
  toolTip,
  mainColor,
  iconColor,
  maxWidth,
}) => {
  const classes = useStyles({ iconColor, mainColor, maxWidth });

  const defaultTheme = useTheme();

  const { backgroundColor, textColor } = getColor(
    defaultTheme,
    mainColor,
    withBackground,
    blackText,
  );

  const theme = useMemo(
    () =>
      backgroundColor
        ? createTheme({
            palette: {
              primary: {
                main: backgroundColor,
                contrastText: textColor,
              },
            },
          })
        : defaultTheme,
    [backgroundColor, defaultTheme, textColor],
  );

  return toolTip ? (
    <MuiThemeProvider theme={theme}>
      <ToolTip title={displayedValue}>
        <Chip
          className={classes.chip}
          label={displayedValue}
          size="small"
          color="primary"
          icon={!!icon && <MuiIcon className={classes.icon} icon={icon} />}
          variant="default"
        />
      </ToolTip>
    </MuiThemeProvider>
  ) : (
    <MuiThemeProvider theme={theme}>
      <Chip
        className={classnames(classes.chip, chipClass)}
        label={displayedValue}
        size="small"
        color="primary"
        icon={!!icon && <MuiIcon className={classes.icon} icon={icon} />}
        variant="default"
      />
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    color: ({ iconColor, mainColor }) =>
      iconColor ?? mainColor ?? theme.palette.grey[900],
  },
  chip: {
    borderRadius: theme.spacing(0.5),
    maxWidth: ({ maxWidth }) => maxWidth || null,
  },
}));

export default React.memo(CustomChip);
