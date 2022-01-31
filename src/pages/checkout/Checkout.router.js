// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { Redirect, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import asyncComponent from '../../AsyncComponent';
import { fetchProfile } from '../../libs/consumer-space/actions';

const MarketplaceAsManager = asyncComponent(() =>
  import('../marketplace/MarketplaceAsManager.page'),
);

const OfferBooker = asyncComponent(() =>
  import('./booker-modules/OfferBooker/OfferBooking.page'),
);
const PaymentPackPreCheckout = asyncComponent(() =>
  import('./pre-checkout/PaymentPackPreCheckout.page'),
);
const PaymentPackTemplatePreCheckout = asyncComponent(() =>
  import('./pre-checkout/PaymentPackTemplatePreCheckout.page'),
);
const ShopItemPreCheckoutPage = asyncComponent(() =>
  import('./pre-checkout/ShopItemPreCheckout.page'),
);
const PrivateSlotPaymentPage = asyncComponent(() =>
  import('./booker-modules/PrivateSlotBooker.page'),
);
const ValidationCheckout = asyncComponent(() =>
  import('./booker-modules/ValidationCheckout.page'),
);

const BasketPage = asyncComponent(() => import('./basket/Basket.page'));

const PaymentComboPreCheckoutPage = asyncComponent(() =>
  import('./pre-checkout/PaymentComboPreCheckout.page'),
);

const PrivatePassPreCheckout = asyncComponent(() =>
  import('./pre-checkout/PrivatePassPreCheckout.page'),
);

const ContractCheckout = asyncComponent(() =>
  import('./ContractCheckout.page'),
);
const GiftcardCheckoutPage = asyncComponent(() =>
  import('./giftcard/GiftcardCheckout.page'),
);
const GiftcardActivationPage = asyncComponent(() =>
  import('./giftcard/GiftcardActivation.page'),
);
const VideoCheckoutPage = asyncComponent(() =>
  import('./vod/VideoCheckout.page'),
);

type Props = {
  fetchProfile: () => void,
  authenticated: boolean,
  location: Object,
  is_manager: ?boolean,
  companyId: number,
};

export class PaymentRouter extends React.Component<Props> {
  componentDidMount() {
    if (this.props.authenticated) {
      this.props.fetchProfile();
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
      }&membership=${this.props.companyId}`,
    )}&membership=${this.props.companyId}`;
  };

  render() {
    const { authenticated } = this.props;
    if (!authenticated) {
      return <Redirect to={this.getLoginUrl()} />;
    }
    if (this.props.is_manager) {
      return <MarketplaceAsManager />;
    }

    return (
      <>
        <Analytics theme={this.props.theme} />
        <Switch>
          <Route
            path="/(|customer/)checkout/:companyId/validation/"
            component={ValidationCheckout}
          />
          <Route
            path="/(|customer/)checkout/:companyId/offer-booker/:id"
            component={OfferBooker}
          />
          <Route
            path="/(|customer/)checkout/:companyId/subscription/:contractId"
            component={ContractCheckout}
          />
          <Route
            path="/(|customer/)checkout/:companyId/pre-checkout/payment-pack/:id"
            component={PaymentPackPreCheckout}
          />
          <Route
            path="/(|customer/)checkout/:companyId/pre-checkout/payment-pack-template/:id/"
            component={PaymentPackTemplatePreCheckout}
          />

          <Route
            path="/checkout/:companyId/pre-checkout/payment-combo/:id"
            component={PaymentComboPreCheckoutPage}
          />
          <Route
            path="/(|customer/)checkout/:companyId/pre-checkout/private-pass/:id"
            component={PrivatePassPreCheckout}
          />
          <Route
            path="/(|customer/)checkout/:companyId/private-slot-booker/:privateServiceId/private-slot/:privateSlotId/"
            component={PrivateSlotPaymentPage}
          />
          <Route
            path="/(|customer/)checkout/:companyId/pre-checkout/shop-item/:id"
            component={ShopItemPreCheckoutPage}
          />
          <Route
            path="/(|customer/)checkout/:companyId/giftcard/activation/:activationCode"
            component={GiftcardActivationPage}
          />
          <Route
            path="/(|customer/)checkout/:companyId/giftcard/:id"
            component={GiftcardCheckoutPage}
          />
          <Route
            path="/(|customer/)checkout/:companyId/vod/:id/"
            component={VideoCheckoutPage}
          />
          <Route
            path="/(|customer/)checkout/:companyId/"
            component={BasketPage}
          />
        </Switch>
      </>
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
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state) => ({
      authenticated: state.auth.authenticated,
      is_manager: state.auth.is_manager,
    }),
    { fetchProfile },
  ),
)(PaymentRouter);
