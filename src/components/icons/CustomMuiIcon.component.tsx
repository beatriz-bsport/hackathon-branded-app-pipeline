import React from 'react';

import classNames from 'classnames';

import chroma from 'chroma-js';

import makeStyles from '@material-ui/styles/makeStyles';
import { SvgIconComponent } from '@material-ui/icons';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import type { Theme } from '@material-ui/core/styles';
import MuiIconComponent from '#components/MuiIcon.component';

type StylesProps = {
  customColor?: string;
  withBackground?: boolean;
  fadeIcon?: boolean;
};

export type Props = {
  MuiIcon?: SvgIconComponent;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'disabled';
  defaultBackGround?: boolean;
  MuiIconProps?: SvgIconProps;
  customClassName?: string;
} & StylesProps;

export const CustomMuiIcon: React.FC<Props> = ({
  MuiIcon,
  icon,
  variant,
  MuiIconProps,
  customColor,
  defaultBackGround,
  withBackground = true,
  fadeIcon,
  customClassName,
}) => {
  const classes = useStyles({
    customColor,
    withBackground,
    fadeIcon,
  });

  const className = classNames(
    {
      [classes.root]: !defaultBackGround,
      [classes.primary]: variant === 'primary',
      [classes.secondary]: variant === 'secondary',
      [classes.disabled]: variant === 'disabled',
      [classes.custom]: !!customColor,
    },
    customClassName,
  );
  if (MuiIcon) {
    return <MuiIcon className={className} {...MuiIconProps} />;
  }
  return (
    <MuiIconComponent
      className={className}
      defaultIcon="CheckCircle"
      fillColor={customColor}
      icon={icon}
    />
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme: Theme) => ({
  root: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5),
  },
  // Find this is MUI .MuiSvgIcon-colorDisabled
  disabled: {
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: ({ withBackground }) =>
      withBackground && chroma('rgba(0, 0, 0, 0.26)').alpha(0.09).hex(),
  },
  primary: {
    color: ({ fadeIcon }) =>
      fadeIcon
        ? chroma(theme.palette.primary.main).alpha(0.5).hex()
        : theme.palette.primary.main,
    backgroundColor: ({ withBackground }) =>
      withBackground && chroma(theme.palette.primary.main).alpha(0.09).hex(),
  },
  secondary: {
    color: ({ fadeIcon }) =>
      fadeIcon
        ? chroma(theme.palette.secondary.main).alpha(0.5).hex()
        : theme.palette.secondary.main,
    backgroundColor: ({ withBackground }) =>
      withBackground && chroma(theme.palette.secondary.main).alpha(0.09).hex(),
  },
  custom: ({ customColor, withBackground, fadeIcon }) => ({
    color: fadeIcon
      ? customColor && chroma(customColor).alpha(0.5).hex()
      : customColor ?? null,
    backgroundColor:
      withBackground &&
      chroma(customColor ?? theme.palette.primary.main)
        .alpha(0.09)
        .hex(),
  }),
}));

// TODO (Use this component as reference to build CustomIcons): https://gitlab.com/bsport/bsport-saas/-/issues/1282
export default React.memo(CustomMuiIcon);
