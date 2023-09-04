import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { makeStyles, Typography, Collapse } from '@material-ui/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import {
  PriceField,
  IntegerField,
  RadioGroupField,
  PercentField,
  SelectField,
  // @ts-expect-error
} from '#components/forms';
import {
  ReferredVoucherTypeChoices,
  ReferralTimeLimitUnits,
} from '#libs/referral/constants';
import FormSection from '#components/forms/FormSection';
import { FormikValues as EditReferralProgramFormikValues } from '../EditReferralProgramSettingsForm.component';

const EditReferralProgramSettingsFormReferredReduction: React.FC = () => {
  const { t } = useTranslation('referral');
  const classes = useStyles();
  const { values, errors } =
    useFormikContext<EditReferralProgramFormikValues>();

  const voucherTypeChoices = useMemo(
    () => [
      {
        label: t('form.amountOffReferred.percent.title'),
        value: ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_PERCENT,
      },
      {
        label: t('form.amountOffReferred.amount.title'),
        value: ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_AMOUNT,
      },
    ],
    [t],
  );

  const applicationTimeLimitUnitChoices = useMemo(
    () => [
      {
        label: t('form.applicationTimeLimit.units.day', {
          count: values?.application_time_limit_intervals,
        }),
        value: ReferralTimeLimitUnits.DAYS,
      },
      {
        label: t('form.applicationTimeLimit.units.week', {
          count: values?.application_time_limit_intervals,
        }),
        value: ReferralTimeLimitUnits.WEEKS,
      },
      {
        label: t('form.applicationTimeLimit.units.month', {
          count: values?.application_time_limit_intervals,
        }),
        value: ReferralTimeLimitUnits.MONTHS,
      },
    ],
    [t, values?.application_time_limit_intervals],
  );

  return (
    <FormSection
      noDivider
      noPadding
      sectionTitle={t('form.amountOffReferred.title')}
    >
      <div className={classes.spacingLeft}>
        <RadioGroupField
          choices={voucherTypeChoices}
          id="referred-voucher-type"
          name="referred_voucher_type"
        />
      </div>
      <div className={classes.flexColumn}>
        <Collapse
          in={
            values?.referred_voucher_type ===
            ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_PERCENT
          }
        >
          <PercentField
            className={classes.midWidth}
            id="percent-off-referred"
            label={t('form.amountOffReferred.percent.fieldLabel')}
            name="percent_off_referred"
            required={
              values?.referred_voucher_type ===
              ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_PERCENT
            }
          />
          {!!errors?.percent_off_referred && (
            <Alert severity="error">{t(errors?.percent_off_referred)}</Alert>
          )}
          {values?.percent_off_referred === 0 && (
            <Alert className={classes.alertWarning} severity="warning">
              {t('form.warnings.referredAmount')}
            </Alert>
          )}
        </Collapse>
        <Collapse
          in={
            values?.referred_voucher_type ===
            ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_AMOUNT
          }
        >
          <PriceField
            className={classes.midWidth}
            id="amount-off-referred"
            label={t('form.amountOffReferred.amount.fieldLabel')}
            name="amount_off_referred"
            required={
              values?.referred_voucher_type ===
              ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_AMOUNT
            }
          />
          {!!errors?.amount_off_referred && (
            <Alert severity="error">{t(errors?.amount_off_referred)}</Alert>
          )}
          {values?.amount_off_referred === 0 && (
            <Alert className={classes.alertWarning} severity="warning">
              {t('form.warnings.referredAmount')}
            </Alert>
          )}
        </Collapse>
      </div>
      <div className={classes.flexColumn}>
        <div
          className={classNames(classes.flexRow, classes.applicationTimeLimit)}
        >
          <Typography className={classes.applicationTimeLimitLabel}>
            {t('form.applicationTimeLimit.title')}
          </Typography>
          <IntegerField
            className={classes.applicationTimeLimitIntervals}
            id="application-time-limit-intervals"
            name="application_time_limit_intervals"
          />
          <SelectField
            choices={applicationTimeLimitUnitChoices}
            className={classes.applicationTimeLimitUnitSelector}
            id="application-time-limit-unit"
            name="application_time_limit_unit"
          />
        </div>
      </div>
      {!!errors?.application_time_limit_intervals && (
        <Alert severity="error">
          {t(errors?.application_time_limit_intervals)}
        </Alert>
      )}
    </FormSection>
  );
};

const useStyles = makeStyles((theme) => ({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },
  midWidth: {
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  applicationTimeLimit: {
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1),
    },
  },
  applicationTimeLimitLabel: {
    width: 'initial',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '0px',
    },
  },
  applicationTimeLimitIntervals: {
    width: '45px',
  },
  applicationTimeLimitUnitSelector: {
    minWidth: '125px',
    width: 'auto',
  },
  spacingLeft: {
    marginLeft: theme.spacing(1),
  },
  alertWarning: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

export default React.memo(EditReferralProgramSettingsFormReferredReduction);
