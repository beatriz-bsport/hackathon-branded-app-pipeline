// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import PAYMENT_METHODS, {
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
  CB as PAYMENT_METHOD_STRIPE_PAYMENT_INTENT,
} from '@bsport/common/lib/master-data/payment-methods';

import PaymentByCardStripe from '../../payment/components/payment-backend-stripe/PaymentByCard.component';
import PaymentByCredit from '../../payment/components/PaymentByCredit.component';

type Props = {
  submitPayment: { [id: string]: () => void },
  price_cts: number,
  paymentMethod: number,
  setPaymentMethod: (number) => void,
  availablePaymentMethods: Array<number>,
  t: TFunction,
  classes: Object,
  loading: boolean,
  processing: boolean,
  termsAndConditions: string,
  onCancel: () => void,
  savedPaymentMethodList: ?Array<PaymentMethod>,
};

const styles = (theme) => ({
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  payButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: theme.spacing(1),
  },
});

const PayButtonBase = (props: {
  onClick: () => void,
  t: TFunction,
  classes: any,
  loading: boolean,
  processing: boolean,
}) => (
  <div className={props.classes.payButtonContainer}>
    <Button
      disabled={props.loading || props.processing}
      onClick={props.onClick}
      color="primary"
    >
      {props.t('checkout:myBasket.actions.payZero')}
    </Button>
  </div>
);

const PayButton = withStyles(styles)(
  withTranslation(['checkout'])(PayButtonBase),
);

const ChosenPaymentModule = (props: {
  paymentMethod: number,
  submitPayment: (*) => void,
  loading: boolean,
  processing: boolean,
}) => {
  switch (props.paymentMethod) {
    case PAYMENT_METHOD_CREDIT_ACCOUNT.id:
      return (
        <PaymentByCredit
          loading={props.loading}
          processing={props.processing}
          accountBalance={0}
          submitPayment={props.submitPayment}
          termsAndConditions={props.termsAndConditions}
          onCancel={props.onCancel}
        />
      );
    case PAYMENT_METHOD_STRIPE_PAYMENT_INTENT.id:
    default:
      return (
        <PaymentByCardStripe
          processing={props.processing}
          loading={props.loading}
          submitPaymentIntent={props.submitPayment}
          termsAndConditions={props.termsAndConditions}
          onCancel={props.onCancel}
          savedPaymentMethodList={props.savedPaymentMethodList}
        />
      );
  }
};

export const PaymentForm = (props: Props) => {
  if (props.price_cts === 0) {
    return (
      <PayButton
        loading={props.loading}
        processing={props.processing}
        onClick={() => props.submitPayment()}
      />
    );
  }
  const chosenPaymentMethod =
    props.paymentMethod || props.availablePaymentMethods[0];

  return (
    <div>
      {props.availablePaymentMethods.length > 1 ? (
        <RadioGroup
          aria-label="payment-method"
          className={props.classes.paymentMethodSelectorContainer}
          value={chosenPaymentMethod}
          disabled={props.loading || props.processing}
          onChange={(ev) =>
            props.setPaymentMethod(parseInt(ev.target.value, 10))
          }
        >
          {props.availablePaymentMethods.map((id) => (
            <FormControlLabel
              value={id}
              key={`${id}`}
              control={<Radio color="primary" />}
              label={props.t(
                `payment:method.${
                  PAYMENT_METHODS.find((pm) => pm.id === id).text
                }`,
              )}
              labelPlacement="bottom"
            />
          ))}
        </RadioGroup>
      ) : null}
      <ChosenPaymentModule
        paymentMethod={chosenPaymentMethod}
        savedPaymentMethodList={props.savedPaymentMethodList}
        submitPayment={props.submitPayment}
        loading={props.loading}
        processing={props.processing}
        termsAndConditions={props.termsAndConditions}
        onCancel={props.onCancel}
      />
    </div>
  );
};

export default compose(
  withStyles(styles),
  withTranslation(['payment', 'checkout']),
  withState('paymentMethod', 'setPaymentMethod', null),
)(PaymentForm);
