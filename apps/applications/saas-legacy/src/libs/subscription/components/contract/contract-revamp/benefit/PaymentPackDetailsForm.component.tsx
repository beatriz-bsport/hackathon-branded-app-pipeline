import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { Alert } from '@material-ui/lab';
import KeyIcon from '@material-ui/icons/VpnKey';
import { Theme } from '@material-ui/core/styles';
import {
  Collapse,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import BlockIcon from '@material-ui/icons/Block';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  CheckboxField,
  SwitchField,
} from '#src/libs/custom-form/components/GenericFormik.input';
import { useFormikContext } from 'formik';
import {
  CREDIT_NUMBER_OPTION,
  FormValues,
  PaymentPackDetailsForms,
  PENALTY_TYPE_OPTION,
} from '../types';

import WarningIcon from '@material-ui/icons/Warning';

import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import { getDecimalCreditHelperText } from '#src/libs/theme/utils';
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
  TextField,
  // @ts-expect-error: import from js file
} from '#src/components/forms';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import { FeatureList } from '#src/libs/company/types';
import { hasAnyUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from '#src/libs/platform-billing/upsell-identifiers';
import { PaymentPackDetailsFormRestrictions } from './PaymentPackDetailsFormRestrictions.component';
import { SCT } from '#src/libs/category/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { emptyPaymentPackDetailsForms } from '../constants';
import { START_ON_FIRST_ATTENDANCE } from '@bsport/common/lib/master-data/payment-pack';

type Props = {
  isContractNotEditable: boolean;
  allowGuestMaster: boolean;
  initialPaymentPackDetails: PaymentPackDetailsForms;
  availableEstablishmentList: Establishment[];
  metaActivityList: MetaActivity[];
  categoryList: SCT[];
};

export const PaymentPackDetailsForm = (props: Props) => {
  const {
    isContractNotEditable,
    allowGuestMaster,
    initialPaymentPackDetails,
    availableEstablishmentList,
    metaActivityList,
    categoryList,
  } = props;
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  const CREDIT_NUMBER_CHOICE = [
    { label: t('addPaymentPack.limited'), value: CREDIT_NUMBER_OPTION.limited },
    {
      label: t('addPaymentPack.unlimited'),
      value: CREDIT_NUMBER_OPTION.unlimited,
    },
  ];
  const PENALITY_TYPE_CHOICE = [
    {
      label: t('addPaymentPack.penalityBlock'),
      value: PENALTY_TYPE_OPTION.block,
    },
    {
      label: t('addPaymentPack.penalityAccount'),
      value: PENALTY_TYPE_OPTION.account,
    },
  ];

  const { values, errors, setFieldValue } = useFormikContext<FormValues>();

  const paymentPackDetailsValues =
    values?.payment_pack_details ?? emptyPaymentPackDetailsForms;

  const creditHelperText = getDecimalCreditHelperText(
    paymentPackDetailsValues.credits ?? 0,
    'addPaymentPack.decimalCredit.helperText',
    t,
    t('addPaymentPack.numberOfAvailableCredits'),
  );

  const handleGrantsDoorAccessChange = useCallback(() => {
    const newValue = !paymentPackDetailsValues.grants_door_access;
    setFieldValue('payment_pack_details.grants_door_access', newValue);
    if (newValue) {
      setFieldValue('payment_pack_details.only_vod_access', false);
    }
  }, [setFieldValue, paymentPackDetailsValues.grants_door_access]);

  return (
    <Grid container id="paymentpackdetails-form-general" spacing={2}>
      <Grid item xs={12}>
        <RadioGroup
          name="payment_pack_details.credit_number"
          onChange={(_, value) => {
            if (value === CREDIT_NUMBER_OPTION.limited) {
              setFieldValue('payment_pack_details.penalty_active', false);
            }
            setFieldValue('payment_pack_details.credit_number', value);
          }}
        >
          <FormLabel className={classes.radioGroupLabel}>
            {t('addPaymentPack.numberOfCredit')}
          </FormLabel>
          {CREDIT_NUMBER_CHOICE.map(({ value, label }) => (
            <div key={value}>
              <FormControlLabel
                key={value}
                control={
                  <Radio
                    checked={paymentPackDetailsValues.credit_number === value}
                    disabled={isContractNotEditable}
                  />
                }
                label={label}
                value={value}
              />
            </div>
          ))}
        </RadioGroup>
      </Grid>
      {paymentPackDetailsValues.credit_number ===
      CREDIT_NUMBER_OPTION.limited ? (
        <>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              disabled={isContractNotEditable}
              helperText={creditHelperText}
              id="paymentpack-form-credit-input"
              label={t('addPaymentPack.credit')}
              name="payment_pack_details.credits"
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            {initialPaymentPackDetails?.credits !==
            paymentPackDetailsValues.credits ? (
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
              disabled={isContractNotEditable}
              helperText={t('addPaymentPack.marginalContributionHelperText', {
                currencyDisplay: getCurrencyDisplay(),
              })}
              id="paymentpack-form-margin-input"
              label={t('addPaymentPack.marginalContribution')}
              name="payment_pack_details.theorical_margin_value"
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
                paymentPackDetailsValues.credit_number ===
                  CREDIT_NUMBER_OPTION.limited || isContractNotEditable
              }
              label={t('form.paymentPack.penalty.label')}
              name="payment_pack_details.apply_penalties"
            />
            {paymentPackDetailsValues.credit_number ===
            CREDIT_NUMBER_OPTION.limited ? (
              <div className={classes.rowInLine}>
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
        in={
          paymentPackDetailsValues.credit_number ===
            CREDIT_NUMBER_OPTION.unlimited &&
          paymentPackDetailsValues.apply_penalties
        }
      >
        <Grid item xs={12}>
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
              disabled={isContractNotEditable}
              // @ts-expect-error
              id="paymentpack-form-penalty-cancellations-checkbox"
              label={t('form.paymentPack.penalty.cancellationsCheckbox')}
              name="payment_pack_details.penalty_active"
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.row}>
            <CheckboxField
              disabled={isContractNotEditable}
              // @ts-expect-error
              id="paymentpack-form-penalty-noshow-checkbox"
              label={t('form.paymentPack.penalty.noShowCheckbox')}
              name="payment_pack_details.no_show_penalty_active"
            />
          </div>
        </Grid>
        {/* @ts-expect-error */}
        <Collapse in={errors?.payment_pack_details?.apply_penalties}>
          <Alert className={classes.alert} severity="error">
            {t(errors?.payment_pack_details?.apply_penalties)}
          </Alert>
        </Collapse>
        <Collapse
          in={
            paymentPackDetailsValues.no_show_penalty_active ||
            paymentPackDetailsValues.penalty_active
          }
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
        <Collapse in={paymentPackDetailsValues.penalty_active}>
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
                  disabled={isContractNotEditable}
                  id="paymentpack-form-penality-cancellations-input"
                  label={t('addPaymentPack.penalityNumberCancel')}
                  name="payment_pack_details.penalty_nb_late_cancellations"
                  type="number"
                />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={6}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  required
                  disabled={isContractNotEditable}
                  id="paymentpack-form-penality-days-input"
                  label={t('addPaymentPack.penalityNumberDay')}
                  name="payment_pack_details.penalty_nb_days"
                  type="number"
                />
              </Grid>
              {!!paymentPackDetailsValues.penalty_nb_late_cancellations &&
              !!paymentPackDetailsValues.penalty_nb_days ? (
                <Grid item xs={12}>
                  <Typography>
                    {t('addPaymentPack.penalityInfo', {
                      penalityNumberCancel:
                        paymentPackDetailsValues.penalty_nb_late_cancellations,
                      penalityNumberDay:
                        paymentPackDetailsValues.penalty_nb_days,
                    })}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <RadioGroup
                  name="payment_pack_details.penalty_kind"
                  onChange={(_, value) => {
                    setFieldValue('payment_pack_details.penalty_kind', value);
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
                              `${paymentPackDetailsValues.penalty_kind}` ===
                              `${value}`
                            }
                            disabled={isContractNotEditable}
                          />
                        }
                        label={l}
                        value={value}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </Grid>
              {paymentPackDetailsValues.penalty_kind === 'block' ? (
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    fullWidth
                    required
                    disabled={isContractNotEditable}
                    helperText={t('addPaymentPack.penalityBlockDayHelper', {
                      penalityBlockDay:
                        paymentPackDetailsValues.penalty_days_blocked,
                    })}
                    id="paymentpack-form-penality-days-blocked-input"
                    label={t('addPaymentPack.penalityBlockDay')}
                    name="payment_pack_details.penalty_days_blocked"
                    type="number"
                  />
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <PriceField
                    fullWidth
                    required
                    disabled={isContractNotEditable}
                    helperText={t('addPaymentPack.penalityAccountHelper', {
                      penalityBlockAccount:
                        paymentPackDetailsValues.penalty_account_value,
                      currencyDisplay: getCurrencyDisplay(),
                    })}
                    id="paymentpack-form-penality-account-input"
                    label={t('addPaymentPack.penalityAccountPrice')}
                    name="payment_pack_details.penalty_account_value"
                  />
                </Grid>
              )}
            </>
          </Grid>
        </Collapse>
        <Collapse in={paymentPackDetailsValues.no_show_penalty_active}>
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
                  disabled={isContractNotEditable}
                  id="no_show_penalty_threshold"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  label={t('form.paymentPack.penalty.noShowPenaltyNumber')}
                  name="payment_pack_details.no_show_penalty_threshold"
                  type="number"
                />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={6}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  required
                  disabled={isContractNotEditable}
                  id="no_show_penalty_time_window_days"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  label={t('addPaymentPack.penalityNumberDay')}
                  name="payment_pack_details.no_show_penalty_time_window_days"
                  type="number"
                />
              </Grid>
              {paymentPackDetailsValues.no_show_penalty_threshold &&
              paymentPackDetailsValues.no_show_penalty_time_window_days ? (
                <Grid item xs={12}>
                  <Typography>
                    {t('form.paymentPack.penalty.noShowPenaltyInfo', {
                      count: paymentPackDetailsValues.no_show_penalty_threshold,
                      penalityNumberNoShow:
                        paymentPackDetailsValues.no_show_penalty_threshold,
                      penalityNumberDay:
                        paymentPackDetailsValues.no_show_penalty_time_window_days,
                    })}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <RadioGroup
                  name="payment_pack_details.no_show_penalty_kind"
                  onChange={(_, value) => {
                    setFieldValue(
                      'payment_pack_details.no_show_penalty_kind',
                      value,
                    );
                  }}
                >
                  <FormLabel>{t('addPaymentPack.penalityType')}</FormLabel>
                  {PENALITY_TYPE_CHOICE.map(({ value, label }) => (
                    <div key={value}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={
                              paymentPackDetailsValues.no_show_penalty_kind ===
                              value
                            }
                            disabled={isContractNotEditable}
                          />
                        }
                        label={label}
                        value={value}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </Grid>
              {paymentPackDetailsValues.no_show_penalty_kind === 'block' ? (
                <Grid item xs={6}>
                  <TextFieldEnhancedLabelWithError
                    fullWidth
                    required
                    disabled={isContractNotEditable}
                    helperText={t('addPaymentPack.penalityBlockDayHelper', {
                      penalityBlockDay:
                        paymentPackDetailsValues.no_show_penalty_days_blocked,
                    })}
                    id="textfield_block_no_show"
                    label={t('addPaymentPack.penalityBlockDay')}
                    name="payment_pack_details.no_show_penalty_days_blocked"
                    type="number"
                  />
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <PriceField
                    fullWidth
                    required
                    disabled={isContractNotEditable}
                    helperText={t('addPaymentPack.penalityAccountHelper', {
                      penalityBlockAccount:
                        paymentPackDetailsValues.no_show_penalty_amount,
                      currencyDisplay: getCurrencyDisplay(),
                    })}
                    id="textfield_penalityAccount_no_show"
                    label={t('addPaymentPack.penalityAccountPrice')}
                    name="payment_pack_details.no_show_penalty_amount"
                  />
                </Grid>
              )}
            </>
          </Grid>
        </Collapse>
      </Collapse>

      <Divider className={classes.divider} />

      <FeatureListProvider featureList={['paymentPackAccessControl']}>
        {(featureList: FeatureList) => {
          const hasAccessControlUpsell = hasAnyUpsell(featureList, [
            UPSELL_IDENTIFIER_KISI_INTEGRATION,
            UPSELL_IDENTIFIER_ACCESS_MONITORING,
          ]);

          const isAccessControlCompatible =
            !initialPaymentPackDetails?.template_instance ||
            (!paymentPackDetailsValues.only_vod_access &&
              paymentPackDetailsValues.start_date_method !==
                START_ON_FIRST_ATTENDANCE);

          return (
            isAccessControlCompatible &&
            hasAccessControlUpsell && (
              <>
                <div className={classes.formContainer}>
                  <Grid
                    container
                    id="paymentpack-form-access-control-section"
                    spacing={2}
                  >
                    <Grid item xs={12}>
                      <div className={classes.infoText}>
                        <KeyIcon className={classes.icon} />
                        <Typography variant="h6">
                          {t('addPaymentPack.doorAccess')}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>
                        {t('addPaymentPack.accessControlInfo')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="info">
                        {t('addPaymentPack.accessControlBetaAlert')}
                      </Alert>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.row}>
                        <SwitchField
                          label={t('addPaymentPack.enableAccessControl')}
                          name="payment_pack_details.grants_door_access"
                          onChange={handleGrantsDoorAccessChange}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </>
            )
          );
        }}
      </FeatureListProvider>

      <Divider className={classes.divider} />
      <div className={classes.formContainer}>
        <PaymentPackDetailsFormRestrictions
          allowGuestMaster={!!allowGuestMaster}
          availableEstablishmentList={availableEstablishmentList}
          categoryList={categoryList}
          initial={initialPaymentPackDetails}
          metaActivityList={metaActivityList}
        />
      </div>
      <Divider className={classes.divider} />
    </Grid>
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
  },
  rowInLine: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {
    color: '#868686',
  },
  helperTextError: {
    color: theme.palette.error.main,
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
