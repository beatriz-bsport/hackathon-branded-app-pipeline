import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
// @ts-expect-error
import { withTranslation, TFunction } from 'react-i18next';

// @ts-expect-error
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
      // @ts-expect-error
      className={classes.formControl}
      fullWidth={fullWidth}
      required={props.required}
    >
      <InputLabel shrink htmlFor="vaccination-status-helper">
        {t('common.vaccination_status')}
      </InputLabel>
      {/* @ts-expect-error */}
      <Select onChange={onChange} required={props.required} value={value}>
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

// @ts-expect-error
export default withStyles(styles)(withTranslation()(VaccinationStatusInput));
