// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { Redirect, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import asyncComponent from '../AsyncComponent';
import { fetchProfile } from '../libs/consumer-space/actions';

import { fetchPaymentCombo } from '../libs/payment-combo/actions';

import { fetchOne as fetchPaymentPack } from '../libs/payment-packs/actions';
import { fetchOfferBulk } from '../libs/offer/actions';
import withQueryParams from '../hocs/with-query-params.hoc';

const OfferPaymentPage = asyncComponent(() =>
  import('./payment/OfferBooking.page'),
);
const OfferBookingPageV2 = asyncComponent(() =>
  import('./payment/OfferBookingV2/OfferBooking.page'),
);
const PaymentPackPreCheckout = asyncComponent(() =>
  import('./checkout/pre-checkout/PaymentPackPreCheckout.page'),
);
const ShopItemPreCheckoutPage = asyncComponent(() =>
  import('./checkout/pre-checkout/ShopItemPreCheckout.page'),
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

const PrivatePassPreCheckout = asyncComponent(() =>
  import('./checkout/pre-checkout/PrivatePassPreCheckout.page'),
);

const MarketplaceAsManager = asyncComponent(() =>
  import('./marketplace/MarketplaceAsManager.page'),
);

type Props = {
  classes: Object,
  fetchProfile: () => void,
  fetchPaymentPack: (id: number, OptionCallback) => void,
  fetchPaymentCombo: (id: number, OptionCallback) => void,
  fetchOfferBulk: (Array<number>, OptionCallback) => void,
  authenticated: boolean,
  location: Object,
  urlParams: { membership: string },
  setUrlParams: (string) => (string) => void,
  is_manager: ?boolean,
};

export class PaymentRouter extends React.Component<Props> {
  componentDidMount() {
    if (this.props.authenticated) {
      this.props.fetchProfile();
    } else {
      const { pathname } = this.props.location;
      if (!this.props.urlParams.membership) {
        if (pathname.includes('payment/pass')) {
          const ppId = pathname.split('/')[4];

          this.props.fetchPaymentPack(ppId, {
            onSuccess: (pp) =>
              this.props.setUrlParams('membership')(pp.company),
          });
        }
        if (pathname.includes('payment/offer')) {
          const offerId = pathname.split('/')[3];

          this.props.fetchOfferBulk([offerId], {
            onSuccess: ([offer]) =>
              this.props.setUrlParams('membership')(offer.company),
          });
        }
        if (pathname.includes('payment/combo')) {
          const ppId = pathname.split('/')[4];

          this.props.fetchPaymentCombo(ppId, {
            onSuccess: (pc) =>
              this.props.setUrlParams('membership')(pc.company),
          });
        }
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchProfile();
    }
  }

  getLoginUrl = () => {
    const { pathname } = this.props.location;
    return `/login/customer?next=${encodeURIComponent(
      `${pathname}${
        window.location.search ? window.location.search : '?'
      }&membership=${this.props.urlParams.membership}`,
    )}&membership=${this.props.urlParams.membership}`;
  };

  render() {
    const { authenticated } = this.props;
    if (!authenticated) {
      if (!this.props.urlParams.membership) {
        return (
          <div className={this.props.classes.loading}>
            <CircularProgress />
          </div>
        );
      }
      return <Redirect to={this.getLoginUrl()} />;
    }
    if (this.props.is_manager) {
      return <MarketplaceAsManager />;
    }

    return (
      <Switch>
        <Route path="/(|customer/)payment/checkout/" component={CheckoutPage} />
        <Route
          path="/(|customer/)payment/offer/:id"
          component={OfferPaymentPage}
        />
        <Route
          path="/(|customer/)payment/offer-booker-module/:id"
          component={OfferBookingPageV2}
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
          path="/(|customer/)payment/private-service/:privateServiceId/private-slot/:privateSlotId/"
          component={PrivateSlotPaymentPage}
        />
        <Route
          path="/(|customer/)payment/shop-item/:id"
          component={ShopItemPreCheckoutPage}
        />
        <Route path="/(|customer/)checkout/" component={CheckoutRouter} />
        <Route
          path="/(|customer/)payment/private-pass/:id"
          component={PrivatePassPreCheckout}
        />
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
  withQueryParams([['membership'], 'urlParams', 'setUrlParams']),
  connect(
    (state) => ({
      authenticated: state.auth.authenticated,
      is_manager: state.auth.is_manager,
    }),
    { fetchPaymentCombo, fetchPaymentPack, fetchOfferBulk, fetchProfile },
  ),
)(PaymentRouter);
