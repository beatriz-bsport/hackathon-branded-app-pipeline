import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
} from '@bsport/common/lib/master-data/payment-group.js';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '#src/libs/payment/utils';
import type { FeatureList } from '#src/libs/company/types';
import { UPSELL_IDENTIFIER_STRIPE_TERMINAL } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';

const PaymentMethodTypeSwitcher = (props: {
  onChange: (paymentMethodId: number) => void;
  payment_method: string;
  enabledPaymentGroupMethodIdentifier: Array<number>;
  disabled: boolean;
  onlinePaymentEnabled: boolean;
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  return (
    <RadioGroup
      aria-label="payment-method"
      className={classes.paymentMethodSelectorContainer}
      onChange={(ev) => props.onChange(parseInt(ev.target.value))}
      value={props.payment_method}
    >
      {(props.enabledPaymentGroupMethodIdentifier ?? []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
      ) && (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          label={t('paymentMethod.sepa')}
          labelPlacement="bottom"
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA}
        />
      )}
      {(props.enabledPaymentGroupMethodIdentifier ?? []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      ) && (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          label={t('paymentMethod.card')}
          labelPlacement="bottom"
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_CB}
        />
      )}
      {(props.enabledPaymentGroupMethodIdentifier ?? []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
      ) && (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          label={t('paymentMethod.bacs_debit')}
          labelPlacement="bottom"
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT}
        />
      )}
      {(props.enabledPaymentGroupMethodIdentifier ?? []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
      ) && (
        <FormControlLabel
          className={classes.paymentMethodRadio}
          control={<Radio color="primary" />}
          disabled={props.disabled}
          label={t('paymentMethod.bsportCredit')}
          labelPlacement="bottom"
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT}
        />
      )}

      {(props.enabledPaymentGroupMethodIdentifier ?? []).includes(
        PAYMENT_STRIPE_TERMINAL_FAKE,
      ) && (
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
              value={PAYMENT_STRIPE_TERMINAL_FAKE}
            />
          )}
        </FeatureListProvider>
      )}
    </RadioGroup>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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

export default PaymentMethodTypeSwitcher;
