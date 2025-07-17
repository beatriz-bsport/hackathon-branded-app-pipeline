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
import { fetchProfile } from '../../libs/consumer-space/actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import namespaces from '../../i18n/namespaces.json';
import { getTheme } from '../../theme';
import {
  getLoginUrl as getLoginRedirectionUrl,
  getPassExpressCheckoutUrl,
} from '#src/libs/marketplace/routing-utils';
import { AuthenticatedSwitch } from './components/AuthenticatedSwitch';
import Config from '#src/config';
import { PassTypes } from '#src/libs/marketplace/types';

const MarketplaceAsManager = asyncComponent(() =>
  import('../marketplace/MarketplaceAsManager.page'),
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
  is_manager?: boolean,
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

  getExpressCheckoutRedirect = (passType) => {
    const shouldRedirect =
      !['staging', 'production'].includes(
        Config.REACT_APP_SENTRY_ENVIRONMENT,
      ) &&
      this.props.theme.one_click_checkout_enabled &&
      !this.props.theme.requires_email_confirmation_when_signing_up;

    return shouldRedirect
      ? ({ params }) =>
          getPassExpressCheckoutUrl(
            Number(params.companyId),
            Number(params.id),
            passType,
            window.location.search,
          )
      : undefined;
  };

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
    const { authenticated, companyId, location } = this.props;
    if (this.props.is_manager) {
      return <MarketplaceAsManager />;
    }

    return (
      /* NOTE: The marketplaceCssHoc will look at its parents to search for a Themeprovider. 
      Some pages (like the contract checkout) are wraped into the marketplaceCssHoc but don't have parent 
      that provide a theme. That's why we need to wrap the router into a MuiThemeProvider
       */
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Switch>
          <AuthenticatedSwitch
            companyId={companyId}
            isAuthenticated={authenticated}
            location={location}
            routes={[
              {
                path: '/(|customer/)checkout/:companyId/validation',
                component: ValidationCheckout,
              },
              {
                path: '/(|customer/)checkout/:companyId/subscription/:contractId/validation',
                component: ContractCheckoutValidation,
              },
              {
                path: '/(|customer/)checkout/:companyId/subscription/:contractId',
                component: ContractCheckout,
              },
              {
                path: '/(|customer/)checkout/:companyId/pre-checkout/payment-pack/:id',
                component: PaymentPackPreCheckout,
                redirectTo: this.getExpressCheckoutRedirect(
                  PassTypes.PAYMENTPACK,
                ),
              },
              {
                path: '/(|customer/)checkout/:companyId/pre-checkout/payment-pack-template/:id/',
                component: PaymentPackTemplatePreCheckout,
              },
              {
                path: '/checkout/:companyId/pre-checkout/payment-combo/:id',
                component: PaymentComboPreCheckoutPage,
              },
              {
                path: '/(|customer/)checkout/:companyId/pre-checkout/private-pass/:id',
                component: PrivatePassPreCheckout,
                redirectTo: this.getExpressCheckoutRedirect(
                  PassTypes.PRIVATEPASS,
                ),
              },
              {
                path: '/(|customer/)checkout/:companyId/private-slot-booker/:privateServiceId/private-slot/:privateSlotId/',
                component: PrivateSlotPaymentPage,
              },
              {
                path: '/(|customer/)checkout/:companyId/pre-checkout/shop-item/:id',
                component: ShopItemPreCheckoutPage,
              },
              {
                path: '/(|customer/)checkout/:companyId/giftcard/activation/:activationCode',
                component: GiftcardActivationPage,
              },
              {
                path: '/(|customer/)checkout/:companyId/giftcard/:id',
                component: GiftcardCheckoutPage,
              },
              {
                path: '/(|customer/)checkout/:companyId/vod/:id/',
                component: VideoCheckoutPage,
              },
            ]}
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
