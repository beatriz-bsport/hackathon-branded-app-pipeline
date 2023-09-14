import React, { ChangeEvent, useState, useCallback } from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { TextFieldSize } from '.';

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
  helperTextId?: string;
  isError?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
  helperTextId,
  isError,
  onChange,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const onInputFocus = useCallback(() => setIsInputFocused(true), []);
  const onInputUnfocus = useCallback(() => setIsInputFocused(false), []);

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
                'bs-text-field__label--top': isInputFocused || value,
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
              'bs-text-field__input--small': size === TextFieldSize.SMALL,
              'bs-text-field__input--large': size === TextFieldSize.LARGE,
            },
            classes?.input,
          )}
          disabled={isDisabled}
          id={inputId}
          name={name}
          onBlur={onInputUnfocus}
          onChange={onChange}
          onFocus={onInputFocus}
          required={isRequired}
          type={type ?? 'text'}
          value={value}
        />
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
