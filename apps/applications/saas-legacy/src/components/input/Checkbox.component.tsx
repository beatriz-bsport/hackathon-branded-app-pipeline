import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CheckboxMUI from '@material-ui/core/Checkbox';

interface CheckboxProps {
  label: string;
  helperText?: string;
  disabled?: boolean;
  checked: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  helperText,
  disabled = false,
  checked,
  onChange,
}) => (
  <FormControl>
    <FormControlLabel
      control={
        <CheckboxMUI
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
      }
      label={label}
    />
    {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
  </FormControl>
);

export default React.memo(Checkbox);
