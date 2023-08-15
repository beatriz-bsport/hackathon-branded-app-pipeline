import React from 'react';

import { compose, withProps } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Switch, Route } from 'react-router';
import { RootState } from '../../reducers';
import { fetchCompanyTheme } from '#libs/theme/actions';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent.js';
import themeSelectors from '#libs/theme/selectors';
import { getLoginUrl } from '#libs/marketplace/routing-utils';

import { fetchProfile } from '#libs/consumer-space/actions';
import { CompanyTheme } from '#libs/theme/types';
import withThemeProvider from '#hocs/company-themifier.hoc';

const MarketplaceAsManager = asyncComponent(
  () =>
    // @ts-expect-error
    import('../marketplace/MarketplaceAsManager.page'),
);

const BoutiqueBookerModule = asyncComponent(
  () => import('./booker-modules/OfferBooker/BoutiqueBookerModule.page'),
);

// @ts-expect-error
const BasketPage = asyncComponent(() => import('./basket/Basket.page'));

const BoutiqueContractCheckout = asyncComponent(
  () => import('./BoutiqueContractCheckout.page'),
);

// for now it redirects to the classic validation page
// -> to replace by the new validation page once it's merged
const ValidationCheckout = asyncComponent(
  () => import('./booker-modules/ValidationCheckout.page'),
);

type Props = {
  location: { [key: string]: string };
  companyId: number;
  isNewCheckoutFlow: boolean;
  theme: CompanyTheme;
} & ConnectedProps<typeof connector>;

const BoutiqueFlowBasketPage = withProps({ isNewCheckoutFlow: true })(
  BasketPage,
);
export class NewBookingFlowRouter extends React.Component<Props> {
  componentDidMount() {
    !!this.props.companyId &&
      this.props.fetchCompanyTheme(this.props.companyId);
    if (this.props.authenticated) {
      this.props.fetchProfile();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchProfile();
    }
  }

  render() {
    const { authenticated } = this.props;
    if (!authenticated) {
      return (
        <Redirect
          to={getLoginUrl(
            this.props.companyId,
            this.props.location.pathname,
            window.location.search,
          )}
        />
      );
    }
    if (this.props.is_manager) {
      return <MarketplaceAsManager />;
    }

    return (
      /* NOTE: The marketplaceCssHoc will look at its parents to search for a Themeprovider. 
      Some pages (like the contract checkout) are wraped into the marketplaceCssHoc but don't have parent 
      that provide a theme. That's why we need to wrap the router into a MuiThemeProvider
       */
      <Switch>
        <Route
          component={BoutiqueBookerModule}
          path="/booker-module-s/:companyId/:offerId"
        />
        <Route
          component={ValidationCheckout}
          path="/checkout-s/:companyId/validation"
        />
        <Route
          component={BoutiqueFlowBasketPage}
          path="/checkout-s/:companyId"
        />
        <Route
          component={BoutiqueContractCheckout}
          path="/contract-s/:companyId/:contractId"
        />
      </Switch>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    is_manager: state.auth.is_manager,
    theme: themeSelectors.getTheme(state),
  }),
  { fetchProfile, fetchCompanyTheme },
);

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
  }),
  connector,
  withThemeProvider,
)(NewBookingFlowRouter);
