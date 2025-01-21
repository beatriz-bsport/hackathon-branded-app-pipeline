import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';

import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import WarningIcon from '@material-ui/icons/Warning';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

import BlockIcon from '@material-ui/icons/Block';

import { FormikProps, useFormikContext } from 'formik';
import clsx from 'clsx';
import { CheckboxField } from '#src/libs/custom-form/components/GenericFormik.input';
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
  TextField,
  SwitchField,
  // @ts-expect-error
} from '#src/components/forms';

import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '#src/libs/theme/selectors';
import type {
  PaymentPackTemplate,
  PaymentPackTemplateFormValues,
} from '#src/libs/payment-packs/types';
import {
  PENALTY_MODE_FRANCHISOR_PRORATA,
  PENALTY_MODE_FRANCHISOR_BUYER,
} from '#src/libs/payment-packs/constants';
import { ALMOST_100 } from '#src/constants';
import TooltipInfo from '#src/components/TooltipInfo.component';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

type Props = {
  initial?: PaymentPackTemplate;
  isUniversal?: boolean;
};

export const PaymentPackFormGeneral: React.FC<Props> = ({
  initial,
  isUniversal,
}) => {
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

  const handleCreditNumberChange = React.useCallback(
    (_, value) => {
      if (value === 'limited') {
        setFieldValue('unlimited', false);
        setFieldValue('theorical_margin_value', 0);
      } else {
        setFieldValue('unlimited', true);
      }
      setFieldValue('credit_number', value);
    },
    [setFieldValue],
  );

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
      {initial && initial?.editable === false ? (
        <Grid item xs={12}>
          <div className={classes.row}>
            <WarningIcon color="error" />
            <Typography color="error" variant="body1">
              {t('paymentPackTemplate.form.notEditable')}
            </Typography>
          </div>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <div className={classes.infoText}>
          <InfoIcon className={classes.icon} />
          <Typography className={classes.title} variant="h6">
            {t('addPaymentPack.generalInfo')}
          </Typography>
          {!!isUniversal && (
            <TooltipInfo
              helpText={t('paymentPackTemplate.form.universalPassTooltip')}
            />
          )}
        </div>
      </Grid>
      <Grid item xs={12}>
        <TextFieldEnhancedLabelWithError
          fullWidth
          required
          helperText={t('addPaymentPack.namePaymentPack')}
          id="textfield_template_title"
          label={t('addPaymentPack.name')}
          name="name"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          id="textfield_template_description"
          label={t('addPaymentPack.description')}
          minRows={6}
          name="description"
          variant="outlined"
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <PriceField
            fullWidth
            required
            disabled={initial && initial?.editable === false}
            helperText={t('form.paymentPack.priceIncludingTax.helperText')}
            id="textfield_template_price"
            label={t('form.paymentPack.priceIncludingTax.label')}
            name="price"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            disabled={initial && initial?.editable === false}
            InputProps={{
              inputProps: { min: 0, max: ALMOST_100, step: 0.005 },
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
            label={t('form.paymentPack.tax.label')}
            max={ALMOST_100}
            name="tax"
            type="number"
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {!isUniversal && (
          <RadioGroup name="credit_number" onChange={handleCreditNumberChange}>
            <FormLabel>{t('addPaymentPack.numberOfCredit')}</FormLabel>
            {CREDIT_NUMBER_CHOICE.map(({ value, label: l }) => (
              <div key={value}>
                <FormControlLabel
                  key={value}
                  control={
                    <Radio
                      checked={`${values.credit_number}` === `${value}`}
                      disabled={initial && initial?.editable === false}
                    />
                  }
                  label={l}
                  value={value}
                />
              </div>
            ))}
          </RadioGroup>
        )}
      </Grid>
      {values.credit_number === 'limited' ? (
        <>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              required
              disabled={initial && initial?.editable === false}
              helperText={
                isUniversal
                  ? t('universalPass.add.helperText')
                  : t('addPaymentPack.numberOfAvailableCredits')
              }
              id="textfield_credit"
              label={
                isUniversal
                  ? t('universalPass.add.credit')
                  : t('addPaymentPack.credit')
              }
              name="credits"
              type="number"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            {initial && initial.credits !== values.credits ? (
              <div className={classes.creditWarning}>
                <WarningIcon color="error" />
                <Typography color="error" variant="body2">
                  {t('addPaymentPack.creditWarning')}
                </Typography>
              </div>
            ) : null}
          </Grid>
        </>
      ) : (
        <>
          <Grid item md={6} xs={12}>
            <PriceField
              fullWidth
              required
              disabled={initial && initial?.editable === false}
              helperText={t('addPaymentPack.marginalContributionHelperText', {
                currencyDisplay: getCurrencyDisplay(),
              })}
              id="textfield_pass_marginal_contribution"
              label={t('addPaymentPack.marginalContribution')}
              name="theorical_margin_value"
            />
          </Grid>
          {/* @ts-expect-error */}
          <Grid item md={6} xs={0} />
        </>
      )}
      {!isUniversal && (
        <>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <div className={classes.row}>
                <SwitchField
                  disabled={
                    values.credit_number === 'limited' ||
                    (initial && initial?.editable === false)
                  }
                  label={t('form.paymentPack.penalty.label')}
                  name="apply_penalties"
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
              <Typography color="textSecondary" variant="caption">
                {t('form.paymentPack.penalty.helperText')}
              </Typography>
            </Grid>
          </Grid>
          <Collapse
            className={classes.penaltyContainer}
            in={values.credit_number === 'unlimited' && values.apply_penalties}
          >
            <Grid item xs={12}>
              <Divider
                className={clsx(classes.divider, {
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
                color="textSecondary"
                variant="body1"
              >
                {t('form.paymentPack.penalty.titleCheckbox')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.row}>
                <CheckboxField
                  disabled={initial && initial?.editable === false}
                  label={t('form.paymentPack.penalty.cancellationsCheckbox')}
                  name="penalty_active"
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.row}>
                <CheckboxField
                  disabled={initial && initial?.editable === false}
                  label={t('form.paymentPack.penalty.noShowCheckbox')}
                  name="no_show_penalty_active"
                />
              </div>
            </Grid>
            {/* @ts-expect-error */}
            <Collapse in={errors.apply_penalties}>
              <Alert className={classes.alertContainer} severity="error">
                {t(errors.apply_penalties)}
              </Alert>
            </Collapse>
            <Collapse
              in={values.no_show_penalty_active || values.penalty_active}
            >
              <Grid item xs={12}>
                <Typography
                  className={classes.marginTop}
                  color="textSecondary"
                  variant="body1"
                >
                  {t('form.paymentPack.penalty.penaltyParams')}
                </Typography>
              </Grid>
            </Collapse>
            <Collapse in={values.penalty_active}>
              <Grid container className={classes.marginTop} spacing={4}>
                <>
                  <Grid item xs={12}>
                    <Typography className={classes.bold} variant="subtitle1">
                      {t('form.paymentPack.penalty.cancellationsPenaltyTitle')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldEnhancedLabelWithError
                      fullWidth
                      required
                      disabled={initial && initial?.editable === false}
                      id="textfield_penalityNumberCancel"
                      label={t('addPaymentPack.penalityNumberCancel')}
                      name="penalty_nb_late_cancellations"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldEnhancedLabelWithError
                      fullWidth
                      required
                      disabled={initial && initial?.editable === false}
                      id="penalty_nb_days"
                      label={t('addPaymentPack.penalityNumberDay')}
                      name="penalty_nb_days"
                      type="number"
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
                            control={
                              <Radio
                                checked={
                                  `${values.penalty_kind}` === `${value}`
                                }
                                disabled={
                                  initial && initial?.editable === false
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
                  {values.penalty_kind === 'block' ? (
                    <Grid item xs={6}>
                      <TextFieldEnhancedLabelWithError
                        fullWidth
                        required
                        disabled={initial && initial?.editable === false}
                        helperText={t('addPaymentPack.penalityBlockDayHelper', {
                          penalityBlockDay: values.penalty_days_blocked,
                        })}
                        id="textfield_block"
                        label={t('addPaymentPack.penalityBlockDay')}
                        name="penalty_days_blocked"
                        type="number"
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={6}>
                      <PriceField
                        fullWidth
                        required
                        disabled={initial && initial?.editable === false}
                        helperText={t('addPaymentPack.penalityAccountHelper', {
                          penalityBlockAccount: values.penalty_account_value,
                          currencyDisplay: getCurrencyDisplay(),
                        })}
                        id="textfield_penalityAccount"
                        label={t('addPaymentPack.penalityAccountPrice')}
                        name="penalty_account_value"
                      />
                    </Grid>
                  )}
                  <Collapse in={values.penalty_kind === 'account'}>
                    <Grid item className={classes.prorataContainer} xs={12}>
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
                                control={
                                  <Radio
                                    checked={
                                      `${values.penalty_mode_franchisor}` ===
                                      `${value}`
                                    }
                                    disabled={
                                      initial && initial?.editable === false
                                    }
                                  />
                                }
                                label={l}
                                value={value}
                              />
                            </div>
                          ),
                        )}
                      </RadioGroup>
                      <Alert
                        classes={{ root: classes.alertIcon }}
                        className={classes.alert}
                        severity="info"
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
              <Grid container className={classes.marginTop} spacing={4}>
                <>
                  <Grid item xs={12}>
                    <Typography className={classes.bold} variant="subtitle1">
                      {t('form.paymentPack.penalty.noShowPenaltyTitle')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Alert className={classes.alertContainer} severity="info">
                      {t('form.paymentPack.penalty.noShowPenaltyAlert')}
                    </Alert>
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldEnhancedLabelWithError
                      fullWidth
                      required
                      disabled={initial && initial?.editable === false}
                      id="no_show_penalty_threshold"
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                      label={t('form.paymentPack.penalty.noShowPenaltyNumber')}
                      name="no_show_penalty_threshold"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldEnhancedLabelWithError
                      fullWidth
                      required
                      disabled={initial && initial?.editable === false}
                      id="no_show_penalty_time_window_days"
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                      label={t('addPaymentPack.penalityNumberDay')}
                      name="no_show_penalty_time_window_days"
                      type="number"
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
                        penalityNumberDay:
                          values.no_show_penalty_time_window_days,
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
                          control={
                            <Radio
                              checked={
                                `${values.no_show_penalty_kind}` === `${value}`
                              }
                              disabled={initial && initial?.editable === false}
                            />
                          }
                          label={l}
                          value={value}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </Grid>
                {values.no_show_penalty_kind === 'block' ? (
                  <Grid item xs={6}>
                    <TextFieldEnhancedLabelWithError
                      fullWidth
                      required
                      disabled={initial && initial?.editable === false}
                      helperText={t('addPaymentPack.penalityBlockDayHelper', {
                        penalityBlockDay: values.no_show_penalty_days_blocked,
                      })}
                      id="textfield_block_no_show"
                      label={t('addPaymentPack.penalityBlockDay')}
                      name="no_show_penalty_days_blocked"
                      type="number"
                    />
                  </Grid>
                ) : (
                  <Grid item xs={6}>
                    <PriceField
                      fullWidth
                      required
                      disabled={initial && initial?.editable === false}
                      helperText={t('addPaymentPack.penalityAccountHelper', {
                        penalityBlockAccount: values.no_show_penalty_amount,
                        currencyDisplay: getCurrencyDisplay(),
                      })}
                      id="textfield_penalityAccount_no_show"
                      label={t('addPaymentPack.penalityAccountPrice')}
                      name="no_show_penalty_amount"
                    />
                  </Grid>
                )}

                <Collapse in={values.no_show_penalty_kind === 'account'}>
                  <Grid item className={classes.prorataContainer} xs={12}>
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
                              control={
                                <Radio
                                  checked={
                                    `${values.no_show_penalty_mode_franchisor}` ===
                                    `${value}`
                                  }
                                  disabled={
                                    initial && initial?.editable === false
                                  }
                                />
                              }
                              label={l}
                              value={value}
                            />
                          </div>
                        ),
                      )}
                    </RadioGroup>
                    <Alert
                      classes={{ root: classes.alertIcon }}
                      className={classes.alert}
                      severity="info"
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
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
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
  title: { flex: '1 0 0' },
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

export default React.memo(PaymentPackFormGeneral);
