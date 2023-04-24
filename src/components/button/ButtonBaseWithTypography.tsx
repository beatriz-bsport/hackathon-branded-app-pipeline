// @ts-nocheck
import React from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import classnames from 'classnames';

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
      onClick={props.onClick}
      className={classnames({ [props.className]: !!props.className })}
      disableRipple={!!props.disableRipple}
    >
      <Typography
        variant={props.typographyVariant}
        color={props.typographyColor}
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
