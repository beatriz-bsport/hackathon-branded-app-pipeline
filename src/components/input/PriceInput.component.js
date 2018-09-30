import React from 'react';

import { InputAdornment } from '@material-ui/core';

import NumericInput from './NumericInput.component';

export default function PriceInput(props) {
  return (
    <NumericInput
      InputProps={{
        startAdornment: <InputAdornment position="start">€</InputAdornment>,
      }}
      {...props}
    />
  );
}
