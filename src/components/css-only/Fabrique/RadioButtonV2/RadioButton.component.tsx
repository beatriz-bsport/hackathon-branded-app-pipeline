import React, { memo } from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
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
  return (
    // TODO: import ICONS from proper folder
    <svg
      className={classNames('bs-fabrique-radio__icon', className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isChecked ? (
        <>
          <path
            className={classNames('bs-fabrique-radio--checked--main', {
              'bs-fabrique-radio--checked--inversed': isInversed,
              'bs-fabrique-radio--disabled': isDisabled,
            })}
            d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            fill="none"
          />
          <path
            className={classNames('bs-fabrique-radio--checked--main', {
              'bs-fabrique-radio--checked--inversed': isInversed,
              'bs-fabrique-radio--disabled': isDisabled,
            })}
            clipRule="evenodd"
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1ZM3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z"
            fill="none"
            fillRule="evenodd"
          />
        </>
      ) : (
        <path
          className={classNames('bs-fabrique-radio--unchecked', {
            'bs-fabrique-radio--unchecked--inversed': isInversed,
            'bs-fabrique-radio--disabled': isDisabled,
          })}
          clipRule="evenodd"
          d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Z"
          fill="none"
          fillRule="evenodd"
        />
      )}
    </svg>
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
