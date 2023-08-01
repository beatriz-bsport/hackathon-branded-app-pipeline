import React, { FocusEventHandler, useCallback } from 'react';

import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';

type Props = {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  margin?: 'none' | 'normal' | 'dense';
  label?: string;
  InputProps: any;
  helperText?: string;
  variant?: 'standard' | 'filled' | 'outlined';
  isPositive?: boolean;
  id?: string;
  name?: string;
  size?: 'medium' | 'small';
  placeholder?: string;
  inputClass?: string;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export function NumericInput(props: Props) {
  const {
    required,
    disabled,
    value,
    label,
    onChange,
    error,
    InputProps,
    helperText,
    variant,
    isPositive,
    onBlur,
    id,
    name,
    size,
    placeholder,
    inputClass,
  } = props;

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        if (isPositive) {
          return parseInt(event.target.value) >= 0
            ? onChange(event)
            : undefined;
        }
        return onChange(event);
      }
      return onChange;
    },
    [isPositive, onChange],
  );

  return (
    <TextField
      className={classNames(inputClass)}
      disabled={disabled}
      error={error}
      fullWidth={props.fullWidth}
      helperText={helperText}
      id={id}
      InputProps={InputProps}
      label={label}
      margin={props.margin}
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
}

export default NumericInput;
