import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';

import NumericInput from './NumericInput.component';

type Props = {
  invalid: boolean,
};

export default function PriceInput(props: Props) {
  return (
    <NumericInput
      InputProps={{
        inputProps: {
          step: 1,
          max: 100,
          min: 0,
          style: { color: props.invalid ? 'red' : 'black' },
        },
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      {...props}
    />
  );
}
