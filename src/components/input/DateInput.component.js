// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';

import DatePicker from 'material-ui-pickers/DatePicker';

type Props = {
  value: Object,
  label: ?string,
  disabled: ?boolean,
  onChange: (value: Object) => void,
};

const styles = (theme) => ({
  container: {
    width: 200,
  },
});

export function DateInput(props: Props) {
  const { onChange, label, value, disabled, classes } = props;
  return (
    <DatePicker
      format="DD/MM/YYYY"
      value={value}
      disabled={disabled}
      onChange={onChange}
      label={label}
      className={classes.container}
    />
  );
}

export default withStyles(styles)(DateInput);
