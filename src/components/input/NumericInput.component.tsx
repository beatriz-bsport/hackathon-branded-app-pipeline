import React, { FocusEventHandler, useCallback } from 'react';

import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';

export type NumericInputProps = {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  inputClass?: string;
  InputProps?: any;
  isPositive?: boolean;
  label?: string;
  margin?: 'none' | 'normal' | 'dense';
  name?: string;
  placeholder?: string;
  required?: boolean;
  size?: 'medium' | 'small';
  variant?: 'standard' | 'filled' | 'outlined';
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  disabled,
  error,
  fullWidth,
  helperText,
  id,
  inputClass,
  InputProps,
  isPositive,
  label,
  margin,
  name,
  placeholder,
  required,
  size,
  variant,
  onBlur,
}) => {
  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isEmpty = (event.target.value ?? '').trim().length === 0;
      if (onChange) {
        if (isPositive) {
          (isEmpty || parseInt(event.target.value) >= 0) && onChange(event);
        } else onChange(event);
      }
    },
    [isPositive, onChange],
  );

  return (
    <TextField
      className={classNames(inputClass)}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      helperText={helperText}
      id={id}
      InputProps={InputProps}
      label={label}
      margin={margin}
      name={name}
      onBlur={onBlur}
      onChange={handleOnChange}
      placeholder={placeholder}
      required={required}
      size={size ?? 'medium'}
      type="number"
      value={value}
      variant={variant}
    />
  );
};

export default React.memo(NumericInput);
