import React, { ChangeEvent } from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import type { TextFieldSize, TextFieldType } from './types';
import { TextFieldSizeEnum, TextFieldTypeEnum } from './constants';

import ButtonBase from '#Fabrique/ButtonBaseV2';
import Typography from '#Fabrique/Typography';
import InputBase from '#Fabrique/InputBase';
import { REQUIRED_SYMBOL } from '#Fabrique/constants';

import { XClose } from '#components/untitledui';

import './styles.css';

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
    errorMessage?: string;
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
  onBlur?: (event?: React.FocusEvent<any>) => void;
  onFocus?: (event?: React.FocusEvent<any>) => void;
  isRippleEnabled?: boolean;
  errorMessage?: string;
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
  errorMessage,
}) => {
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  const onInputFocus = React.useCallback(() => {
    setIsInputFocused(true);
    onFocus?.();
  }, [onFocus]);

  const onInputUnfocus = React.useCallback(
    (event?: React.FocusEvent<any>) => {
      setIsInputFocused(false);
      event && onBlur?.(event);
    },
    [onBlur],
  );

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
              <span
                className={classNames(
                  'bs-fabrique-textfield__label--required',
                  {
                    'bs-fabrique-textfield__label--disabled': isDisabled,
                    'bs-fabrique-textfield__label--empty': !isRequired,
                  },
                )}
              >
                {REQUIRED_SYMBOL}
              </span>
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
          <Typography
            className="bs-fabrique-textfield__input__text"
            variant="body-md"
          >
            <InputBase
              className={classNames(
                'bs-fabrique-textfield__input',
                classes?.input,
              )}
              id={inputId}
              isDisabled={isDisabled}
              isRequired={isRequired}
              name={name}
              onBlur={onInputUnfocus}
              onChange={onChange}
              onFocus={onInputFocus}
              placeholder={placeholder}
              type={type}
              value={value}
            />
          </Typography>
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
                <XClose stroke="currentColor" />
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
      {isError && !!errorMessage && (
        <Typography
          className={classes?.errorMessage}
          color="error"
          variant={isSmall ? 'body-sm' : 'body-md'}
        >
          {errorMessage}
        </Typography>
      )}
    </div>
  );
};

export const TextFieldStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof TextField>>()(TextField);

export default React.memo(TextField);
