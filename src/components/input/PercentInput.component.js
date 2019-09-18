import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';

import NumericInput from './NumericInput.component';

export default function PriceInput(props) {
  return (
    <NumericInput
      InputProps={{
        inputProps: { step: 1, max: 100, min: 0 },
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      {...props}
    />
  );
}
