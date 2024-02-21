import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';

import NumericInput from './NumericInput.component';

type Props = {
  invalid: boolean,
};

export default function PercentInput(props: Props) {
  return (
    <NumericInput
      isPositive
      InputProps={{
        inputProps: {
          step: 'any',
          max: 100,
          style: { color: props.invalid ? 'red' : 'black' },
        },
        startAdornment: <InputAdornment position="start">%</InputAdornment>,
      }}
      {...props}
    />
  );
}
