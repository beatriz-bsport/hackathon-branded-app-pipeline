import React, { JSX } from 'react';

import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import { makeStyles } from '@material-ui/core';

// @ts-expect-error
import { Moment } from '../../i18n';

type Props = {
  value: Object;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  minDate?: Object;
  maxDate?: Object;
  onChange: (value: Moment) => void;
  className?: string;
  clearable?: boolean;
  format?: string;
  endAdornment?: JSX.Element;
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
  clearable = false,
  endAdornment,
}) => {
  const classes = useStyle();

  return (
    <MuiPickersUtilsProvider
      locale={Moment.locale()}
      moment={Moment}
      utils={MomentUtils}
    >
      <DatePicker
        className={`${className || ''} ${classes.container}`}
        clearable={clearable}
        disabled={disabled}
        error={error}
        format={format || 'L'}
        InputProps={{
          endAdornment,
        }}
        label={label}
        maxDate={maxDate}
        minDate={minDate}
        onChange={onChange}
        required={required}
        value={value}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateInput;
