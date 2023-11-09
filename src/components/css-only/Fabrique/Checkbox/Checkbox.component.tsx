import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Typography from '#Fabrique/Typography';
import { CheckboxSizeEnum } from './constants';
import type { CheckboxSize } from './types';

import './styles.css';

export type CheckboxIconProps = {
  className?: string;
  isChecked: boolean;
  isDisabled?: boolean;
  isInversed?: boolean;
  multiple?: boolean;
};

export type Props = {
  captionText?: string;
  classes?: {
    label?: string;
    captionText?: string;
  };
  id: string;
  label?: string;
  name?: string;
  onClick?: (event?: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  size?: CheckboxSize;
} & CheckboxIconProps;

const CheckboxIcon: React.FC<CheckboxIconProps> = React.memo(
  ({ isInversed, isDisabled, isChecked, multiple }) => {
    if (multiple) {
      return (
        // TODO: create a svg container that will get used all over the fabrique like src/components/icons/MuiSvgIcon.component.tsx
        <svg
          className="bs-fabrique-checkbox__icon__svg"
          fill="none"
          height="100%"
          viewBox="0 0 24 24"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={classNames('bs-fabrique-checkbox__icon--multiple', {
              'bs-fabrique-checkbox__icon--inversed': isInversed,
              'bs-fabrique-checkbox__icon--disabled': isDisabled,
            })}
            clipRule="evenodd"
            d="M2 6.4C2 3.96995 3.96995 2 6.4 2H17.6C20.0301 2 22 3.96995 22 6.4V17.6C22 20.0301 20.0301 22 17.6 22H6.4C3.96995 22 2 20.0301 2 17.6V6.4ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H8Z"
            fillRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg
        className="bs-fabrique-checkbox__icon__svg"
        fill="none"
        height="100%"
        viewBox="0 0 24 24"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isChecked ? (
          <path
            className={classNames('bs-fabrique-checkbox__icon--checked', {
              'bs-fabrique-checkbox__icon--inversed': isInversed,
              'bs-fabrique-checkbox__icon--disabled': isDisabled,
            })}
            clipRule="evenodd"
            d="M6.4 2A4.4 4.4 0 0 0 2 6.4v11.2A4.4 4.4 0 0 0 6.4 22h11.2a4.4 4.4 0 0 0 4.4-4.4V6.4A4.4 4.4 0 0 0 17.6 2H6.4Zm11.307 7.707a1 1 0 0 0-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l6-6Z"
            fillRule="evenodd"
          />
        ) : (
          <path
            className={classNames('bs-fabrique-checkbox__icon--unchecked', {
              'bs-fabrique-checkbox__icon--inversed': isInversed,
              'bs-fabrique-checkbox__icon--disabled': isDisabled,
            })}
            clipRule="evenodd"
            d="M17.6 4H6.4A2.4 2.4 0 0 0 4 6.4v11.2A2.4 2.4 0 0 0 6.4 20h11.2a2.4 2.4 0 0 0 2.4-2.4V6.4A2.4 2.4 0 0 0 17.6 4ZM6.4 2A4.4 4.4 0 0 0 2 6.4v11.2A4.4 4.4 0 0 0 6.4 22h11.2a4.4 4.4 0 0 0 4.4-4.4V6.4A4.4 4.4 0 0 0 17.6 2H6.4Z"
            fillRule="evenodd"
          />
        )}
      </svg>
    );
  },
);

const Checkbox: React.FC<Props> = ({
  isChecked,
  id,
  className,
  onClick,
  label,
  classes,
  isInversed,
  isDisabled,
  captionText,
  multiple,
  name,
  size = CheckboxSizeEnum.SM,
}) => {
  const isSmall = size === CheckboxSizeEnum.SM;
  return (
    <label
      className={classNames('bs-fabrique-checkbox-root', className)}
      htmlFor={id}
    >
      {/* TODO: Consider passing input props */}
      <input
        checked={isChecked}
        className="bs-fabrique-checkbox__input"
        disabled={isDisabled}
        id={id}
        name={name ?? ''}
        onClick={onClick}
        type="checkbox"
      />

      <CheckboxIcon
        isChecked={isChecked}
        isDisabled={isDisabled}
        isInversed={isInversed}
        multiple={multiple}
      />
      <div className="bs-fabrique-checkbox__text-container">
        <Typography
          align="left"
          className={classNames(
            'bs-fabrique-checkbox-label',
            {
              'bs-fabrique-checkbox-label--inversed': isInversed,
              'bs-fabrique-checkbox-label--disabled': isDisabled,
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
            'bs-fabrique-checkbox-captiontext',
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

export const CheckboxStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Checkbox>>()(Checkbox);

export default React.memo(Checkbox);
