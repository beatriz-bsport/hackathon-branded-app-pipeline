import React from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Switch, Route } from 'react-router';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import themeSelectors from '#src/libs/theme/selectors';
import { getLoginUrl } from '#src/libs/marketplace/routing-utils';

import { fetchProfile } from '#src/libs/consumer-space/actions';
import { CompanyTheme } from '#src/libs/theme/types';
import withThemeProvider from '#src/hocs/company-themifier.hoc';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent.js';
import { RootState } from '../../reducers';

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
  () => import('./booker-modules/ConfirmationCheckout'),
);

type Props = {
  location: { [key: string]: string };
  companyId: number;

  // eslint-disable-next-line react/no-unused-prop-types
  theme: CompanyTheme;
} & ConnectedProps<typeof connector>;

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
        <Route component={BasketPage} path="/checkout-s/:companyId" />
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
