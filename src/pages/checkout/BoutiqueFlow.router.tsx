import React from 'react';

import { MuiThemeProvider } from '@material-ui/core';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { Redirect, Switch, Route } from 'react-router';
import { RootState } from '../../reducers';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent.js';
import { getLoginUrl } from '#libs/marketplace/routing-utils';

// @ts-expect-error
import { getTheme } from '../../theme';
import themeSelectors from '#libs/theme/selectors';
import { fetchProfile } from '#libs/consumer-space/actions';
import { CompanyTheme } from '#libs/theme/types';

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

// placeholder page -> to replace by the right page once it's merged
const NewSubscriptionPage = asyncComponent(
  () => import('./new-checkout-flow/NewSubscription.page'),
);

// for now it redirects to the classic validation page
// -> to replace by the new validation page once it's merged
const ValidationCheckout = asyncComponent(
  () => import('./booker-modules/ValidationCheckout.page'),
);

type Props = {
  fetchProfile: () => void;
  authenticated: boolean;
  location: { [key: string]: string };
  is_manager?: boolean;
  companyId: number;
  isNewCheckoutFlow: boolean;
  theme: CompanyTheme;
};

export class NewBookingFlowRouter extends React.Component<Props> {
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
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
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
            component={withProps({ isNewCheckoutFlow: true })(BasketPage)}
            path="/checkout-s/:companyId"
          />
          <Route
            component={NewSubscriptionPage}
            path="/contract-s/:companyId/:contractId"
          />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
  }),
  connect(
    (state: RootState) => ({
      authenticated: state.auth.authenticated,
      is_manager: state.auth.is_manager,
      theme: themeSelectors.getTheme(state),
    }),
    { fetchProfile },
  ),
)(NewBookingFlowRouter);
