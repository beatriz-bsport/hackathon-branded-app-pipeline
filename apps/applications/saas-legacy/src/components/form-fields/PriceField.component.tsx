import React from 'react';
import omit from 'lodash/omit';
import InputAdornment from '@material-ui/core/InputAdornment';
// @ts-expect-error
import { TextField } from '#src/components/forms';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import type { TextFieldProps } from '@material-ui/core';

type PriceFieldProps = Omit<TextFieldProps, 'inputProps'> & {
  fullWidth?: boolean;
  inputProps?: React.HTMLProps<HTMLInputElement>;
};

const DEFAULT_MIN = 0;
const DEFAULT_STEP = 1;

export const PriceField: React.FC<PriceFieldProps> = ({
  fullWidth,
  inputProps = {},
  ...textFieldProps
}) => {
  return (
    <TextField
      castAsNumber
      fullWidth={fullWidth}
      InputProps={{
        inputProps: {
          min: DEFAULT_MIN,
          step: DEFAULT_STEP,
          ...inputProps,
        },
        startAdornment: (
          <InputAdornment position="start">
            {getCurrencyDisplay()}
          </InputAdornment>
        ),
      }}
      type="number"
      {...omit(textFieldProps, ['field'])}
    />
  );
};
