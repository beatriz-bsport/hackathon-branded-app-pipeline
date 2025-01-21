import React from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import clsx from 'clsx';

type Props = {
  children: any;
  onClick: () => void;
  className?: string;
  disableRipple?: boolean;
  typographyColor?:
    | 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error';
  typographyVariant?: Variant | 'inherit';
};

const ButtonBaseWithTypography = (props: Props) => {
  return (
    <ButtonBase
      className={clsx({ [props.className]: !!props.className })}
      disableRipple={!!props.disableRipple}
      onClick={props.onClick}
    >
      <Typography
        color={props.typographyColor}
        variant={props.typographyVariant}
      >
        {props.children}
      </Typography>
    </ButtonBase>
  );
};

ButtonBaseWithTypography.defaultProps = {
  typographyColor: 'primary',
  typographyVariant: 'body1',
};

export default ButtonBaseWithTypography;
