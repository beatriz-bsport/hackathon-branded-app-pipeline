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
  label: ?string,
  InputProps: ?Object,
  helperText: ?string,
  classes: Object,
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
  } = props;
  return (
    <TextField
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
    />
  );
}

export default withStyles(styles)(NumericInput);
