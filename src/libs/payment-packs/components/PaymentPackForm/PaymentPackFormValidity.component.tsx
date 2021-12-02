import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { FormikProps } from 'formik';
import { FormControlLabel, FormLabel, Grid, Radio } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Add } from '@material-ui/icons';
import {
  TextFieldEnhancedLabelWithError,
  DateField,
} from '../../../../components/forms';
import { getValidityString } from '../../utils';
import { PaymentPackFormValues } from '../../types';

type OwnProps = {
  formikProps: FormikProps<PaymentPackFormValues>;
};

type Props = OwnProps & WithTranslation;
export const PaymentPackFormValidity = (props: Props) => {
  const { t, formikProps } = props;
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
      value: 'billing',
    },
    { label: t('addPaymentPack.firstBooking'), value: 'firstBooking' },
    { label: t('addPaymentPack.attendance'), value: 'attendance' },
  ];
  return (
    <>
      <Grid container spacing={4}>
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
              formikProps.setFieldValue('validity', value);
            }}
          >
            {VALIDITY_CARD_CHOICE.map(({ value, label: l }) => (
              <div key={value}>
                <FormControlLabel
                  key={value}
                  value={value}
                  control={
                    <Radio
                      checked={`${formikProps.values.validity}` === `${value}`}
                    />
                  }
                  label={l}
                />
              </div>
            ))}
          </RadioGroup>
        </Grid>
        {formikProps.values.validity === 'slot' ? (
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

            {formikProps.values.duration_days ||
            formikProps.values.duration_months ||
            formikProps.values.duration_years ? (
              <Grid item xs={12}>
                <Typography>
                  {getValidityString(
                    formikProps.values.duration_days,
                    formikProps.values.duration_months,
                    formikProps.values.duration_years,
                    t,
                  )}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <RadioGroup
                name="start_date_method"
                onChange={(_, value) => {
                  formikProps.setFieldValue('start_date_method', value);
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
                          checked={
                            `${formikProps.values.start_date_method}` ===
                            `${value}`
                          }
                        />
                      }
                      label={l}
                    />
                  </div>
                ))}
              </RadioGroup>
            </Grid>
            {formikProps.values.start_date_method === 'firstBooking' ||
            formikProps.values.start_date_method === 'attendance' ? (
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
export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackFormValidity,
);
