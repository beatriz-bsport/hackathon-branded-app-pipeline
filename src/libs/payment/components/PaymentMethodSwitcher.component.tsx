// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';
import { getCurrencyCode } from '../../theme/selectors';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '#libs/payment/utils';
import type { FeatureList } from '#libs/company/types';
import { UPSELL_IDENTIFIER_STRIPE_TERMINAL } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

type OwnProps = {
  onChange: (param: string) => void;
  paymentMethod: string;
  enabledPaymentMethods: Array<number>;
  enabledPaymentGroupMethodIdentifier?: Array<number>;
  disabled: boolean;
  onlinePaymentEnabled?: boolean;
};
type Props = OwnProps;
export const PaymentMethodSwitcher: React.FC<Props> = (props) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  if (
    !(
      props.enabledPaymentMethods?.length > 1 ||
      props.enabledPaymentGroupMethodIdentifier?.length > 1
    )
  ) {
    return null;
  }

  const currency = getCurrencyCode().toLowerCase();

  return (
    <RadioGroup
      aria-label="payment-method"
      className={classes.paymentMethodSelectorContainer}
      onChange={(ev) => props.onChange(ev.target.value)}
      value={props.paymentMethod}
    >
      {(props.enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
      ) ||
      (props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      ) ? (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          label={t('paymentMethod.card')}
          labelPlacement="bottom"
          value="card"
        />
      ) : null}
      {(props.enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
      ) ||
      (props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
      ) ? (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          label={t('paymentMethod.bacs_debit')}
          labelPlacement="bottom"
          value="bacs_debit"
        />
      ) : null}
      {((props.enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
      ) ||
        (props.enabledPaymentGroupMethodIdentifier || []).includes(
          PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        )) &&
      currency === 'eur' ? (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          label={t('paymentMethod.sepa')}
          labelPlacement="bottom"
          value="sepa_debit"
        />
      ) : null}
      {(props.enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
      ) ||
      (props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
      ) ? (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled}
          label={t('paymentMethod.bsportCredit')}
          labelPlacement="bottom"
          value="bsport:credit"
        />
      ) : null}
      {((props.enabledPaymentMethods || []).includes(
        PAYMENT_STRIPE_TERMINAL_FAKE,
      ) ||
        (props.enabledPaymentGroupMethodIdentifier || []).includes(
          PAYMENT_STRIPE_TERMINAL_FAKE,
        )) && (
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <FormControlLabel
              className={classes.paymentMethodRadio}
              control={<Radio color="primary" />}
              disabled={
                props.disabled ||
                !hasUpsell(featureList, UPSELL_IDENTIFIER_STRIPE_TERMINAL)
              }
              label={t(
                'invoice:configuration.stripeTerminal.paymentDialog.radio',
              )}
              labelPlacement="bottom"
              value="terminal"
            />
          )}
        </FeatureListProvider>
      )}
    </RadioGroup>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    flexWrap: 'nowrap',
    textAlign: 'center',
  },
  paymentMethodRadio: {
    flex: 1,
  },
}));
export default PaymentMethodSwitcher;
