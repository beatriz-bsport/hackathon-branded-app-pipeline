import React from 'react';

import { InputAdornment } from '@material-ui/core';

import NumericInput from './NumericInput.component';

export default function PriceInput(props) {
  return (
    <NumericInput
      InputProps={{
        inputProps: { min: 0, step: 0.01 },
        startAdornment: <InputAdornment position="start">€</InputAdornment>,
      }}
      {...props}
    />
  );
}
