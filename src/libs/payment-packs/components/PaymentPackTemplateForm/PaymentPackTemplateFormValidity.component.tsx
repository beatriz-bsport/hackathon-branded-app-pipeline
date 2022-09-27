import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { FormikProps, useFormikContext } from 'formik';
import { FormControlLabel, FormLabel, Grid, Radio } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Add } from '@material-ui/icons';
import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';
import { PaymentPackFormValues } from '../../types';
import {
  TextFieldEnhancedLabelWithError,
  DateField,
} from '../../../../components/forms';
import { getValidityString } from '../../utils';
import {
  VALID_BY_DURATION,
  VALID_BY_DATERANGE,
} from './PaymentPackTemplateForm.component';

export const PaymentPackFormValidity: React.FC = () => {
  const { t } = useTranslation('paymentPack');
  const { values, setFieldValue }: FormikProps<PaymentPackFormValues> =
    useFormikContext();
  const classes = useStyles();
  const VALIDITY_CARD_CHOICE = [
    {
      label: t('addPaymentPack.availabilityGivenNumber'),
      value: VALID_BY_DURATION,
    },
    { label: t('addPaymentPack.availabilitySlot'), value: VALID_BY_DATERANGE },
  ];

  const START_DATE_CHOICE = [
    {
      label: t('addPaymentPack.billing'),
      value: `${START_ON_PURCHASE}`,
    },
    {
      label: t('addPaymentPack.firstBooking'),
      value: `${START_ON_FIRST_BOOKING}`,
    },
    {
      label: t('addPaymentPack.attendance'),
      value: `${START_ON_FIRST_ATTENDANCE}`,
    },
  ];
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.infoText}>
            <DateRangeIcon className={classes.icon} />
            <Typography variant="h6">
              {t('addPaymentPack.packValidity')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <RadioGroup
            name="timeType"
            onChange={(_, value) => {
              setFieldValue('timeType', value);
            }}
          >
            {VALIDITY_CARD_CHOICE.map(({ value, label: l }) => (
              <div key={value}>
                <FormControlLabel
                  key={value}
                  value={value}
                  control={
                    <Radio checked={`${values.timeType}` === `${value}`} />
                  }
                  label={l}
                />
              </div>
            ))}
          </RadioGroup>
        </Grid>
        {values.timeType === VALID_BY_DATERANGE ? (
          <>
            <Grid item xs={3}>
              <DateField
                name="lower_date"
                label={t('addPaymentPack.fromDate')}
                parseAsString
                bottomError
              />
            </Grid>
            <Grid item xs={3}>
              <DateField
                name="upper_date"
                label={t('addPaymentPack.toDate')}
                parseAsString
                bottomError
              />
            </Grid>
            <Grid item xs={6} />
          </>
        ) : (
          <>
            <Grid item xs={12}>
              <div className={classes.row}>
                <TextFieldEnhancedLabelWithError
                  id="dayValidity"
                  fullWidth
                  type="number"
                  name="duration_days"
                  label={t('addPaymentPack.dayValidity')}
                  helperText=" "
                />

                <Add />

                <TextFieldEnhancedLabelWithError
                  id="monthValidity"
                  fullWidth
                  type="number"
                  name="duration_months"
                  label={t('addPaymentPack.monthValidity')}
                  helperText={t('addPaymentPack.monthValidityHelper')}
                />

                <Add />

                <TextFieldEnhancedLabelWithError
                  id="yearValidity"
                  fullWidth
                  type="number"
                  name="duration_years"
                  label={t('addPaymentPack.yearValidity')}
                  helperText={t('addPaymentPack.yearValidityHelper')}
                />
              </div>
            </Grid>

            {values.duration_days ||
            values.duration_months ||
            values.duration_years ? (
              <Grid item xs={12}>
                <Typography variant="body2">
                  {getValidityString(
                    values.duration_days,
                    values.duration_months,
                    values.duration_years,
                    t,
                  )}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <RadioGroup
                name="start_date_method"
                onChange={(_, value) => {
                  setFieldValue('start_date_method', value);
                }}
              >
                <FormLabel>{t('addPaymentPack.beginningDate')}</FormLabel>
                {START_DATE_CHOICE.map(({ value, label: l }) => (
                  <div key={value}>
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={
                        <Radio
                          checked={`${values.start_date_method}` === `${value}`}
                        />
                      }
                      label={l}
                    />
                  </div>
                ))}
              </RadioGroup>
            </Grid>
            {values.start_date_method === 'booking' ||
            values.start_date_method === 'attendance' ? (
              <Grid item xs={6}>
                <TextFieldEnhancedLabelWithError
                  id="textfield_expiration_date"
                  fullWidth
                  name="expiration_days_before_first_use"
                  type="number"
                  required
                  helperText={t('addPaymentPack.expirationDateHelper')}
                  label={t('addPaymentPack.expirationDate')}
                />
              </Grid>
            ) : null}
          </>
        )}
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  icon: {
    color: '#868686',
  },
}));
export default PaymentPackFormValidity;
