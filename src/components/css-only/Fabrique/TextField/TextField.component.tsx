import React, { ChangeEvent, useState, useCallback } from 'react';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { TextFieldSize } from '.';
import Button, { ButtonVariant } from '../Button';

import { TextFieldVariant } from './types';

import './styles.css';

export type Props = {
  classes?: {
    root?: string;
    label?: string;
    input?: string;
    helperText?: string;
  };
  isDisabled?: boolean;
  /** Plain text only, for other input types we should have separate components */
  type?: 'text' | 'email' | 'tel' | 'password';
  size?: TextFieldSize;
  name: string;
  label?: string;
  value: string;
  helperText?: string;
  isFullWidth?: boolean;
  isRequired?: boolean;
  id: string;
  inputId: string;
  inputTestId?: string;
  helperTextId?: string;
  placeholder?: string;
  isError?: boolean;
  variant?: `${TextFieldVariant}`;
  withPasswordToggle?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hasWhiteBackground?: boolean;
};

const TextFieldContainerClassNameMap = {
  [TextFieldVariant.STANDARD]: 'bs-text-field-standard__container',
  [TextFieldVariant.OUTLINED]: 'bs-text-field-outlined__container',
};

const TextField: React.FC<Props> = ({
  classes,
  isDisabled,
  type,
  size,
  name,
  label,
  value,
  helperText,
  isFullWidth,
  isRequired,
  id,
  inputId,
  inputTestId,
  helperTextId,
  isError,
  variant = TextFieldVariant.OUTLINED,
  withPasswordToggle,
  placeholder,
  onChange,
  hasWhiteBackground,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onInputFocus = useCallback(() => setIsInputFocused(true), []);
  const onInputUnfocus = useCallback(() => setIsInputFocused(false), []);

  const containerClassName = TextFieldContainerClassNameMap[variant];

  const inputType = React.useMemo(() => {
    if (type === 'password') {
      return isPasswordVisible ? 'text' : 'password';
    }
    return type ?? 'text';
  }, [isPasswordVisible, type]);

  const handleTogglePasswordVisible = useCallback(
    () => setIsPasswordVisible((state) => !state),
    [],
  );

  return (
    <div
      className={classNames('bs-text-field-helper-text__container', {
        'bs-text-field-helper-text__container--full': isFullWidth,
      })}
      id={id}
    >
      <div
        className={classNames(
          'bs-text-field__container',
          {
            'bs-text-field__container--disabled': isDisabled,
            'bs-text-field__container--error': isError,
            'bs-text-field__container--full': isFullWidth,
            'bs-text-field__container--small': size === TextFieldSize.SMALL,
            'bs-text-field__container--large': size === TextFieldSize.LARGE,
          },
          containerClassName,
          classes?.root,
        )}
      >
        {!!label && (
          <label
            className={classNames(
              'bs-text-field__label',
              {
                'bs-text-field__label--disabled': isDisabled,
                'bs-text-field__label--error': isError,
                'bs-text-field__label--top':
                  (isInputFocused || value) && !hasWhiteBackground,
                'bs-text-field__label--top-white':
                  (isInputFocused || value) && hasWhiteBackground,
                'bs-text-field__label--small': size === TextFieldSize.SMALL,
                'bs-text-field__label--large': size === TextFieldSize.LARGE,
              },
              classes?.label,
            )}
            htmlFor={id}
          >
            {`${label}${isRequired ? ' *' : ''}`}
          </label>
        )}
        <input
          className={classNames(
            'bs-text-field__input',
            {
              'bs-text-field__input--disabled': isDisabled,
              'bs-text-field__input--with-password-toggle':
                variant !== TextFieldVariant.STANDARD && withPasswordToggle,
              'bs-text-field__standard-input--with-password-toggle':
                variant === TextFieldVariant.STANDARD && withPasswordToggle,
              'bs-text-field__input--small': size === TextFieldSize.SMALL,
              'bs-text-field__input--large': size === TextFieldSize.LARGE,
            },
            classes?.input,
          )}
          data-testid={inputTestId}
          disabled={isDisabled}
          id={inputId}
          name={name}
          onBlur={onInputUnfocus}
          onChange={onChange}
          onFocus={onInputFocus}
          placeholder={placeholder}
          required={isRequired}
          type={inputType}
          value={value}
        />
        {type === 'password' && withPasswordToggle && (
          <Button
            disableRipple
            classes={{ root: 'bs-text-field__input__password-toggle' }}
            onClick={handleTogglePasswordVisible}
            variant={ButtonVariant.ICON}
          >
            {isPasswordVisible ? (
              <Visibility color="inherit" />
            ) : (
              <VisibilityOff color="inherit" />
            )}
          </Button>
        )}
      </div>

      {!!helperText && (
        <p
          className={classNames(
            'bs-text-field__helper-text',
            {
              'bs-text-field__helper-text--error': isError,
            },
            classes?.helperText,
          )}
          id={helperTextId}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export const TextFieldForStorybook = marketplaceCssHoc()(TextField);

export default React.memo(TextField);
