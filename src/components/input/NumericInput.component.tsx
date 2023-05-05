// @ts-nocheck
// @flow
import React, { useCallback } from 'react';

import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';

type Props = {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  margin?: number;
  label?: string;
  InputProps: any;
  helperText?: string;
  variant?: string;
  isPositive?: boolean;
  id?: string;
  name?: string;
  size?: 'medium' | 'small';
  placeholder?: string;
  inputClass?: string;
  onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
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
      id={id}
      name={name}
      variant={variant}
      className={classNames(inputClass)}
      required={required}
      disabled={disabled}
      value={value}
      label={label}
      onChange={handleOnChange}
      error={error}
      InputProps={InputProps}
      type="number"
      helperText={helperText}
      fullWidth={props.fullWidth}
      margin={props.margin}
      onBlur={onBlur}
      size={size ?? 'medium'}
      placeholder={placeholder}
    />
  );
}

export default NumericInput;
