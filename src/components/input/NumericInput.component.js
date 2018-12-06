// @flow
import React from 'react';

import { withStyles, TextField } from '@material-ui/core';

const styles = () => ({
  textInput: {},
});

type Props = {
  value: string,
  onChange: (string) => void,
  required: ?boolean,
  disabled: ?boolean,
  error: ?boolean,
  fullWidth: ?boolean,
  margin: ?number,
  label: ?string,
  InputProps: ?Object,
  helperText: ?string,
  classes: Object,
  variant: ?string,
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
    />
  );
}

export default withStyles(styles)(NumericInput);
