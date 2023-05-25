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
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
  RadioGroupField,
  TextField,
  // @ts-ignore
} from '../../../components/forms';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import { generateInfo, generateRecurrencyString } from '../utils';
import { InstalmentPaymentApi } from '#libs/instalment-payment-configuration/types';
import {
  CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT,
  CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT,
  ANUAL,
  DAILY,
  MONTHLY,
  WEEKLY,
} from '#libs/instalment-payment-configuration/constants';

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
        setFieldValue('number_of_billing', 1);
      } else {
        setFieldValue('number_of_billing', 12);
        setFieldValue('custom_first_instalment_enabled', false);
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
              id="name"
              fullWidth
              name="name"
              required
              label={t('form.name')}
            />
          </Grid>

          <Grid item xs={12}>
            <RadioGroup
              onChange={handlePartialPaymentChange}
              value={partial_payment_enabled}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label={t('form.partialPaymentRadio.disabled')}
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
                className={classes.radioGroup}
                name="custom_first_instalment_type"
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
              />

              {custom_first_instalment_type.toString() ===
                CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString() && (
                <TextField
                  fullWidth
                  name="custom_first_instalment_percent"
                  label={t(
                    'form.customInstalmentAmount.amountHelperText.percent',
                  )}
                  type="number"
                  required
                  max={100}
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 1 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              )}

              {values.custom_first_instalment_type.toString() ===
                CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString() && (
                <PriceField
                  fullWidth
                  name="custom_first_instalment_amount"
                  label={t(
                    'form.customInstalmentAmount.amountHelperText.amount',
                  )}
                  required
                />
              )}
            </Grid>
          )}

          {!partial_payment_enabled && (
            <>
              <Grid item xs={6}>
                {/* @ts-ignore */}
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
                      id="frequency"
                      type="number"
                      fullWidth
                      name="frequency"
                      required
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
                  id="number_of_billing"
                  type="number"
                  fullWidth
                  name="number_of_billing"
                  required
                  label={t('form.numberOfBilling')}
                />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={12}>
                <div className={classes.row}>
                  <Info color="primary" className={classes.iconUncolored} />

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
