// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import PAYMENT_METHODS, {
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
  CB as PAYMENT_METHOD_STRIPE_PAYMENT_INTENT,
} from '@bsport/common/lib/master-data/payment-methods';

import PaymentByCardStripe from '../../payment/components/payment-backend-stripe-deprecated/PaymentByCard.component';
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
      color="primary"
      disabled={props.loading || props.processing}
      onClick={props.onClick}
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
  submitPayment: () => void,
  loading: boolean,
  processing: boolean,
  termsAndConditions: any,
  submitPayment: (any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  onCancel: () => void,
}) => {
  switch (props.paymentMethod) {
    case PAYMENT_METHOD_CREDIT_ACCOUNT.id:
      return (
        <PaymentByCredit
          accountBalance={0}
          loading={props.loading}
          onCancel={props.onCancel}
          processing={props.processing}
          submitPayment={props.submitPayment}
          termsAndConditions={props.termsAndConditions}
        />
      );
    case PAYMENT_METHOD_STRIPE_PAYMENT_INTENT.id:
    default:
      return (
        <PaymentByCardStripe
          loading={props.loading}
          onCancel={props.onCancel}
          processing={props.processing}
          savedPaymentMethodList={props.savedPaymentMethodList}
          submitPaymentIntent={props.submitPayment}
          termsAndConditions={props.termsAndConditions}
        />
      );
  }
};

export const PaymentForm = (props: Props) => {
  if (props.price_cts === 0) {
    return (
      <PayButton
        loading={props.loading}
        onClick={() => props.submitPayment()}
        processing={props.processing}
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
          disabled={props.loading || props.processing}
          onChange={(ev) =>
            props.setPaymentMethod(parseInt(ev.target.value, 10))
          }
          value={chosenPaymentMethod}
        >
          {props.availablePaymentMethods.map((id) => (
            <FormControlLabel
              key={`${id}`}
              control={<Radio color="primary" />}
              label={props.t(
                `payment:method.${
                  PAYMENT_METHODS.find((pm) => pm.id === id).text
                }`,
              )}
              labelPlacement="bottom"
              value={id}
            />
          ))}
        </RadioGroup>
      ) : null}
      <ChosenPaymentModule
        loading={props.loading}
        onCancel={props.onCancel}
        paymentMethod={chosenPaymentMethod}
        processing={props.processing}
        savedPaymentMethodList={props.savedPaymentMethodList}
        submitPayment={props.submitPayment}
        termsAndConditions={props.termsAndConditions}
      />
    </div>
  );
};

export default compose(
  withStyles(styles),
  withTranslation(['payment', 'checkout']),
  withState('paymentMethod', 'setPaymentMethod', null),
)(PaymentForm);
