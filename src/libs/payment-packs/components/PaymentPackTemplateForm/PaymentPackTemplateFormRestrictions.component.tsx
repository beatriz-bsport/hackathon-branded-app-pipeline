import React, { useState, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ButtonBase, Collapse, Grid, Typography } from '@material-ui/core';
import { useFormikContext, FormikProps } from 'formik';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import InfoIcon from '@material-ui/icons/Info';
import InputLabel from '@material-ui/core/InputLabel';
import { DateTime } from 'luxon';
import { PaymentPackFormValues, PaymentPackTemplate } from '../../types';
import {
  TextFieldEnhancedLabelWithError,
  SwitchField,
  DateField,
  // @ts-expect-error
} from '#components/forms';
import { CheckboxField } from '#libs/custom-form/components/GenericFormik.input';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import ToolTip from '#components/Tooltip.component';
import { offPeakGroupDefault } from '#libs/payment-packs/utils';
import OffPeakTimeSlotGroup from '#libs/payment-packs/components/PaymentPackForm/PaymentPackOffPeak.component';

type Props = {
  initial: PaymentPackTemplate;
};
export const PaymentPackFormRestrictions = (props: Props) => {
  const { initial } = props;
  const { t } = useTranslation('paymentPack');
  const [openVodOptions, setOpenVodOptions] = useState<boolean>(
    !!initial?.full_vod_access,
  );
  const classes = useStyles();

  const { values, setFieldValue }: FormikProps<PaymentPackFormValues> =
    useFormikContext();
  const hasMultipleGroups: boolean = values.off_peak_schedule?.length > 1;

  const handleAddGroupTimeSlot = useCallback(() => {
    const newGroup = offPeakGroupDefault();
    setFieldValue(`off_peak_schedule`, [...values.off_peak_schedule, newGroup]);
  }, [setFieldValue, values.off_peak_schedule]);

  const handleDeleteGroup = useCallback(
    (indexGroup: number) => () => {
      values.off_peak_schedule.splice(indexGroup, 1);
      setFieldValue('off_peak_schedule', values.off_peak_schedule);
    },
    [setFieldValue, values.off_peak_schedule],
  );

  const addGroupTimeSlotLabel = t(
    'addPaymentPack.offPeak.addGroupTimeSlot',
  )?.toUpperCase();

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
            fullWidth
            helperText={t('addPaymentPack.maxUseHelper')}
            id="max_bookings_per_day"
            label={t('addPaymentPack.maxUseDay')}
            name="max_bookings_per_day"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            helperText={t('addPaymentPack.maxUseHelper')}
            id="max_bookings_per_week"
            label={t('addPaymentPack.maxUseWeek')}
            name="max_bookings_per_week"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            helperText={t('addPaymentPack.maxUseHelper')}
            id="max_bookings_per_month"
            label={t('addPaymentPack.maxUseMonth')}
            name="max_bookings_per_month"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            helperText={t('addPaymentPack.maxUseHelper')}
            id="max_purchase_per_member"
            label={t('addPaymentPack.maxUseMember')}
            name="max_purchase_per_member"
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.switch}>
            <div className={classes.row}>
              <SwitchField
                disabled={values.manager_only}
                helperText={t('member:forms.newMemberOnlyHelperText', {
                  currency: getCurrencyDisplay(),
                })}
                label={t('addPaymentPack.newClientOnly')}
                name="new_member_only"
              />
            </div>

            <div className={classes.row}>
              <SwitchField
                label={t('form.paymentPack.managerOnly')}
                name="manager_only"
              />
            </div>

            <div className={classes.row}>
              <SwitchField
                disabled={values.manager_only}
                label={t('addPaymentPack.inShopPayment')}
                name="onsite_payment_available"
              />
            </div>

            <div className={classes.row}>
              <SwitchField
                label={t('addPaymentPack.unusableByStaff')}
                name="unusable_by_staff"
              />
            </div>
            <div className={classes.row}>
              <SwitchField
                label={t('addPaymentPack.expiration_date.label')}
                name="expiration_date_active"
              />
              <ToolTip title={t('addPaymentPack.expiration_date.tooltip')}>
                <InfoIcon color="disabled" />
              </ToolTip>
            </div>
            <Collapse in={values.expiration_date_active}>
              <InputLabel className={classes.inputLabelExpirationDate}>
                {t('addPaymentPack.expiration_date.helperText')}
              </InputLabel>
              <DateField
                allowNullValue
                format="D"
                minDate={DateTime.now()}
                name="expiration_date"
              />
            </Collapse>
            <div className={classes.row}>
              <SwitchField
                label={t('addPaymentPack.offPeak.label')}
                name="off_peak_active"
              />
            </div>
            <div>
              <Collapse in={values.off_peak_active}>
                {values.off_peak_schedule.map((group, index) => (
                  <OffPeakTimeSlotGroup
                    key={`${index}`}
                    group={group}
                    hasMultipleGroups={hasMultipleGroups}
                    index={index}
                    onGroupDelete={handleDeleteGroup(index)}
                    setFieldValue={setFieldValue}
                  />
                ))}
                <ButtonBase
                  className={classes.buttonAdd}
                  color="primary"
                  onClick={handleAddGroupTimeSlot}
                >
                  <AddIcon color="primary" />
                  <Typography className={classes.bold}>
                    {addGroupTimeSlotLabel}
                  </Typography>
                </ButtonBase>
              </Collapse>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <ButtonBase
            className={classes.infoText}
            onClick={() => setOpenVodOptions(!openVodOptions)}
          >
            <VideoLibraryIcon className={classes.icon} />
            <Typography variant="h6">{t('addPaymentPack.vod')}</Typography>
            {openVodOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ButtonBase>
          <Collapse in={openVodOptions}>
            <div className={classes.vodSection}>
              <div className={classes.switch}>
                <CheckboxField
                  label={t('addPaymentPack.vodAccessCard')}
                  name="full_vod_access"
                />
                <Collapse in={values.full_vod_access}>
                  <CheckboxField
                    label={t('addPaymentPack.only_vod_access')}
                    name="only_vod_access"
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
  inputLabelExpirationDate: { marginTop: theme.spacing(1), fontSize: 12 },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
    marginLeft: theme.spacing(3.5),
  },
  bold: {
    fontWeight: 500,
    fontSize: theme.spacing(1.75),
  },
}));
export default memo(PaymentPackFormRestrictions);
