import React from 'react';

import classNames from 'classnames';

import chroma from 'chroma-js';

import makeStyles from '@material-ui/styles/makeStyles';
import { SvgIconComponent } from '@material-ui/icons';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import type { Theme } from '@material-ui/core/styles';

export type Props = {
  MuiIcon: SvgIconComponent;
  variant?: 'primary' | 'secondary' | 'disabled';
  defaultBackGround?: boolean;
  customColor?: string;
  MuiIconProps?: SvgIconProps;
};
type CustomColorProps = {
  customColor?: string;
};
export const CustomMuiIcon: React.FC<Props> = ({
  MuiIcon,
  variant,
  MuiIconProps,
  customColor,
  defaultBackGround,
}) => {
  const classes = useStyles({ customColor });

  const className = classNames({
    [classes.root]: !defaultBackGround,
    [classes.primary]: variant === 'primary',
    [classes.secondary]: variant === 'secondary',
    [classes.disabled]: variant === 'disabled',
    [classes.custom]: !!customColor,
  });
  return <MuiIcon className={className} {...MuiIconProps} />;
};

const useStyles = makeStyles<Theme, CustomColorProps>((theme: Theme) => ({
  root: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5),
  },
  // Find this is MUI .MuiSvgIcon-colorDisabled
  disabled: {
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: chroma('rgba(0, 0, 0, 0.26)').alpha(0.09).hex(),
  },
  primary: {
    color: theme.palette.primary.main,
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.09).hex(),
  },
  secondary: {
    color: theme.palette.secondary.main,
    backgroundColor: chroma(theme.palette.secondary.main).alpha(0.09).hex(),
  },
  custom: ({ customColor }) => ({
    color: customColor ?? null,
    backgroundColor: chroma(customColor ?? theme.palette.primary.main)
      .alpha(0.09)
      .hex(),
  }),
}));

// TODO (Use this component as reference to build CustomIcons): https://gitlab.com/bsport/bsport-saas/-/issues/1282
export default CustomMuiIcon;
