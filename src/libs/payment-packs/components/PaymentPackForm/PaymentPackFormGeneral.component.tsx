import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';

import {
  Collapse,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import WarningIcon from '@material-ui/icons/Warning';

import { FormikProps } from 'formik';
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
  TextField,
} from '../../../../components/forms';
import PaymentPackCategorySelector from '../category/PaymentPackCategorySelector.component';

import { CheckboxField } from '#libs/custom-form/components/GenericFormik.input';
import { PaymentPackCategory, PaymentPackFormValues } from '../../types';

type OwnProps = {
  paymentPackCategories: Array<PaymentPackCategory>;
  formikProps: FormikProps<PaymentPackFormValues>;
};
type Props = OwnProps & WithTranslation;
export const PaymentPackFormGeneral = (props: Props) => {
  const { t, formikProps, paymentPackCategories } = props;

  const classes = useStyles();
  const CREDIT_NUMBER_CHOICE = [
    { label: t('addPaymentPack.limited'), value: 'limited' },
    { label: t('addPaymentPack.unlimited'), value: 'unlimited' },
  ];
  const PENALITY_TYPE_CHOICE = [
    {
      label: t('addPaymentPack.penalityBlock'),
      value: 'block',
    },
    {
      label: t('addPaymentPack.penalityAccount'),
      value: 'account',
    },
  ];
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.infoText}>
            <InfoIcon className={classes.icon} />
            <Typography variant="h6">
              {t('addPaymentPack.generalInfo')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextFieldEnhancedLabelWithError
            id="textfield_pass_title"
            fullWidth
            name="name"
            required
            label={t('addPaymentPack.name')}
            helperText={t('addPaymentPack.namePaymentPack')}
          />
        </Grid>
        <Grid item xs={12}>
          <PaymentPackCategorySelector
            packPackCategoryList={paymentPackCategories}
            value={formikProps.values.category}
            nullCurrentValue={!!formikProps.values?.category}
            onChange={(item: { value: 0; label: string }) =>
              formikProps.setFieldValue('category', item ? item.value : null)
            }
            isClearable
            closeMenuOnSelect
            noMulti
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PriceField
            name="price"
            id="textfield_pass_price"
            label={t('form.paymentPack.priceIncludingTax.label')}
            required
            fullWidth
            helperText={t('form.paymentPack.priceIncludingTax.helperText')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="tax"
            id="textfield_pass_VAT"
            label={t('form.paymentPack.tax.label')}
            type="number"
            required
            fullWidth
            max={100}
            InputProps={{
              inputProps: { min: 0, max: 100, step: 0.005 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <RadioGroup
            name="credit_number"
            onChange={(_, value) => {
              if (value === 'limited') {
                formikProps.setFieldValue('penalty_active', false);
              }
              formikProps.setFieldValue('credit_number', value);
            }}
          >
            <FormLabel>{t('addPaymentPack.numberOfCredit')}</FormLabel>
            {CREDIT_NUMBER_CHOICE.map(({ value, label: l }) => (
              <div key={value}>
                <FormControlLabel
                  key={value}
                  value={value}
                  control={
                    <Radio
                      checked={
                        `${formikProps.values.credit_number}` === `${value}`
                      }
                    />
                  }
                  label={l}
                />
              </div>
            ))}
          </RadioGroup>
        </Grid>
        {formikProps.values.credit_number === 'limited' ? (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                name="credits"
                id="textfield_credit"
                label={t('addPaymentPack.credit')}
                type="number"
                required
                fullWidth
                helperText={t('addPaymentPack.numberOfAvailableCredits')}
              />
            </Grid>
            <Grid item xs={0} md={6} />
          </>
        ) : (
          <>
            <Grid item xs={12} md={6}>
              <PriceField
                name="theorical_margin_value"
                id="textfield_pass_marginal_contribution"
                label={t('addPaymentPack.marginalContribution')}
                required
                fullWidth
                helperText={t('addPaymentPack.marginalContributionHelperText')}
              />
            </Grid>
            <Grid item xs={0} md={6} />
          </>
        )}
        <Grid item xs={12}>
          <div className={classes.penality}>
            <CheckboxField
              name="penalty_active"
              label={t('addPaymentPack.penality')}
              disabled={formikProps.values.credit_number === 'limited'}
            />
            {formikProps.values.credit_number === 'limited' ? (
              <>
                <WarningIcon color="primary" />
                <Typography>{t('addPaymentPack.penalityRule')}</Typography>
              </>
            ) : null}
          </div>
        </Grid>
        <Collapse in={formikProps.values.penalty_active}>
          <Grid container spacing={4} className={classes.gridContainer}>
            <>
              <Grid item xs={3}>
                <TextFieldEnhancedLabelWithError
                  id="textfield_penalityNumberCancel"
                  fullWidth
                  name="penalty_nb_late_cancellations"
                  type="number"
                  required
                  label={t('addPaymentPack.penalityNumberCancel')}
                />
              </Grid>
              <Grid item xs={3}>
                <TextFieldEnhancedLabelWithError
                  id="penalty_nb_days"
                  fullWidth
                  name="penalty_nb_days"
                  type="number"
                  required
                  label={t('addPaymentPack.penalityNumberDay')}
                />
              </Grid>
              {formikProps.values.penalty_nb_late_cancellations &&
              formikProps.values.penalty_nb_days ? (
                <Grid item xs={12}>
                  <Typography>
                    {t('addPaymentPack.penalityInfo', {
                      penalityNumberCancel:
                        formikProps.values.penalty_nb_late_cancellations,
                      penalityNumberDay: formikProps.values.penalty_nb_days,
                    })}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <RadioGroup
                  name="penalty_kind"
                  onChange={(_, value) => {
                    formikProps.setFieldValue('penalty_kind', value);
                  }}
                >
                  <FormLabel>{t('addPaymentPack.penalityType')}</FormLabel>
                  {PENALITY_TYPE_CHOICE.map(({ value, label: l }) => (
                    <div key={value}>
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={
                          <Radio
                            checked={
                              `${formikProps.values.penalty_kind}` ===
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
              {formikProps.values.penalty_kind === 'block' ? (
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    id="textfield_block"
                    fullWidth
                    name="penalty_days_blocked"
                    type="number"
                    required
                    label={t('addPaymentPack.penalityBlockDay')}
                    helperText={t('addPaymentPack.penalityBlockDayHelper', {
                      penalityBlockDay: formikProps.values.penalty_days_blocked,
                    })}
                  />
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <PriceField
                    id="textfield_penalityAccount"
                    fullWidth
                    name="penalty_account_value"
                    required
                    label={t('addPaymentPack.penalityAccountPrice')}
                    helperText={t('addPaymentPack.penalityAccountHelper', {
                      penalityBlockAccount:
                        formikProps.values.penalty_account_value,
                    })}
                  />
                </Grid>
              )}
            </>
          </Grid>
        </Collapse>
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
  gridContainer: {
    margin: '0px',
  },
  penality: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {
    color: '#868686',
  },
}));

export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackFormGeneral,
);
