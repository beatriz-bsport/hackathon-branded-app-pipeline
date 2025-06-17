import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { Alert } from '@material-ui/lab';
import KeyIcon from '@material-ui/icons/VpnKey';
import { Theme } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import { useFormikContext } from 'formik';
import { PaymentPackFormValues } from '#src/libs/payment-packs/types';

export const PaymentPackFormAccessControl = () => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  const { values, setFieldValue } = useFormikContext<PaymentPackFormValues>();

  const handleGrantsDoorAccessChange = useCallback(() => {
    const newValue = !values.grants_door_access;
    setFieldValue('grants_door_access', newValue);
    if (newValue) {
      setFieldValue('only_vod_access', false);
    }
  }, [setFieldValue, values.grants_door_access]);

  return (
    <Grid container id="paymentpack-form-access-control-section" spacing={2}>
      <Grid item xs={12}>
        <div className={classes.infoText}>
          <KeyIcon className={classes.icon} />
          <Typography variant="h6">{t('addPaymentPack.doorAccess')}</Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography>{t('addPaymentPack.accessControlInfo')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="info">
          {t('addPaymentPack.accessControlBetaAlert')}
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.row}>
          <SwitchField
            label={t('addPaymentPack.enableAccessControl')}
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
export default PaymentPackFormAccessControl;
