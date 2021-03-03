// @flow

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
} from '@bsport/common/lib/master-data/payment-group';

import PaymentStripeCard from './PaymentStripeCard.component';
import PaymentStripeSEPA from './PaymentStripeSEPA.component';
import PaymentStripeBancontact from './PaymentStripeBancontact.component';
import PaymentStripeSofort from './PaymentStripeSofort.component';
import PaymentStripeIdeal from './PaymentStripeIdeal.component';
import PaymentStripeEPS from './PaymentStripeEPS.component';
import PaymentStripeGiropay from './PaymentStripeGiropay.component';
import PaymentStripeMobilePay from './PaymentStripeMobilePay.component';

import PaymentMethodCardSelector from '../PaymentMethodCardSelector.component';
import AcceptTermsAndConditions from '../AcceptTermsAndConditions.component';

import { getStripePkKey, getCurrencyDisplay } from '../../../theme/selectors';

const stripePromise = loadStripe(getStripePkKey());

type Props = {
  paymentMethodSelected: number,
  selectPaymentMethod: (number) => void,
  paymentMethodChoices: Array<number>,
  memberId: number,
  clientSecret: string,
  onCancel: () => void,
  onSuccess: () => void,
  onError: () => void,
  paymentGroupPriceCts: ?number,
  termsAndConditions: ?string,
  setTermsAndConditionsAccepted: (boolean) => void,
  termsAndConditionsAccepted: boolean,
};

const STRIPE_PAYMENT_METHOD_FORM_COMPONENT = {
  [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: PaymentStripeCard,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: PaymentStripeSEPA,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: PaymentStripeBancontact,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: PaymentStripeIdeal,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: PaymentStripeSofort,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: PaymentStripeEPS,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: PaymentStripeGiropay,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY]: PaymentStripeMobilePay,
};

export const PaymentStripe = (props: Props) => {
  const classes = useStyles();

  const StripePaymentMethodForm =
    STRIPE_PAYMENT_METHOD_FORM_COMPONENT[props.paymentMethodSelected];

  return (
    <div className={classes.container}>
      {!!props.paymentGroupPriceCts && (
        <div className={classes.priceContainer}>
          <Typography variant="h5">
            {`${(props.paymentGroupPriceCts / 100).toFixed(
              2,
            )} ${getCurrencyDisplay()}`}
          </Typography>
        </div>
      )}
      <PaymentMethodCardSelector
        selectPaymentMethod={props.selectPaymentMethod}
        paymentMethodSelected={props.paymentMethodSelected}
        paymentMethodChoices={props.paymentMethodChoices}
      />
      <div className={classes.innerContainer}>
        <Elements stripe={stripePromise}>
          <StripePaymentMethodForm
            onSuccess={props.onSuccess}
            onError={props.onError}
            clientSecret={props.clientSecret}
            onCancel={props.onCancel}
            memberId={props.memberId}
            AcceptTermsAndConditionsComponent={
              props.termsAndConditions ? (
                <AcceptTermsAndConditions
                  accepted={props.termsAndConditionsAccepted}
                  onChecked={props.setTermsAndConditionsAccepted}
                  termsAndConditions={props.termsAndConditions}
                />
              ) : null
            }
            termsAndConditionsAccepted={props.termsAndConditionsAccepted}
          />
        </Elements>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  innerContainer: {
    marginTop: theme.spacing(2),
  },
  priceContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default compose(
  withState(
    'paymentMethodSelected',
    'selectPaymentMethod',
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  ),
)(PaymentStripe);
