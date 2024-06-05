import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Typography } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { useFormikContext } from 'formik';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import { InstalmentPaymentApi } from '#libs/instalment-payment-configuration/types';
import {
  CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT,
  CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT,
  ANUAL,
  DAILY,
  MONTHLY,
  WEEKLY,
} from '#libs/instalment-payment-configuration/constants';
import { generateInfo, generateRecurrencyString } from '../utils';
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
  RadioGroupField,
  TextField,
  // @ts-expect-error
} from '../../../components/forms';

export const InstalmentPaymentGeneralInfoForm: React.FC = () => {
  const { t } = useTranslation('instalmentPayment');
  const classes = useStyles();
  const { values, setFieldValue } = useFormikContext<InstalmentPaymentApi>();
  const {
    recurrency,
    frequency,
    number_of_billing,
    partial_payment_enabled,
    custom_first_instalment_type,
  } = values;

  const RECURRENCY_OPTIONS = [
    { value: DAILY, label: t('form.recurrency.daily') },
    { value: WEEKLY, label: t('form.recurrency.weekly') },
    { value: MONTHLY, label: t('form.recurrency.montly') },
    { value: ANUAL, label: t('form.recurrency.annual') },
  ];

  const handlePartialPaymentChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPartialPaymentEnabledValue = event.target.value === 'true';
      setFieldValue('partial_payment_enabled', newPartialPaymentEnabledValue);

      if (newPartialPaymentEnabledValue) {
        setFieldValue('number_of_billing', 1, false);
      } else {
        setFieldValue('number_of_billing', 12, false);
        setFieldValue('custom_first_instalment_enabled', false, false);
      }
    },
    [setFieldValue],
  );

  return (
    <>
      <div className={classes.paddingBottom}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div className={classes.row}>
              <div className={classes.icon}>
                <Info />
              </div>
              <Typography variant="h6">{t('form.generalInfo')}</Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextFieldEnhancedLabelWithError
              fullWidth
              required
              id="name"
              label={t('form.name')}
              name="name"
            />
          </Grid>

          <Grid item xs={12}>
            <RadioGroup
              onChange={handlePartialPaymentChange}
              value={partial_payment_enabled}
            >
              <FormControlLabel
                control={<Radio />}
                label={t('form.partialPaymentRadio.disabled')}
                value={false}
              />
              <FormControlLabel
                value
                control={<Radio />}
                label={t('form.partialPaymentRadio.enabled.label')}
              />
              <FormHelperText style={{ marginTop: -8 }}>
                {t('form.partialPaymentRadio.enabled.helperText')}
              </FormHelperText>
            </RadioGroup>
          </Grid>

          {partial_payment_enabled && (
            <Grid item xs={12}>
              <RadioGroupField
                choices={[
                  {
                    label: t('form.customInstalmentAmount.type.amount'),
                    value: CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString(),
                  },
                  {
                    label: t('form.customInstalmentAmount.type.percent'),
                    value: CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString(),
                  },
                ]}
                className={classes.radioGroup}
                name="custom_first_instalment_type"
              />

              {custom_first_instalment_type.toString() ===
                CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString() && (
                <TextField
                  fullWidth
                  required
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 1 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  label={t(
                    'form.customInstalmentAmount.amountHelperText.percent',
                  )}
                  max={100}
                  name="custom_first_instalment_percent"
                  type="number"
                />
              )}

              {values.custom_first_instalment_type.toString() ===
                CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString() && (
                <PriceField
                  fullWidth
                  required
                  label={t(
                    'form.customInstalmentAmount.amountHelperText.amount',
                  )}
                  name="custom_first_instalment_amount"
                />
              )}
            </Grid>
          )}

          {!partial_payment_enabled && (
            <>
              <Grid item xs={6}>
                <MaterialUiSingleSelectorField
                  inScrollBar
                  name="recurrency"
                  options={RECURRENCY_OPTIONS}
                  title={
                    <Typography variant="subtitle1">
                      {t('form.recurrency.title')}
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={12}>
                <div className={classes.rowWithGap}>
                  <Typography>{t('form.frequency.start')}</Typography>

                  <div className={classes.shrink}>
                    <TextFieldEnhancedLabelWithError
                      fullWidth
                      required
                      id="frequency"
                      name="frequency"
                      type="number"
                      variant="outlined"
                    />
                  </div>
                  <Typography>
                    {generateRecurrencyString(t, recurrency, 2)}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  required
                  id="number_of_billing"
                  label={t('form.numberOfBilling')}
                  name="number_of_billing"
                  type="number"
                />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={12}>
                <div className={classes.row}>
                  <Info className={classes.iconUncolored} color="primary" />

                  <Typography variant="body2">
                    {generateInfo(t, recurrency, frequency, number_of_billing)}
                  </Typography>
                </div>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  shrink: {
    width: theme.spacing(8),
    minWidth: theme.spacing(8),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  rowWithGap: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  iconUncolored: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 500,
  },
  padding: {
    padding: theme.spacing(4),
  },
  paddingBottom: {
    paddingBottom: theme.spacing(4),
  },
}));
export default InstalmentPaymentGeneralInfoForm;
