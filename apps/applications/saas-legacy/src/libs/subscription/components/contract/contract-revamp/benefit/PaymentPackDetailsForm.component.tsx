import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InfoIcon from '@material-ui/icons/Info';
import BlockIcon from '@material-ui/icons/Block';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

import {
  Collapse,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import WarningIcon from '@material-ui/icons/Warning';

import { FormikProps, useFormikContext } from 'formik';
import { Alert } from '@material-ui/lab';

import { CheckboxField } from '#src/libs/custom-form/components/GenericFormik.input';
import {
  provincialTaxHelperText,
  getDecimalCreditHelperText,
} from '#src/libs/theme/utils';
import type { PrivatePass } from '#src/libs/private-service/types';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import BookkeepingAccountSelector from '#src/libs/payment/components/BookkeepingAccountSelector';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import { ALMOST_100 } from '../../../../constants';
import {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '../../types';
// @ts-expect-error
import PaymentPackCategorySelector from '../category/PaymentPackCategorySelector.component';
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
  TextField,
  SwitchField,
  // @ts-expect-error
} from '../../../../components/forms';

type Props = {
  paymentPackCategories: Array<PaymentPackCategory>;
  initial?: PaymentPack<PrivatePass>;
  provincialTax: number;
  disabledUniversalPassFields: boolean;
  setDisableUniversalPassFields: (disable: boolean) => void;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
};
export const PaymentPackFormGeneral = (props: Props) => {
  const {
    paymentPackCategories,
    initial,
    provincialTax,
    disabledUniversalPassFields,
    setDisableUniversalPassFields,
    bookkeepingAccountById,
  } = props;
  const { t } = useTranslation('paymentPack');
  const {
    values,
    setFieldValue,
    setValues,
    errors,
  }: FormikProps<PaymentPackFormValues> = useFormikContext();
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
  const provincialTaxText = React.useMemo(
    () => provincialTaxHelperText(values.tax, provincialTax, t),
    [values.tax, provincialTax, t],
  );

  const is_universal_pass_value = React.useMemo(
    () => values.is_universal_pass,
    [values],
  );
  const creditHelperText = React.useMemo(
    () =>
      getDecimalCreditHelperText(
        values.credits,
        'addPaymentPack.decimalCredit.helperText',
        t,
        t('addPaymentPack.numberOfAvailableCredits'),
      ),
    [values.credits, t],
  );
  React.useEffect(() => {
    if (is_universal_pass_value) {
      setValues({
        ...values,
        credit_number: 'limited',
        max_bookings_per_day: 0,
        max_bookings_per_week: 0,
        max_bookings_per_month: 0,
        validity: 'givenNumber',
        full_vod_access: true,
        only_vod_access: false,
        off_peak_active: false,
      });
      setDisableUniversalPassFields(true);
    } else {
      setDisableUniversalPassFields(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_universal_pass_value, setValues, setDisableUniversalPassFields]);

  const setBookkeepingAccount = React.useCallback(
    (bookkeepingAccountId: number) => {
      setFieldValue('bookkeeping_account', bookkeepingAccountId);
      const tax = bookkeepingAccountById[bookkeepingAccountId]?.vat_rate;
      if (tax) {
        setFieldValue('tax', tax);
      } else {
        setFieldValue('tax', initial?.tax || 0);
      }
    },
    [setFieldValue, bookkeepingAccountById, initial?.tax],
  );

  return (
    <>
      <Grid container id="paymentpack-form-general-section" spacing={2}>
        {initial && !initial?.editable ? (
          <Grid item xs={12}>
            <div className={classes.row}>
              <WarningIcon color="error" />
              <Typography color="error" variant="body1">
                {initial.template_instance
                  ? t('addPaymentPack.franchise')
                  : t('addPaymentPack.migration')}
              </Typography>
            </div>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          {initial && initial.linked_private_pass && (
            <div className={classes.infoText}>
              <WarningIcon className={classes.redIcon} />
              <Typography color="error" variant="caption">
                {t('form.paymentPack.universalPass.warningIsUniversalPass')}
              </Typography>
            </div>
          )}
          <div className={classes.infoText}>
            <InfoIcon className={classes.icon} />
            <Typography variant="h6">
              {t('addPaymentPack.generalInfo')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            required
            disabled={!!initial?.template_instance}
            helperText={t('addPaymentPack.namePaymentPack')}
            id="paymentpack-form-title-input"
            label={t('addPaymentPack.name')}
            name="name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            disabled={!!initial?.template_instance}
            id="paymentpack-form-description-input"
            label={t('addPaymentPack.description')}
            minRows={6}
            name="description"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <PaymentPackCategorySelector
            closeMenuOnSelect
            isClearable
            noMulti
            nullCurrentValue={!!values?.category}
            onChange={(item: { value: 0; label: string }) =>
              setFieldValue('category', item ? item.value : null)
            }
            packPackCategoryList={paymentPackCategories}
            value={values.category}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <PriceField
            fullWidth
            required
            disabled={initial && !initial?.editable}
            helperText={t('form.paymentPack.priceIncludingTax.helperText')}
            id="paymentpack-form-price-input"
            label={t('form.paymentPack.priceIncludingTax.label')}
            name="price"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BookkeepingAccountSelector
            bookkeepingAccountById={bookkeepingAccountById}
            bookkeepingAccounts={props.bookkeepingAccounts}
            selectedBookkeepingAccountId={values.bookkeeping_account}
            setFieldValue={setBookkeepingAccount}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            required
            disabled={
              (initial && !initial?.editable) || !!values.bookkeeping_account
            }
            FormHelperTextProps={{ classes: { root: classes.helperTextError } }}
            helperText={provincialTaxText}
            id="paymentpack-form-vat-input"
            InputProps={{
              inputProps: { min: 0, max: ALMOST_100, step: 0.005 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            label={t('form.paymentPack.tax.label')}
            max={ALMOST_100}
            name="tax"
            type="number"
          />
        </Grid>
        <Grid item id="is-universal-pass-grid" md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <SwitchField
              disabled={!!initial?.id}
              label={t('form.paymentPack.universalPass.label')}
              name="is_universal_pass"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography color="textSecondary" variant="caption">
              {t('form.paymentPack.universalPass.helperText')}
            </Typography>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <SwitchField
              label={t('form.paymentPack.highlightedAsRecommended.label')}
              name="highlighted_as_recommended"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography color="textSecondary" variant="caption">
              {t('form.paymentPack.highlightedAsRecommended.helperText')}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <RadioGroup
            name="credit_number"
            onChange={(_, value) => {
              if (value === 'limited') {
                setFieldValue('penalty_active', false);
              }
              setFieldValue('credit_number', value);
            }}
          >
            <FormLabel className={classes.radioGroupLabel}>
              {t('addPaymentPack.numberOfCredit')}
            </FormLabel>
            {CREDIT_NUMBER_CHOICE.map(({ value, label: l }) => (
              <div key={value}>
                <FormControlLabel
                  key={value}
                  control={
                    <Radio
                      checked={`${values.credit_number}` === `${value}`}
                      disabled={
                        (initial && !initial?.editable) ||
                        (disabledUniversalPassFields && value === 'unlimited')
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
        {values.credit_number === 'limited' ? (
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                disabled={initial && !initial?.editable}
                helperText={creditHelperText}
                id="paymentpack-form-credit-input"
                label={t('addPaymentPack.credit')}
                name="credits"
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
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
                disabled={initial && !initial?.editable}
                helperText={t('addPaymentPack.marginalContributionHelperText', {
                  currencyDisplay: getCurrencyDisplay(),
                })}
                id="paymentpack-form-margin-input"
                label={t('addPaymentPack.marginalContribution')}
                name="theorical_margin_value"
              />
            </Grid>
            {/* @ts-expect-error */}
            <Grid item md={6} xs={0} />
          </>
        )}
        <Grid item xs={12}>
          <Grid item xs={12}>
            <div className={classes.row} id="paymentpack-form-penalty-switch">
              <SwitchField
                disabled={
                  values.credit_number === 'limited' ||
                  (initial && !initial?.editable)
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
                disabled={initial && !initial?.editable}
                // @ts-expect-error
                id="paymentpack-form-penalty-cancellations-checkbox"
                label={t('form.paymentPack.penalty.cancellationsCheckbox')}
                name="penalty_active"
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.row}>
              <CheckboxField
                disabled={initial && !initial?.editable}
                // @ts-expect-error
                id="paymentpack-form-penalty-noshow-checkbox"
                label={t('form.paymentPack.penalty.noShowCheckbox')}
                name="no_show_penalty_active"
              />
            </div>
          </Grid>
          {/* @ts-expect-error */}
          <Collapse in={errors.apply_penalties}>
            <Alert className={classes.alert} severity="error">
              {t(errors.apply_penalties)}
            </Alert>
          </Collapse>
          <Collapse in={values.no_show_penalty_active || values.penalty_active}>
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
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    fullWidth
                    required
                    disabled={initial && !initial?.editable}
                    id="paymentpack-form-penality-cancellations-input"
                    label={t('addPaymentPack.penalityNumberCancel')}
                    name="penalty_nb_late_cancellations"
                    type="number"
                  />
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    fullWidth
                    required
                    disabled={initial && !initial?.editable}
                    id="paymentpack-form-penality-days-input"
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
                              checked={`${values.penalty_kind}` === `${value}`}
                              disabled={initial && !initial?.editable}
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
                      disabled={initial && !initial?.editable}
                      helperText={t('addPaymentPack.penalityBlockDayHelper', {
                        penalityBlockDay: values.penalty_days_blocked,
                      })}
                      id="paymentpack-form-penality-days-blocked-input"
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
                      disabled={initial && !initial?.editable}
                      helperText={t('addPaymentPack.penalityAccountHelper', {
                        penalityBlockAccount: values.penalty_account_value,
                        currencyDisplay: getCurrencyDisplay(),
                      })}
                      id="paymentpack-form-penality-account-input"
                      label={t('addPaymentPack.penalityAccountPrice')}
                      name="penalty_account_value"
                    />
                  </Grid>
                )}
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
                  <Alert className={classes.alert} severity="info">
                    {t('form.paymentPack.penalty.noShowPenaltyAlert')}
                  </Alert>
                </Grid>
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    fullWidth
                    required
                    disabled={initial && !initial?.editable}
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
                <Grid item xs={1} />
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    fullWidth
                    required
                    disabled={initial && !initial?.editable}
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
                          control={
                            <Radio
                              checked={
                                `${values.no_show_penalty_kind}` === `${value}`
                              }
                              disabled={initial && !initial?.editable}
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
                      disabled={initial && !initial?.editable}
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
                      disabled={initial && !initial?.editable}
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
              </>
            </Grid>
          </Collapse>
        </Collapse>
      </Grid>
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
  radioGroupLabel: {
    lineHeight: 1.5,
  },
  penaltyContainer: { padding: theme.spacing(1) },
  alert: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default PaymentPackFormGeneral;
