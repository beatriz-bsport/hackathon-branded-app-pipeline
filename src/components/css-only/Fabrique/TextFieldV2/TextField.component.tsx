import React, { ChangeEvent } from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import type { TextFieldSize, TextFieldType } from './types';
import { TextFieldSizeEnum, TextFieldTypeEnum } from './constants';

import ButtonBase from '#Fabrique/ButtonBaseV2';
import Typography from '../Typography';
import { REQUIRED_SYMBOL } from '#Fabrique/constants';

import './styles.css';

const CLEARICON = (
  <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M3.52851 3.52876C3.78886 3.26841 4.21097 3.26841 4.47132 3.52876L7.99992 7.05735L11.5285 3.52876C11.7889 3.26841 12.211 3.26841 12.4713 3.52876C12.7317 3.78911 12.7317 4.21122 12.4713 4.47157L8.94273 8.00016L12.4713 11.5288C12.7317 11.7891 12.7317 12.2112 12.4713 12.4716C12.211 12.7319 11.7889 12.7319 11.5285 12.4716L7.99992 8.94297L4.47132 12.4716C4.21097 12.7319 3.78886 12.7319 3.52851 12.4716C3.26816 12.2112 3.26816 11.7891 3.52851 11.5288L7.05711 8.00016L3.52851 4.47157C3.26816 4.21122 3.26816 3.78911 3.52851 3.52876Z"
      fillRule="evenodd"
    />
  </svg>
);

export type Props = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  id?: string;
  classes?: {
    root?: string;
    container?: string;
    label?: string;
    inputContainer?: string;
    input?: string;
    helperText?: string;
    clearButton?: string;
    leftIcon?: string;
    rightIcon?: string;
  };
  isDisabled?: boolean;
  type?: TextFieldType;
  size?: TextFieldSize;
  name?: string;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  isError?: boolean;
  placeholder?: string;
  onClear?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  isRippleEnabled?: boolean;
};

const TextField: React.FC<Props> = ({
  classes,
  isDisabled,
  type = TextFieldTypeEnum.TEXT,
  size = TextFieldSizeEnum.LG,
  name,
  label,
  value,
  helperText,
  isRequired,
  id,
  inputId,
  isError,
  onChange,
  placeholder,
  onClear,
  leftIcon,
  rightIcon,
  onBlur,
  onFocus,
  isRippleEnabled,
}) => {
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  const onInputFocus = React.useCallback(() => {
    setIsInputFocused(true);
    onFocus?.();
  }, [onFocus]);

  const onInputUnfocus = React.useCallback(() => {
    setIsInputFocused(false);
    onBlur?.();
  }, [onBlur]);

  const isSmall = size === TextFieldSizeEnum.SM;
  const isLarge = size === TextFieldSizeEnum.LG;

  return (
    <div
      className={classNames('bs-fabrique-textfield__wrapper', classes?.root)}
      id={id}
    >
      <div
        className={classNames(
          'bs-fabrique-textfield__container',
          classes?.container,
        )}
      >
        {!!label && (
          <label htmlFor={inputId}>
            <Typography
              className={classNames(
                'bs-fabrique-textfield__label',
                {
                  'bs-fabrique-textfield__label--disabled': isDisabled,
                },
                classes?.label,
              )}
              variant={isSmall ? 'body-sm' : 'body-md'}
            >
              {label}
              {isRequired && (
                <span className="bs-fabrique-textfield__label--required">
                  {REQUIRED_SYMBOL}
                </span>
              )}
            </Typography>
          </label>
        )}
        <div
          className={classNames(
            'bs-fabrique-textfield__input__container',
            {
              'bs-fabrique-textfield__input__container--disabled': isDisabled,
              'bs-fabrique-textfield__input__container--error': isError,
              'bs-fabrique-textfield__input__container--small': isSmall,
              'bs-fabrique-textfield__input__container--large': isLarge,
              'bs-fabrique-textfield__input__container--focused':
                isInputFocused,
            },
            classes?.inputContainer,
          )}
        >
          {!!leftIcon && (
            <span
              className={classNames(
                'bs-fabrique-textfield__icon--base',
                {
                  'bs-fabrique-textfield__icon--small': isSmall,
                  'bs-fabrique-textfield__icon--large': isLarge,
                },
                classes?.leftIcon,
              )}
            >
              {leftIcon}
            </span>
          )}
          <input
            className={classNames(
              'bs-fabrique-textfield__input',
              {
                'bs-fabrique-textfield__input--small': isSmall,
                'bs-fabrique-textfield__input--large': isLarge,
              },
              classes?.input,
            )}
            disabled={isDisabled}
            id={inputId}
            name={name}
            onBlur={onInputUnfocus}
            onChange={onChange}
            onFocus={onInputFocus}
            placeholder={placeholder}
            required={isRequired}
            type={type}
            value={value}
          />
          <div
            className={classNames(
              'bs-fabrique-textfield__right-icons__wrapper',
            )}
          >
            {!!value && !isDisabled && !!onClear && (
              <ButtonBase
                className={classNames(
                  'bs-fabrique-textfield__icon--base',
                  {
                    'bs-fabrique-textfield__icon--small': isSmall,
                    'bs-fabrique-textfield__icon--large': isLarge,
                  },
                  'bs-fabrique-textfield__clear-button',
                  classes?.clearButton,
                )}
                isDisabled={isDisabled}
                isRippleEnabled={isRippleEnabled}
                onClick={onClear}
                type="button"
              >
                {CLEARICON}
              </ButtonBase>
            )}
            {!!rightIcon && (
              <span
                className={classNames(
                  'bs-fabrique-textfield__icon--base',
                  {
                    'bs-fabrique-textfield__icon--small': isSmall,
                    'bs-fabrique-textfield__icon--large': isLarge,
                  },
                  'bs-fabrique-textfield__right-icon',
                  classes?.rightIcon,
                )}
              >
                {rightIcon}
              </span>
            )}
          </div>
        </div>
      </div>
      {!!helperText && (
        <Typography
          className={classes?.helperText}
          variant={isSmall ? 'body-sm' : 'body-md'}
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};

export const TextFieldStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof TextField>>()(TextField);

export default React.memo(TextField);
