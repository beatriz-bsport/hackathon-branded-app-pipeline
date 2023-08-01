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
      control={
        <CheckboxMUI
          {...props}
          checked={props.checked}
          disabled={!!props.disabled}
        />
      }
      helperText={props.helperText}
      label={props.label}
    />
    {props.helperText ? (
      <FormHelperText>{props.helperText}</FormHelperText>
    ) : null}
  </FormControl>
);

export default Checkbox;
