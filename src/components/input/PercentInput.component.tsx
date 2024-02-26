import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';

import NumericInput, {
  Props as NumericInputProps,
} from './NumericInput.component';

type Props = {
  invalid: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
} & NumericInputProps;

const PercentInput: React.FC<Props> = ({ invalid, ...numericInputProps }) => {
  return (
    <NumericInput
      isPositive
      InputProps={{
        inputProps: {
          step: 'any',
          max: 100,
          style: { color: invalid ? 'red' : 'black' },
        },
        startAdornment: <InputAdornment position="start">%</InputAdornment>,
      }}
      {...numericInputProps}
    />
  );
};

export default React.memo(PercentInput);
