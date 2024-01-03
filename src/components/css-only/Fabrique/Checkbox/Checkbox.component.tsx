import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Typography from '#Fabrique/Typography';
import InputBase from '#Fabrique/InputBase';
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
  captionText?: string | React.ReactNode;
  classes?: {
    label?: string;
    captionText?: string;
    errorMessage?: string;
  };
  errorMessage?: string | React.ReactNode;
  id: string;
  isError?: boolean;
  isRequired?: boolean;
  /**
   * The ReactNode type enables, among other things, getting i18next <Trans/> component.
   * This component is meant to manage specific bold or italic words inside a text.
   */
  label?: string | React.ReactNode;
  name?: string;
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
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
  errorMessage,
  label,
  classes,
  isError,
  isInversed,
  isDisabled,
  captionText,
  multiple,
  isRequired,
  onChange,
  name,
  size = CheckboxSizeEnum.SM,
}) => {
  const isSmall = size === CheckboxSizeEnum.SM;
  return (
    <label
      className={classNames('bs-fabrique-checkbox-root', className)}
      htmlFor={id}
    >
      <InputBase
        className="bs-fabrique-checkbox__input"
        id={id}
        isChecked={isChecked}
        isDisabled={isDisabled}
        isRequired={isRequired}
        name={name ?? ''}
        onChange={onChange}
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
            { 'bs-fabrique-checkbox-captiontext--hidden': !captionText },
            classes?.captionText,
          )}
          variant="body-xs"
        >
          {captionText}
        </Typography>
        <Typography
          align="left"
          className={classNames(
            'bs-fabrique-checkbox-error-message',
            {
              'bs-fabrique-checkbox-error-message--hidden':
                !isError || !errorMessage,
            },
            classes?.errorMessage,
          )}
          color="error"
          variant="body-xs"
        >
          {errorMessage}
        </Typography>
      </div>
    </label>
  );
};

export const CheckboxStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Checkbox>>()(Checkbox);

export default React.memo(Checkbox);
