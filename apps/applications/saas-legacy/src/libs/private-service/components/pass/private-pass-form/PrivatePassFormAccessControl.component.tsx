import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { Alert } from '@material-ui/lab';
import KeyIcon from '@material-ui/icons/VpnKey';
import { Theme } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import { useFormikContext } from 'formik';
import { PrivatePassFormValues } from './PrivatePassForm.component';

export const PrivatePassFormAccessControl = () => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();

  const { values, setFieldValue } = useFormikContext<PrivatePassFormValues>();

  const handleGrantsDoorAccessChange = useCallback(() => {
    setFieldValue('grants_door_access', !values.grants_door_access);
  }, [setFieldValue, values.grants_door_access]);

  return (
    <Grid container id="private-pass-form-access-control-section" spacing={2}>
      <Grid item xs={12}>
        <div className={classes.infoText}>
          <KeyIcon className={classes.icon} />
          <Typography variant="h6">
            {t('privatePass.form.accessControl.doorAccess')}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          {t('privatePass.form.accessControl.accessControlInfo')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="info">
          {t('privatePass.form.accessControl.accessControlBetaAlert')}
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.row}>
          <SwitchField
            label={t('privatePass.form.accessControl.enableAccessControl')}
            name="grants_door_access"
            onChange={handleGrantsDoorAccessChange}
          />
        </div>
      </Grid>
    </Grid>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#868686',
  },
}));
export default PrivatePassFormAccessControl;
