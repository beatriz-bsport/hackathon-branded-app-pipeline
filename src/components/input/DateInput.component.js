// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

import { Moment } from '../../i18n';

type Props = {
  classes: Object,
  value: Object,
  label: ?string,
  disabled: ?boolean,
  error: ?boolean,
  required: ?boolean,
  minDate: ?Object,
  onChange: (value: Object) => void,
  className: string,
};

const styles = () => ({
  container: {
    width: 200,
  },
});

export function DateInput(props: Props) {
  const {
    onChange,
    required,
    label,
    error,
    value,
    disabled,
    classes,
    className,
    minDate,
  } = props;

  return (
    <MuiPickersUtilsProvider
      utils={MomentUtils}
      moment={Moment}
      locale={Moment.locale()}
    >
      <DatePicker
        format="DD/MM/YYYY"
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        minDate={minDate}
        label={label}
        error={error}
        className={`${className || ''} ${classes.container}`}
      />
    </MuiPickersUtilsProvider>
  );
}

export default withStyles(styles)(DateInput);
