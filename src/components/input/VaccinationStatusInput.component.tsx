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

const styles = (theme) => ({
  formControl: {
    minWidth: 200,
    marginTop: theme.spacing(2),
  },
});

type Props = {
  classes: Object;
  t: TFunction;
  onChange: (v: string) => void;
  value: string;
  fullWidth?: boolean;
  required?: boolean;
};

export function VaccinationStatusInput(props: Props) {
  const { t, value, onChange, classes, fullWidth } = props;
  return (
    <FormControl
      required={props.required}
      className={classes.formControl}
      fullWidth={fullWidth}
    >
      <InputLabel shrink htmlFor="vaccination-status-helper">
        {t('common.vaccination_status')}
      </InputLabel>
      <Select required={props.required} value={value} onChange={onChange}>
        <MenuItem key="true" value="true">
          <Typography align="left">{t('common.vaccinationDone')}</Typography>
        </MenuItem>
        <MenuItem key="M" value="false">
          <Typography align="left">{t('common.vaccinationNotDone')}</Typography>
        </MenuItem>
        <MenuItem key="null" value="null">
          <Typography align="left">
            {t('common.vaccinationDontWantToCommunicate')}
          </Typography>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

VaccinationStatusInput.defaultProps = { fullWidth: false };

export default withStyles(styles)(withTranslation()(VaccinationStatusInput));
