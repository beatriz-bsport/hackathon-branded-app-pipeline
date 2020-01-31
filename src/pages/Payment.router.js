// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { Redirect, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import asyncComponent from '../AsyncComponent';
import { fetchProfile } from '../actions/consumer.actions';

import { getPaymenComboDataDict as getPaymentComboById } from '../libs/payment-combo/selectors';
import { fetchPaymentCombo } from '../libs/payment-combo/actions';

import { getPaymentPackById } from '../libs/payment-packs/selectors';
import { fetchOne as fetchPaymentPack } from '../libs/payment-packs/actions';
import parse from '../query-string';

const OfferPaymentPage = asyncComponent(() =>
  import('./payment/OfferBooking.page'),
);
const OfferBookingPage = asyncComponent(() =>
  import('./payment/OfferBooking.page'),
);
const PaymentPackPreCheckout = asyncComponent(() =>
  import('./checkout/pre-checkout/PaymentPackPreCheckout.page'),
);
const OrderPaymentPage = asyncComponent(() =>
  import('./payment/OrderPayment.page'),
);
const CheckoutPage = asyncComponent(() =>
  import('./payment/CheckoutPage.page'),
);
const PrivateSlotPaymentPage = asyncComponent(() =>
  import('./payment/PrivateSlotPayment.page'),
);

const CheckoutRouter = asyncComponent(() =>
  import('./checkout/Checkout.router'),
);

const PaymentComboPreCheckoutPage = asyncComponent(() =>
  import('./checkout/pre-checkout/PaymentComboPreCheckout.page'),
);

type Props = {
  classes: Object,
  fetchProfile: () => void,
  fetchPaymentPack: (id: number) => void,
  paymentPacks: Array<any>,
  fetchPaymentCombo: (id: number) => void,
  paymentCombos: Array<any>,
  authenticated: boolean,
  location: Object,
};
export class PaymentRouter extends React.Component<Props> {
  state = {
    paymentPacks: null,
    paymentCombos: null,
  };

  componentDidMount() {
    if (this.props.authenticated) {
      this.props.fetchProfile();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchProfile();
    }
    if (prevProps.paymentPacks !== this.props.paymentPacks) {
      this.setState({ paymentPacks: this.props.paymentPacks });
    }
    if (prevProps.paymentCombos !== this.props.paymentCombos) {
      this.setState({ paymentCombos: this.props.paymentCombos });
    }
  }

  render() {
    const { authenticated } = this.props;
    if (!authenticated) {
      const { pathname } = this.props.location;
      let { membership } = parse(this.props.location.search);
      if (!membership && pathname.includes('customer/payment/pass')) {
        const ppId = pathname.split('/')[4];

        this.props.fetchPaymentPack(ppId);
        if (
          !membership &&
          this.state.paymentPacks &&
          this.state.paymentPacks[ppId]
        ) {
          membership = this.state.paymentPacks[ppId].company_id;
        }
        if (!membership) {
          return (
            <div className={this.props.classes.loading}>
              <CircularProgress />
            </div>
          );
        }
      }
      if (!membership && pathname.includes('customer/payment/combo')) {
        const ppId = pathname.split('/')[4];

        this.props.fetchPaymentCombo(ppId);
        if (
          !membership &&
          this.state.paymentCombos &&
          this.state.paymentCombos[ppId]
        ) {
          membership = this.state.paymentCombos[ppId].company;
        }
        if (!membership) {
          return (
            <div className={this.props.classes.loading}>
              <CircularProgress />
            </div>
          );
        }
      }

      return (
        <Redirect
          to={`/login/customer?next=${encodeURIComponent(
            `${pathname}?&membership=${membership}`,
          )}&membership=${membership}`}
        />
      );
    }
    return (
      <Switch>
        <Route path="/(|customer/)payment/checkout/" component={CheckoutPage} />
        <Route
          path="/(|customer/)payment/offer/:id"
          component={OfferPaymentPage}
        />
        <Route
          path="/(|customer/)payment/offer_/:id"
          component={OfferBookingPage}
        />
        <Route
          path="/(|customer/)payment/pass/:id"
          component={PaymentPackPreCheckout}
        />
        <Route
          path="/(|customer/)payment/combo/:id"
          component={PaymentComboPreCheckoutPage}
        />
        <Route
          path="/(|customer/)payment/private-service/:privateServiceId/private-slot/:privateSlotId/associated-coach/:associatedCoachId/date/:date/"
          component={PrivateSlotPaymentPage}
        />
        <Route
          path="/(|customer/)payment/order/:companyId/"
          component={OrderPaymentPage}
        />
        <Route path="/(|customer/)checkout/" component={CheckoutRouter} />
      </Switch>
    );
  }
}

const styles = () => ({
  loading: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      paymentCombos: getPaymentComboById(state),
      paymentPacks: getPaymentPackById(state),
      authenticated: state.auth.authenticated,
    }),
    { fetchPaymentCombo, fetchPaymentPack, fetchProfile },
  ),
)(PaymentRouter);
