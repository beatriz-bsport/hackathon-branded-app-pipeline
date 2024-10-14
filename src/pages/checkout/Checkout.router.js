// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { Redirect, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { MuiThemeProvider } from '@material-ui/core';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import themeSelectors from '../../libs/theme/selectors';

import asyncComponent from '../../AsyncComponent';
import Analytics from '#src/components/analytics/Analytics.component';
import { fetchProfile } from '../../libs/consumer-space/actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import namespaces from '../../i18n/namespaces.json';
import { getTheme } from '../../theme';
import { getLoginUrl as getLoginRedirectionUrl } from '../../libs/marketplace/routing-utils';

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
const ContractCheckoutValidation = asyncComponent(() =>
  import('./ContractCheckoutValidation.page'),
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
  theme: CompanyTheme,
  fetchCompanyTheme: (number) => void,
};

export class PaymentRouter extends React.Component<Props> {
  componentDidMount() {
    if (this.props.authenticated) {
      this.props.fetchProfile();
    }
    this.props.fetchCompanyTheme(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchProfile();
    }
  }

  getLoginUrl = () => {
    const { pathname } = this.props.location;
    return getLoginRedirectionUrl(
      this.props.companyId,
      pathname,
      window.location.search,
    );
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
      /* NOTE: The marketplaceCssHoc will look at its parents to search for a Themeprovider. 
      Some pages (like the contract checkout) are wraped into the marketplaceCssHoc but don't have parent 
      that provide a theme. That's why we need to wrap the router into a MuiThemeProvider
       */
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Analytics theme={this.props.theme} />
        <Switch>
          <Route
            component={ValidationCheckout}
            path="/(|customer/)checkout/:companyId/validation"
          />
          <Route
            component={OfferBooker}
            path="/(|customer/)checkout/:companyId/offer-booker/:id"
          />
          <Route
            component={ContractCheckoutValidation}
            path="/(|customer/)checkout/:companyId/subscription/:contractId/validation"
          />
          <Route
            component={ContractCheckout}
            path="/(|customer/)checkout/:companyId/subscription/:contractId"
          />

          <Route
            component={PaymentPackPreCheckout}
            path="/(|customer/)checkout/:companyId/pre-checkout/payment-pack/:id"
          />
          <Route
            component={PaymentPackTemplatePreCheckout}
            path="/(|customer/)checkout/:companyId/pre-checkout/payment-pack-template/:id/"
          />

          <Route
            component={PaymentComboPreCheckoutPage}
            path="/checkout/:companyId/pre-checkout/payment-combo/:id"
          />
          <Route
            component={PrivatePassPreCheckout}
            path="/(|customer/)checkout/:companyId/pre-checkout/private-pass/:id"
          />
          <Route
            component={PrivateSlotPaymentPage}
            path="/(|customer/)checkout/:companyId/private-slot-booker/:privateServiceId/private-slot/:privateSlotId/"
          />
          <Route
            component={ShopItemPreCheckoutPage}
            path="/(|customer/)checkout/:companyId/pre-checkout/shop-item/:id"
          />
          <Route
            component={GiftcardActivationPage}
            path="/(|customer/)checkout/:companyId/giftcard/activation/:activationCode"
          />
          <Route
            component={GiftcardCheckoutPage}
            path="/(|customer/)checkout/:companyId/giftcard/:id"
          />
          <Route
            component={VideoCheckoutPage}
            path="/(|customer/)checkout/:companyId/vod/:id/"
          />
          <Route
            component={BasketPage}
            path="/(|customer/)checkout/:companyId/"
          />
        </Switch>
      </MuiThemeProvider>
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
  withTranslation(namespaces),
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state) => ({
      authenticated: state.auth.authenticated,
      is_manager: state.auth.is_manager,
      theme: themeSelectors.getTheme(state),
    }),
    { fetchProfile, fetchCompanyTheme },
  ),
)(PaymentRouter);
