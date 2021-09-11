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
  onBlur: null | (() => void);
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
  } = props;
  return (
    <TextField
      variant={variant}
      className={classes.textInput}
      required={required}
      disabled={disabled}
      value={value}
      label={label}
      onChange={onChange}
      error={error}
      InputProps={InputProps}
      type="number"
      helperText={helperText}
      fullWidth={props.fullWidth}
      margin={props.margin}
      onBlur={props.onBlur}
    />
  );
}

export default withStyles(styles)(NumericInput);
