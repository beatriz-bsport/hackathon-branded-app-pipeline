import React, { forwardRef, useCallback } from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Typography from '#Fabrique/Typography';
import { REQUIRED_SYMBOL } from '#Fabrique/constants';
import useMergeRef from '#Fabrique/InputBase/utils';

import './styles.css';

export type Props = {
  captionText?: string;
  className?: string;
  classes?: {
    captionText?: string;
    container?: string;
    errorMessage?: string;
    label?: string;
    labelContainer?: string;
    maxCharactersIndicator?: string;
    textArea?: string;
    textAreaContainer?: string;
  };
  errorMessage?: string;
  id?: string;
  isError?: boolean;
  isDisabled?: boolean;
  isDraggable?: boolean;
  isRequired?: boolean;
  label?: string;
  maxCharacters?: number;
  name?: string;
  onBlur?: (event?: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
  onChange?: (event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: (event?: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => void;
  onFocus?: (event?: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
  placeholder?: string;
  textAreaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  textFormId: string;
  value: string;
};

const TextForm: React.FC<Props> = forwardRef(
  (
    {
      captionText,
      className,
      classes,
      errorMessage,
      id,
      isError,
      isDisabled,
      isDraggable,
      isRequired,
      label,
      maxCharacters,
      name,
      onBlur,
      onChange,
      onClick,
      onFocus,
      placeholder,
      textAreaProps = {},
      textFormId,
      value,
    },
    textFormForwardedRef,
  ) => {
    const textFormRef = React.useRef(null);
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        setIsFocused(true);
        onFocus?.(event);
        textAreaProps?.onFocus?.(event);
      },
      [onFocus, textAreaProps],
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        setIsFocused(false);
        onBlur?.(event);
        textAreaProps?.onBlur?.(event);
      },
      [onBlur, textAreaProps],
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event);
        textAreaProps?.onChange?.(event);
      },
      [onChange, textAreaProps],
    );

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
        if (textFormRef.current && event.currentTarget === event.target) {
          textFormRef.current.focus();
        }
        onClick?.(event);
        textAreaProps.onClick?.(event);
      },
      [onClick, textAreaProps],
    );

    const handleTextFormRef = useMergeRef(textFormRef, textFormForwardedRef);

    return (
      <div
        className={classNames('bs-fabrique-text-form__root', className)}
        id={id}
      >
        <div
          className={classNames(
            'bs-fabrique-text-form__label__textarea__container',
            classes?.container,
          )}
        >
          <label
            className={classNames(
              'bs-fabrique-text-form__label__container',
              {
                'bs-fabrique-text-form__label--empty': !label,
              },
              classes?.labelContainer,
            )}
            htmlFor={textFormId}
          >
            <Typography
              className={classNames(
                'bs-fabrique-text-form__label',
                {
                  'bs-fabrique-text-form__label--disabled': isDisabled,
                },
                classes?.label,
              )}
              variant="body-sm"
            >
              {label}
              <span
                className={classNames(
                  'bs-fabrique-text-form__label--required',
                  {
                    'bs-fabrique-text-form__label--empty': !isRequired,
                    'bs-fabrique-text-form__label--disabled': isDisabled,
                  },
                )}
              >
                {REQUIRED_SYMBOL}
              </span>
            </Typography>
          </label>
          <div
            className={classNames(
              'bs-fabrique-text-form__textarea__container',
              {
                'bs-fabrique-text-form__textarea__container--disabled':
                  isDisabled,
                'bs-fabrique-text-form__textarea__container--error': isError,
                'bs-fabrique-text-form__textarea__container--focused':
                  isFocused,
                'bs-fabrique-text-form__textarea__container--draggable':
                  isDraggable,
              },
              classes?.textAreaContainer,
            )}
          >
            <textarea
              {...textAreaProps}
              ref={handleTextFormRef}
              className={classNames(
                'bs-fabrique-text-form__textarea',
                classes?.textArea,
              )}
              disabled={isDisabled}
              id={textFormId}
              maxLength={maxCharacters}
              name={name}
              onBlur={handleBlur}
              onChange={handleChange}
              onClick={handleClick}
              onFocus={handleFocus}
              placeholder={placeholder}
              required={isRequired}
              value={value}
            />
            <Typography
              className={classNames(
                'bs-fabrique-text-form__max-character__container',
                {
                  'bs-fabrique-text-form__max-character__container--disabled':
                    isDisabled,
                  'bs-fabrique-text-form__max-character__container--empty':
                    !maxCharacters,
                },
                classes?.maxCharactersIndicator,
              )}
              variant="body-xs"
            >
              {value?.length ?? 0} / {maxCharacters}
            </Typography>
          </div>
        </div>
        <Typography
          className={classNames(
            'bs-fabrique-text-form__caption-text',
            { 'bs-fabrique-text-form__caption-text--empty': !captionText },
            classes?.captionText,
          )}
          variant="body-xs"
        >
          {captionText}
        </Typography>
        {isError && !!errorMessage && (
          <Typography
            className={classes?.errorMessage}
            color="error"
            variant="body-sm"
          >
            {errorMessage}
          </Typography>
        )}
      </div>
    );
  },
);

export const TextFormStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof TextForm>>()(TextForm);

export default React.memo(TextForm);
