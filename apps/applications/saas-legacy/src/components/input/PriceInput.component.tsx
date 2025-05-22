import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';

import { getCurrencyDisplay } from '#src/libs/theme/selectors';

import NumericInput from './NumericInput.component';

type Props = React.ComponentProps<typeof NumericInput> & {
  invalid?: boolean;
  inputStep?: number;
};

const PriceInput: React.FC<Props> = (props) => {
  return (
    <NumericInput
      isPositive
      InputProps={{
        inputProps: {
          step: props.inputStep || 0.01,
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
};

export default React.memo(PriceInput);
