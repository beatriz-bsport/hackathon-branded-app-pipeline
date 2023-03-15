import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';

import { FormControlLabel, FormLabel, Grid, Radio } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import WarningIcon from '@material-ui/icons/Warning';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

import BlockIcon from '@material-ui/icons/Block';

import { FormikProps, useFormikContext } from 'formik';
import classNames from 'classnames';
import { CheckboxField } from '#libs/custom-form/components/GenericFormik.input';
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
  TextField,
  SwitchField,
} from '#components/forms';

import {
  PaymentPackTemplate,
  PaymentPackTemplateFormValues,
} from '../../types';
import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '#libs/theme/selectors';
import {
  PENALTY_MODE_FRANCHISOR_PRORATA,
  PENALTY_MODE_FRANCHISOR_BUYER,
} from '../../constants';

type Props = {
  initial?: PaymentPackTemplate;
};
export const PaymentPackFormGeneral = (props: Props) => {
  const { initial } = props;
  const { t } = useTranslation('paymentPack');
  const {
    values,
    setFieldValue,
    errors,
  }: FormikProps<PaymentPackTemplateFormValues> = useFormikContext();
  const classes = useStyles();

  const CREDIT_NUMBER_CHOICE = [
    { label: t('addPaymentPack.limited'), value: 'limited' },
    { label: t('addPaymentPack.unlimited'), value: 'unlimited' },
  ];

  const handleCreditNumberChange = (_, value) => {
    if (value === 'limited') {
      setFieldValue('unlimited', false);
      setFieldValue('theorical_margin_value', 0);
    } else {
      setFieldValue('unlimited', true);
    }
    setFieldValue('credit_number', value);
  };
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
  const PENALTY_MODE_FRANCHISOR_CHOICE = [
    {
      label: t('addPaymentPack.penalityModeFranchisor.prorata.label'),
      value: PENALTY_MODE_FRANCHISOR_PRORATA,
    },
    {
      label: t('addPaymentPack.penalityModeFranchisor.buyer.label'),
      value: PENALTY_MODE_FRANCHISOR_BUYER,
    },
  ];
  const NO_SHOW_PENALTY_MODE_FRANCHISOR_CHOICE = [
    {
      label: t('addPaymentPack.penalityModeFranchisor.prorataNoShow.label'),
      value: PENALTY_MODE_FRANCHISOR_PRORATA,
    },
    {
      label: t('addPaymentPack.penalityModeFranchisor.buyer.label'),
      value: PENALTY_MODE_FRANCHISOR_BUYER,
    },
  ];
  return (
    <>
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
          id="textfield_template_title"
          fullWidth
          name="name"
          required
          label={t('addPaymentPack.name')}
          helperText={t('addPaymentPack.namePaymentPack')}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <PriceField
          name="price"
          id="textfield_template_price"
          label={t('form.paymentPack.priceIncludingTax.label')}
          required
          fullWidth
          helperText={t('form.paymentPack.priceIncludingTax.helperText')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="tax"
          label={t('form.paymentPack.tax.label')}
          type="number"
          required
          fullWidth
          max={100}
          InputProps={{
            inputProps: { min: 0, max: 100, step: 0.005 },
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup name="credit_number" onChange={handleCreditNumberChange}>
          <FormLabel>{t('addPaymentPack.numberOfCredit')}</FormLabel>
          {CREDIT_NUMBER_CHOICE.map(({ value, label: l }) => (
            <div key={value}>
              <FormControlLabel
                key={value}
                value={value}
                control={
                  <Radio checked={`${values.credit_number}` === `${value}`} />
                }
                label={l}
              />
            </div>
          ))}
        </RadioGroup>
      </Grid>
      {values.credit_number === 'limited' ? (
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
          <Grid item xs={12} md={6}>
            {initial && initial.credits !== values.credits ? (
              <div className={classes.creditWarning}>
                <WarningIcon color="error" />
                <Typography variant="body2" color="error">
                  {t('addPaymentPack.creditWarning')}
                </Typography>
              </div>
            ) : null}
          </Grid>
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
              helperText={t('addPaymentPack.marginalContributionHelperText', {
                currencyDisplay: getCurrencyDisplay(),
              })}
            />
          </Grid>
          <Grid item xs={0} md={6} />
        </>
      )}
      <Grid item xs={12}>
        <Grid item xs={12}>
          <div className={classes.row}>
            <SwitchField
              name="apply_penalties"
              label={t('form.paymentPack.penalty.label')}
              disabled={values.credit_number === 'limited'}
            />
            {values.credit_number === 'limited' ? (
              <div className={classes.row}>
                <WarningIcon color="primary" />
                <Typography variant="body2">
                  {t('addPaymentPack.penalityRule')}
                </Typography>
              </div>
            ) : null}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="textSecondary">
            {t('form.paymentPack.penalty.helperText')}
          </Typography>
        </Grid>
      </Grid>
      <Collapse
        in={values.credit_number === 'unlimited' && values.apply_penalties}
        className={classes.penaltyContainer}
      >
        <Grid item xs={12}>
          <Divider
            className={classNames(classes.divider, {
              [classes.displayNone]: !values.apply_penalties,
            })}
          />
          <div className={classes.infoText}>
            <BlockIcon className={classes.icon} />
            <Typography variant="h6">
              {t('form.paymentPack.penalty.title')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography
            className={classes.marginTop}
            variant="body1"
            color="textSecondary"
          >
            {t('form.paymentPack.penalty.titleCheckbox')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.row}>
            <CheckboxField
              name="penalty_active"
              label={t('form.paymentPack.penalty.cancellationsCheckbox')}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.row}>
            <CheckboxField
              name="no_show_penalty_active"
              label={t('form.paymentPack.penalty.noShowCheckbox')}
            />
          </div>
        </Grid>

        <Collapse in={errors.apply_penalties}>
          <Alert severity="error" className={classes.alertContainer}>
            {t(errors.apply_penalties)}
          </Alert>
        </Collapse>
        <Collapse in={values.no_show_penalty_active || values.penalty_active}>
          <Grid item xs={12}>
            <Typography
              className={classes.marginTop}
              variant="body1"
              color="textSecondary"
            >
              {t('form.paymentPack.penalty.penaltyParams')}
            </Typography>
          </Grid>
        </Collapse>

        <Collapse in={values.penalty_active}>
          <Grid container spacing={4} className={classes.marginTop}>
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1" className={classes.bold}>
                  {t('form.paymentPack.penalty.cancellationsPenaltyTitle')}
                </Typography>
              </Grid>
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
              {values.penalty_nb_late_cancellations &&
              values.penalty_nb_days ? (
                <Grid item xs={12}>
                  <Typography>
                    {t('addPaymentPack.penalityInfo', {
                      penalityNumberCancel:
                        values.penalty_nb_late_cancellations,
                      penalityNumberDay: values.penalty_nb_days,
                    })}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <RadioGroup
                  name="penalty_kind"
                  onChange={(_, value) => {
                    setFieldValue('penalty_kind', value);
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
                            checked={`${values.penalty_kind}` === `${value}`}
                          />
                        }
                        label={l}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </Grid>
              {values.penalty_kind === 'block' ? (
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    id="textfield_block"
                    fullWidth
                    name="penalty_days_blocked"
                    type="number"
                    required
                    label={t('addPaymentPack.penalityBlockDay')}
                    helperText={t('addPaymentPack.penalityBlockDayHelper', {
                      penalityBlockDay: values.penalty_days_blocked,
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
                      penalityBlockAccount: values.penalty_account_value,
                      currencyDisplay: getCurrencyDisplay(),
                    })}
                  />
                </Grid>
              )}
              <Collapse in={values.penalty_kind === 'account'}>
                <Grid item xs={12} className={classes.prorataContainer}>
                  <RadioGroup
                    name="penalty_mode_franchisor"
                    onChange={(_, value) => {
                      setFieldValue(
                        'penalty_mode_franchisor',
                        parseInt(value, 10),
                      );
                    }}
                  >
                    <FormLabel>
                      {t('addPaymentPack.penalityModeFranchisor.label')}
                    </FormLabel>
                    {PENALTY_MODE_FRANCHISOR_CHOICE.map(
                      ({ value, label: l }) => (
                        <div key={value}>
                          <FormControlLabel
                            key={value}
                            value={value}
                            control={
                              <Radio
                                checked={
                                  `${values.penalty_mode_franchisor}` ===
                                  `${value}`
                                }
                              />
                            }
                            label={l}
                          />
                        </div>
                      ),
                    )}
                  </RadioGroup>
                  <Alert
                    severity="info"
                    classes={{ root: classes.alertIcon }}
                    className={classes.alert}
                  >
                    {t(
                      `addPaymentPack.penalityModeFranchisor.${
                        values.penalty_mode_franchisor ===
                        PENALTY_MODE_FRANCHISOR_BUYER
                          ? 'buyer'
                          : 'prorata'
                      }.explain`,
                      {
                        price: getCurrencyDisplayWithPrice(
                          values.penalty_account_value,
                        ),
                      },
                    )}
                  </Alert>
                </Grid>
              </Collapse>
            </>
          </Grid>
        </Collapse>
        <Collapse in={values.no_show_penalty_active}>
          <Grid container spacing={4} className={classes.marginTop}>
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1" className={classes.bold}>
                  {t('form.paymentPack.penalty.noShowPenaltyTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" className={classes.alertContainer}>
                  {t('form.paymentPack.penalty.noShowPenaltyAlert')}
                </Alert>
              </Grid>
              <Grid item xs={3}>
                <TextFieldEnhancedLabelWithError
                  id="no_show_penalty_threshold"
                  fullWidth
                  name="no_show_penalty_threshold"
                  type="number"
                  required
                  label={t('form.paymentPack.penalty.noShowPenaltyNumber')}
                />
              </Grid>
              <Grid item xs={3}>
                <TextFieldEnhancedLabelWithError
                  id="no_show_penalty_time_window_days"
                  fullWidth
                  name="no_show_penalty_time_window_days"
                  type="number"
                  required
                  label={t('addPaymentPack.penalityNumberDay')}
                />
              </Grid>
            </>
            {values.no_show_penalty_threshold &&
            values.no_show_penalty_time_window_days ? (
              <Grid item xs={12}>
                <Typography>
                  {t('form.paymentPack.penalty.noShowPenaltyInfo', {
                    count: values.no_show_penalty_threshold,
                    penalityNumberNoShow: values.no_show_penalty_threshold,
                    penalityNumberDay: values.no_show_penalty_time_window_days,
                  })}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <RadioGroup
                name="no_show_penalty_kind"
                onChange={(_, value) => {
                  setFieldValue('no_show_penalty_kind', value);
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
                            `${values.no_show_penalty_kind}` === `${value}`
                          }
                        />
                      }
                      label={l}
                    />
                  </div>
                ))}
              </RadioGroup>
            </Grid>
            {values.no_show_penalty_kind === 'block' ? (
              <Grid item xs={6}>
                <TextFieldEnhancedLabelWithError
                  id="textfield_block_no_show"
                  fullWidth
                  name="no_show_penalty_days_blocked"
                  type="number"
                  required
                  label={t('addPaymentPack.penalityBlockDay')}
                  helperText={t('addPaymentPack.penalityBlockDayHelper', {
                    penalityBlockDay: values.no_show_penalty_days_blocked,
                  })}
                />
              </Grid>
            ) : (
              <Grid item xs={6}>
                <PriceField
                  id="textfield_penalityAccount_no_show"
                  fullWidth
                  name="no_show_penalty_amount"
                  required
                  label={t('addPaymentPack.penalityAccountPrice')}
                  helperText={t('addPaymentPack.penalityAccountHelper', {
                    penalityBlockAccount: values.no_show_penalty_amount,
                    currencyDisplay: getCurrencyDisplay(),
                  })}
                />
              </Grid>
            )}

            <Collapse in={values.no_show_penalty_kind === 'account'}>
              <Grid item xs={12} className={classes.prorataContainer}>
                <RadioGroup
                  name="no_show_penalty_mode_franchisor"
                  onChange={(_, value) => {
                    setFieldValue(
                      'no_show_penalty_mode_franchisor',
                      parseInt(value, 10),
                    );
                  }}
                >
                  <FormLabel>
                    {t('addPaymentPack.penalityModeFranchisor.label')}
                  </FormLabel>
                  {NO_SHOW_PENALTY_MODE_FRANCHISOR_CHOICE.map(
                    ({ value, label: l }) => (
                      <div key={value}>
                        <FormControlLabel
                          key={value}
                          value={value}
                          control={
                            <Radio
                              checked={
                                `${values.no_show_penalty_mode_franchisor}` ===
                                `${value}`
                              }
                            />
                          }
                          label={l}
                        />
                      </div>
                    ),
                  )}
                </RadioGroup>
                <Alert
                  severity="info"
                  classes={{ root: classes.alertIcon }}
                  className={classes.alert}
                >
                  {t(
                    `addPaymentPack.penalityModeFranchisor.${
                      values.no_show_penalty_mode_franchisor ===
                      PENALTY_MODE_FRANCHISOR_BUYER
                        ? 'buyer'
                        : 'prorataNoShow'
                    }.explain`,
                    {
                      price: getCurrencyDisplayWithPrice(
                        values.no_show_penalty_amount,
                      ),
                    },
                  )}
                </Alert>
              </Grid>
            </Collapse>
          </Grid>
        </Collapse>
      </Collapse>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  helperTextError: {
    color: theme.palette.error.main,
  },
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  gridContainer: {
    margin: '0px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {
    color: '#868686',
  },
  redIcon: {
    color: 'red',
  },
  creditWarning: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    alignItems: 'center',
    position: 'relative',
    top: theme.spacing(3),
  },
  alertIcon: {
    alignItems: 'center',
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  bold: {
    fontWeight: 500,
  },
  divider: {
    backgroundColor: '#C6C6C6',
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  displayNone: {
    display: 'none',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  penaltyContainer: { padding: theme.spacing(1) },
  alertContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  prorataContainer: { margin: theme.spacing(2) },
}));

export default PaymentPackFormGeneral;
