// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { withTranslation } from 'react-i18next';
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
  fullWidth?: boolean,
  required?: boolean,
};

export function GenderInput(props: Props) {
  const { t, value, onChange, classes, fullWidth } = props;
  return (
    <FormControl
      required={props.required}
      className={classes.formControl}
      fullWidth={fullWidth}
    >
      <InputLabel shrink htmlFor="gender-helper">
        {t('form.gender')}
      </InputLabel>
      <Select required={props.required} value={value} onChange={onChange}>
        <MenuItem key="F" value="F">
          <Typography align="left">{t('common.female')}</Typography>
        </MenuItem>
        <MenuItem key="M" value="M">
          <Typography align="left">{t('common.male')}</Typography>
        </MenuItem>
        <MenuItem key="X" value="X">
          <Typography align="left">{t('common.otherGender')}</Typography>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

GenderInput.defaultProps = { fullWidth: false };

export default withStyles(styles)(withTranslation()(GenderInput));
