import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ButtonBase, Collapse, Grid, Typography } from '@material-ui/core';
import { useFormikContext, FormikProps } from 'formik';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { PaymentPack, PaymentPackFormValues } from '../../types';
import {
  TextFieldEnhancedLabelWithError,
  SwitchField,
} from '../../../../components/forms';
import { CheckboxField } from '#libs/custom-form/components/GenericFormik.input';
import type { PrivatePass } from '#libs/private-service/types';
import { getCurrencyDisplay } from '#libs/theme/selectors';

type Props = {
  initial: PaymentPack<PrivatePass>;
};
export const PaymentPackFormRestrictions = (props: Props) => {
  const { initial } = props;
  const { t } = useTranslation('paymentPack');
  const [openVodOptions, setOpenVodOptions] = useState<boolean>(
    !!initial?.full_vod_access,
  );
  const classes = useStyles();

  const { values }: FormikProps<PaymentPackFormValues> = useFormikContext();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.infoText}>
            <CancelIcon className={classes.icon} />
            <Typography variant="h6">
              {t('addPaymentPack.restriction')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max_bookings_per_day"
            fullWidth
            type="number"
            name="max_bookings_per_day"
            label={t('addPaymentPack.maxUseDay')}
            helperText={t('addPaymentPack.maxUseHelper')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max_bookings_per_week"
            fullWidth
            type="number"
            name="max_bookings_per_week"
            label={t('addPaymentPack.maxUseWeek')}
            helperText={t('addPaymentPack.maxUseHelper')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max_bookings_per_month"
            fullWidth
            type="number"
            name="max_bookings_per_month"
            label={t('addPaymentPack.maxUseMonth')}
            helperText={t('addPaymentPack.maxUseHelper')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max_purchase_per_member"
            fullWidth
            type="number"
            name="max_purchase_per_member"
            label={t('addPaymentPack.maxUseMember')}
            helperText={t('addPaymentPack.maxUseHelper')}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.switch}>
            <div className={classes.row}>
              <SwitchField
                name="new_member_only"
                label={t('addPaymentPack.newClientOnly')}
                disabled={values.manager_only}
                helperText={t('member:forms.newMemberOnlyHelperText', {
                  currency: getCurrencyDisplay(),
                })}
              />
            </div>

            <div className={classes.row}>
              <SwitchField
                name="manager_only"
                label={t('form.paymentPack.managerOnly')}
              />
            </div>

            <div className={classes.row}>
              <SwitchField
                name="onsite_payment_available"
                disabled={values.manager_only}
                label={t('addPaymentPack.inShopPayment')}
              />
            </div>

            <div className={classes.row}>
              <SwitchField
                name="unusable_by_staff"
                label={t('addPaymentPack.unusableByStaff')}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <ButtonBase
            onClick={() => setOpenVodOptions(!openVodOptions)}
            className={classes.infoText}
          >
            <VideoLibraryIcon className={classes.icon} />
            <Typography variant="h6">{t('addPaymentPack.vod')}</Typography>
            {openVodOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ButtonBase>
          <Collapse in={openVodOptions}>
            <div className={classes.vodSection}>
              <div className={classes.switch}>
                <CheckboxField
                  name="full_vod_access"
                  label={t('addPaymentPack.vodAccessCard')}
                />
                <Collapse in={values.full_vod_access}>
                  <CheckboxField
                    name="only_vod_access"
                    label={t('addPaymentPack.only_vod_access')}
                  />
                </Collapse>
              </div>
            </div>
          </Collapse>
        </Grid>
      </Grid>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  switch: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#868686',
  },
  vodSection: {
    paddingTop: theme.spacing(2),
  },
}));
export default PaymentPackFormRestrictions;
