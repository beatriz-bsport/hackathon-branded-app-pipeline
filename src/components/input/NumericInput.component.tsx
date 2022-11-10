// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

const styles = () => ({
  textInput: {},
});

type Props = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  margin?: number;
  label?: string;
  InputProps: any;
  helperText: string | null;
  classes: any;
  variant?: string;
  isPositive?: boolean;
  onBlur: null | ((e: React.SyntheticEvent<HTMLInputElement>) => void);
};

export function NumericInput(props: Props) {
  const {
    classes,
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
  } = props;

  const handleOnChange = onChange
    ? (ev: React.ChangeEvent<HTMLElement>) => {
        if (isPositive) {
          return ev.target.value >= 0 ? onChange(ev) : undefined;
        }
        return onChange(ev);
      }
    : onChange;

  return (
    <TextField
      variant={variant}
      className={classes.textInput}
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
    />
  );
}

export default withStyles(styles)(NumericInput);
