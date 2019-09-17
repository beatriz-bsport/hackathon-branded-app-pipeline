// @flow
import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CheckboxMUI from '@material-ui/core/Checkbox';

type Props = {
  label: string,
  helperText?: string,
  disabled?: boolean,
  checked: boolean,
};

export const Checkbox = (props: Props) => (
  <FormControl>
    <FormControlLabel
      label={props.label}
      helperText={props.helperText}
      control={
        <CheckboxMUI
          {...props}
          disabled={!!props.disabled}
          checked={props.checked}
        />
      }
    />
    {props.helperText ? (
      <FormHelperText>{props.helperText}</FormHelperText>
    ) : null}
  </FormControl>
);

export default Checkbox;
