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
import { TextFieldEnhancedLabelWithError, DateField } from '#components/forms';
import { PaymentPackFormValues } from '../../types';
// @ts-expect-error
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
                  control={
                    <Radio checked={`${values.timeType}` === `${value}`} />
                  }
                  label={l}
                  value={value}
                />
              </div>
            ))}
          </RadioGroup>
        </Grid>
        {values.timeType === VALID_BY_DATERANGE ? (
          <>
            <Grid item xs={3}>
              <DateField
                bottomError
                parseAsString
                label={t('addPaymentPack.fromDate')}
                name="lower_date"
              />
            </Grid>
            <Grid item xs={3}>
              <DateField
                bottomError
                parseAsString
                label={t('addPaymentPack.toDate')}
                name="upper_date"
              />
            </Grid>
            <Grid item xs={6} />
          </>
        ) : (
          <>
            <Grid item xs={12}>
              <div className={classes.row}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  helperText=" "
                  id="dayValidity"
                  label={t('addPaymentPack.dayValidity')}
                  name="duration_days"
                  type="number"
                />

                <Add />

                <TextFieldEnhancedLabelWithError
                  fullWidth
                  helperText={t('addPaymentPack.monthValidityHelper')}
                  id="monthValidity"
                  label={t('addPaymentPack.monthValidity')}
                  name="duration_months"
                  type="number"
                />

                <Add />

                <TextFieldEnhancedLabelWithError
                  fullWidth
                  helperText={t('addPaymentPack.yearValidityHelper')}
                  id="yearValidity"
                  label={t('addPaymentPack.yearValidity')}
                  name="duration_years"
                  type="number"
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
                      control={
                        <Radio
                          checked={`${values.start_date_method}` === `${value}`}
                        />
                      }
                      label={l}
                      value={value}
                    />
                  </div>
                ))}
              </RadioGroup>
            </Grid>
            {values.start_date_method === `${START_ON_FIRST_BOOKING}` ||
            values.start_date_method === `${START_ON_FIRST_ATTENDANCE}` ? (
              <Grid item xs={6}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  required
                  helperText={t('addPaymentPack.expirationDateHelper')}
                  id="textfield_expiration_date"
                  label={t('addPaymentPack.expirationDate')}
                  name="expiration_days_before_first_use"
                  type="number"
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
