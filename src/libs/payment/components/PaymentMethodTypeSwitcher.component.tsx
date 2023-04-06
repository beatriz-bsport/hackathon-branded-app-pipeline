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
} from '@bsport/common/lib/master-data/payment-group';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc.js';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '#libs/payment/utils';
import type { FeatureList } from '#libs/company/types';
import { UPSELL_IDENTIFIER_STRIPE_TERMINAL } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

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
      value={props.payment_method}
      onChange={(ev) => props.onChange(parseInt(ev.target.value))}
    >
      {(props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
      ) && (
        <FormControlLabel
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA}
          control={<Radio color="primary" />}
          label={t('paymentMethod.sepa')}
          labelPlacement="bottom"
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          className={classes.paymentMethodRadio}
        />
      )}
      {(props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      ) && (
        <FormControlLabel
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_CB}
          control={<Radio color="primary" />}
          label={t('paymentMethod.card')}
          labelPlacement="bottom"
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          className={classes.paymentMethodRadio}
        />
      )}
      {(props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
      ) && (
        <FormControlLabel
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT}
          control={<Radio color="primary" />}
          label={t('paymentMethod.bacs_debit')}
          labelPlacement="bottom"
          disabled={props.disabled || props.onlinePaymentEnabled === false}
          className={classes.paymentMethodRadio}
        />
      )}
      {(props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
      ) && (
        <FormControlLabel
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT}
          control={<Radio color="primary" />}
          label={t('paymentMethod.bsportCredit')}
          labelPlacement="bottom"
          disabled={props.disabled}
          className={classes.paymentMethodRadio}
        />
      )}

      {(props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_STRIPE_TERMINAL_FAKE,
      ) && (
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <FormControlLabel
              value={PAYMENT_STRIPE_TERMINAL_FAKE}
              control={<Radio color="primary" />}
              label={t(
                'invoice:configuration.stripeTerminal.paymentDialog.radio',
              )}
              labelPlacement="bottom"
              disabled={
                props.disabled ||
                !hasUpsell(featureList, UPSELL_IDENTIFIER_STRIPE_TERMINAL)
              }
              className={classes.paymentMethodRadio}
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
