import React, { JSX } from 'react';
import { DateTime, Settings } from 'luxon';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import {
  InputLabelProps as InputLabelPropsType,
  makeStyles,
} from '@material-ui/core';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';

type Props = {
  value: DateTime;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  minDate?: DateTime;
  maxDate?: DateTime;
  onChange: (value: DateTime) => void;
  className?: string;
  clearable?: boolean;
  format?: string;
  name?: string;
  endAdornment?: JSX.Element;
  InputLabelProps?: Partial<InputLabelPropsType>;
};

const useStyle = makeStyles(() => ({
  container: {
    width: 200,
  },
}));

export const DateInput: React.FC<Props> = ({
  onChange,
  required,
  label,
  error,
  value,
  disabled,
  className,
  minDate,
  maxDate,
  format,
  name,
  clearable = false,
  endAdornment,
  InputLabelProps,
}) => {
  const classes = useStyle();

  return (
    <MuiPickersUtilsProvider
      locale={Settings.defaultLocale}
      utils={LocalizedLuxonUtils}
    >
      <DatePicker
        className={`${className || ''} ${classes.container}`}
        clearable={clearable}
        disabled={disabled}
        error={error}
        format={format || 'D'}
        InputLabelProps={InputLabelProps}
        InputProps={{
          endAdornment,
        }}
        label={label}
        maxDate={maxDate}
        minDate={minDate}
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateInput;
