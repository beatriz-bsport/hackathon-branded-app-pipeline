import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';

import NumericInput from './NumericInput.component';
import { getCurrencyDisplay } from '../../libs/theme/selectors';

type Props = {
  invalid: boolean,
};

export default function PriceInput(props: Props) {
  return (
    <NumericInput
      InputProps={{
        inputProps: {
          step: 0.01,
          style: { color: props.invalid ? 'red' : 'black' },
        },
        startAdornment: (
          <InputAdornment position="start">
            {getCurrencyDisplay()}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
