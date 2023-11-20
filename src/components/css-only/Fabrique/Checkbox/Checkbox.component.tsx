import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Typography from '#Fabrique/Typography';
import { CheckboxSizeEnum } from './constants';
import { CheckSquare01, MinusSquare01, Square } from '#components/untitledui';
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
        <MinusSquare01
          className="bs-fabrique-checkbox__icon__svg"
          pathProps={{
            className: classNames('bs-fabrique-checkbox__icon--multiple', {
              'bs-fabrique-checkbox__icon--inversed': isInversed,
              'bs-fabrique-checkbox__icon--disabled': isDisabled,
            }),
          }}
        />
      );
    }
    return (
      <>
        {isChecked ? (
          <CheckSquare01
            className="bs-fabrique-checkbox__icon__svg"
            pathProps={{
              className: classNames('bs-fabrique-checkbox__icon--checked', {
                'bs-fabrique-checkbox__icon--inversed': isInversed,
                'bs-fabrique-checkbox__icon--disabled': isDisabled,
              }),
            }}
          />
        ) : (
          <Square
            className="bs-fabrique-checkbox__icon__svg"
            pathProps={{
              className: classNames('bs-fabrique-checkbox__icon--unchecked', {
                'bs-fabrique-checkbox__icon--inversed': isInversed,
                'bs-fabrique-checkbox__icon--disabled': isDisabled,
              }),
            }}
          />
        )}
      </>
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
