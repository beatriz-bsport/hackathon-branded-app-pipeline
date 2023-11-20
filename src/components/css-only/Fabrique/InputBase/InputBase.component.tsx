import React, { forwardRef, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import useMergeRef from './utils';

export type Props = {
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   * @default {}
   */
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.Ref<any>;
  className?: string;
  onBlur?: (event?: React.FocusEvent<HTMLInputElement, Element>) => void;
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event?: React.FocusEvent<HTMLInputElement, Element>) => void;
};

const InputBase: React.ForwardRefExoticComponent<
  Props & React.RefAttributes<HTMLInputElement>
> = forwardRef(
  (
    { inputProps, inputRef, className, onBlur, onChange, onFocus, ...other },
    inputForwardedRef,
  ) => {
    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement, Element>,
    ) => {
      inputProps.onFocus?.(event);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
      inputProps.onBlur?.(event);
      onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      inputProps.onChange?.(event);
      onChange?.(event);
    };

    const handleInputRef = useMergeRef(inputRef, inputForwardedRef);

    return (
      <input
        {...other}
        {...inputProps}
        ref={handleInputRef}
        className={classNames('bs-fabrique-input-base', className)}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    );
  },
);

export default React.memo(InputBase);
