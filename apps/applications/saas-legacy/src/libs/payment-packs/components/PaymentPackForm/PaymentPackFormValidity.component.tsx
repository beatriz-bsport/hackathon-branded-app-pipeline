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
} from '@bsport/common/lib/master-data/payment-pack.js';
import type { PrivatePass } from '#src/libs/private-service/types';
import { PaymentPack, PaymentPackFormValues } from '../../types';
import {
  TextFieldEnhancedLabelWithError,
  DateField,
  IntegerFieldEnhancedHelperTextError,
  // @ts-expect-error
} from '../../../../components/forms';
import { getValidityString } from '../../utils';

type Props = {
  initial: PaymentPack<PrivatePass>;
  disabledUniversalPassFields: boolean;
};

export const PaymentPackFormValidity = (props: Props) => {
  const { initial, disabledUniversalPassFields } = props;

  const { t } = useTranslation('paymentPack');
  const { values, setFieldValue }: FormikProps<PaymentPackFormValues> =
    useFormikContext();
  const classes = useStyles();
  const VALIDITY_CARD_CHOICE = [
    {
      label: t('addPaymentPack.availabilityGivenNumber'),
      value: 'givenNumber',
    },
    { label: t('addPaymentPack.availabilitySlot'), value: 'slot' },
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
      <Grid container id="paymentpack-form-validity-section" spacing={2}>
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
            name="validity"
            onChange={(_, value) => {
              setFieldValue('validity', value);
            }}
          >
            {VALIDITY_CARD_CHOICE.map(({ value, label: l }) => (
              <div key={value}>
                <FormControlLabel
                  key={value}
                  control={
                    <Radio
                      checked={`${values.validity}` === `${value}`}
                      disabled={
                        (initial && !initial?.editable) ||
                        (disabledUniversalPassFields && value === 'slot')
                      }
                    />
                  }
                  label={l}
                  value={value}
                />
              </div>
            ))}
          </RadioGroup>
        </Grid>
        {values.validity === 'slot' ? (
          <>
            <Grid item xs={3}>
              <DateField
                bottomError
                disabled={initial && !initial?.editable}
                label={t('addPaymentPack.fromDate')}
                name="lower_date"
              />
            </Grid>
            <Grid item xs={3}>
              <DateField
                bottomError
                disabled={initial && !initial?.editable}
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
                <IntegerFieldEnhancedHelperTextError
                  fullWidth
                  disabled={initial && !initial?.editable}
                  helperText=" "
                  id="paymentpack-form-day-validity-input"
                  label={t('addPaymentPack.dayValidity')}
                  name="duration_days"
                  type="number"
                />
                <Add />

                <IntegerFieldEnhancedHelperTextError
                  fullWidth
                  disabled={initial && !initial?.editable}
                  helperText={t('addPaymentPack.monthValidityHelper')}
                  id="paymentpack-form-month-validity-input"
                  label={t('addPaymentPack.monthValidity')}
                  name="duration_months"
                  type="number"
                />

                <Add />

                <IntegerFieldEnhancedHelperTextError
                  fullWidth
                  disabled={initial && !initial?.editable}
                  helperText={t('addPaymentPack.yearValidityHelper')}
                  id="paymentpack-form-year-validity-input"
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
                          disabled={
                            (initial && !initial?.editable) ||
                            (disabledUniversalPassFields &&
                              value === 'attendance')
                          }
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
                  disabled={initial && !initial?.editable}
                  helperText={t('addPaymentPack.expirationDateHelper')}
                  id="paymentpack-form-month-expiration-input"
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
