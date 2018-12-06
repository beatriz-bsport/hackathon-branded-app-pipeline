// @flow
import React from 'react';

import {
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

const styles = () => ({
  formControl: {
    minWidth: 200,
  },
});

type Props = {
  classes: Object,
  t: TFunction,
  onChange: (string) => void,
  value: string,
};

export function GenderInput(props: Props) {
  const { t, value, onChange, classes } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink htmlFor="gender-helper">
        {t('form.gender')}
      </InputLabel>
      <Select value={value} onChange={onChange}>
        <MenuItem key="F" value="F">
          {t('common.female')}
        </MenuItem>
        <MenuItem key="M" value="M">
          {t('common.male')}
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default withStyles(styles)(translate()(GenderInput));
