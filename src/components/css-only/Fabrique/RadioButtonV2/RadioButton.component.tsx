import React, { memo } from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import { Circle, Union } from '#components/untitledui';
import type { RadioButtonSize } from './types';
import { RadioButtonSizeEnum } from './constants';

import './styles.css';

type RadioButtonIconProps = Pick<
  Props,
  'isInversed' | 'isDisabled' | 'isChecked' | 'className'
>;

const RadioButtonIcon: React.FC<RadioButtonIconProps> = ({
  isInversed,
  isDisabled,
  isChecked,
  className,
}) => {
  return isChecked ? (
    <Union
      className={classNames('bs-fabrique-radio__icon', className)}
      pathProps={{
        className: classNames('bs-fabrique-radio--checked--main', {
          'bs-fabrique-radio--checked--inversed': isInversed,
          'bs-fabrique-radio--disabled': isDisabled,
        }),
        fill: 'none',
      }}
    />
  ) : (
    <Circle
      className={classNames('bs-fabrique-radio__icon', className)}
      pathProps={{
        className: classNames('bs-fabrique-radio--unchecked', {
          'bs-fabrique-radio--unchecked--inversed': isInversed,
          'bs-fabrique-radio--disabled': isDisabled,
        }),
        fill: 'none',
      }}
    />
  );
};

export type Props = {
  isChecked: boolean;
  id: string;
  size?: RadioButtonSize;
  className?: string;
  isDisabled?: boolean;
  isInversed?: boolean;
  onClick?: () => void;
  classes?: {
    input?: string;
    label?: string;
    checked?: string;
    unchecked?: string;
    captionText?: string;
    icon?: string;
  };
  label?: string;
  captionText?: string;
  name?: string;
};

export const RadioButton: React.FC<Props> = ({
  isChecked,
  className,
  isDisabled,
  onClick,
  size = RadioButtonSizeEnum.SM,
  classes,
  id,
  label,
  captionText,
  isInversed,
  name,
}) => {
  const isSmall = size === RadioButtonSizeEnum.SM;
  return (
    // TODO: Use LabelBase instead of label tag
    <label
      className={classNames('bs-fabrique-radio--root', className)}
      htmlFor={id}
    >
      {/* TODO: Use InputBase instead of input tag */}
      <input
        checked={isChecked}
        className={classNames('bs-fabrique-radio__input', classes?.input)}
        disabled={isDisabled}
        id={id}
        name={name}
        onClick={onClick}
        type="radio"
      />
      <RadioButtonIcon
        className={classes?.icon}
        isChecked={isChecked}
        isDisabled={isDisabled}
        isInversed={isInversed}
      />
      <div className="bs-fabrique-radio__textwrapper">
        <Typography
          align="left"
          className={classNames(
            'bs-fabrique-radio__label',
            {
              'bs-fabrique-radio__text--inversed': isInversed,
              'bs-fabrique-radio__text--disabled': isDisabled,
            },
            classes?.label,
          )}
          variant={isSmall ? 'body-sm' : 'body-md'}
        >
          {label}
        </Typography>
        <Typography
          align="left"
          className={classNames(
            'bs-fabrique-radio__captiontext',
            {
              'bs-fabrique-radio__text--inversed': isInversed,
              'bs-fabrique-radio__text--disabled': isDisabled,
            },
            classes?.captionText,
          )}
          variant="body-xs"
        >
          {captionText}
        </Typography>
      </div>
    </label>
  );
};

export const RadioButtonStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof RadioButton>>()(RadioButton);

export default memo(RadioButton);
