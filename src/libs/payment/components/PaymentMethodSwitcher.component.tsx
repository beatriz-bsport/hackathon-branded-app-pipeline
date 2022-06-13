import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';
import { getCurrencyCode } from '../../theme/selectors';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '#libs/payment/utils';
import type { FeatureList } from '#libs/company/types';

type OwnProps = {
  onChange: (param: string) => void;
  paymentMethod: string;
  enabledPaymentMethods: Array<number>;
  enabledPaymentGroupMethodIdentifier?: Array<number>;
  disabled: boolean;
};
type Props = OwnProps;
export const PaymentMethodSwitcher: React.FC<Props> = (props) => {
  const { t } = useTranslation(['']);
  const classes = useStyles();
  if (!(props.enabledPaymentMethods?.length > 1)) {
    return null;
  }

  const currency = getCurrencyCode().toLowerCase();

  return (
    <RadioGroup
      aria-label="payment-method"
      className={classes.paymentMethodSelectorContainer}
      value={props.paymentMethod}
      onChange={(ev) => props.onChange(ev.target.value)}
    >
      {((props.enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
      ) ||
        (props.enabledPaymentGroupMethodIdentifier || []).includes(
          PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        )) &&
      currency === 'eur' ? (
        <FormControlLabel
          value="sepa_debit"
          control={<Radio color="primary" />}
          label={t('subscription:paymentMethod.sepa')}
          labelPlacement="bottom"
          disabled={props.disabled}
          className={classes.paymentMethodRadio}
        />
      ) : null}
      {(props.enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
      ) ||
      (props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      ) ? (
        <FormControlLabel
          value="card"
          control={<Radio color="primary" />}
          label={t('subscription:paymentMethod.card')}
          labelPlacement="bottom"
          disabled={props.disabled}
          className={classes.paymentMethodRadio}
        />
      ) : null}
      {(props.enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
      ) ? (
        <FormControlLabel
          value="bsport:credit"
          control={<Radio color="primary" />}
          label={t('subscription:paymentMethod.bsportCredit')}
          labelPlacement="bottom"
          disabled={props.disabled}
          className={classes.paymentMethodRadio}
        />
      ) : null}

      {(props.enabledPaymentMethods || []).includes(
        PAYMENT_STRIPE_TERMINAL_FAKE,
      ) && (
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <FormControlLabel
              value="terminal"
              control={<Radio color="primary" />}
              label={t(
                'invoice:configuration.stripeTerminal.paymentDialog.radio',
              )}
              labelPlacement="bottom"
              disabled={
                props.disabled ||
                !featureList.upsell ||
                !featureList.upsell.find(
                  (f) => f.readable_identifier === 'stripe_terminal',
                )
              }
              className={classes.paymentMethodRadio}
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
