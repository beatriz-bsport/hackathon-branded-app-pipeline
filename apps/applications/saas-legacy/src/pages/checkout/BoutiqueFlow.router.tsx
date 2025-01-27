import React, { useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Switch, Route } from 'react-router';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import themeSelectors from '#src/libs/theme/selectors';
import { getLoginUrl } from '#src/libs/marketplace/routing-utils';

import { fetchProfile as fetchProfileAction } from '#src/libs/consumer-space/actions';
import { CompanyTheme } from '#src/libs/theme/types';
import withThemeProvider from '#src/hocs/company-themifier.hoc';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent.js';
import { RootState } from '../../reducers';
import Config from '#src/config';

const MarketplaceAsManager = asyncComponent(
  () =>
    // @ts-expect-error
    import('../marketplace/MarketplaceAsManager.page'),
);

const OneClickBookingModule = asyncComponent(
  () => import('./booker-modules/OfferBooker/OneClickBookingModule.page'),
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
const ConfirmationCheckout = asyncComponent(
  () => import('./booker-modules/ConfirmationCheckout'),
);

type Props = {
  location: { [key: string]: string };
  companyId: number;

  theme: CompanyTheme;
} & ConnectedProps<typeof connector>;

const Authenticated: React.FC<{
  isAuthenticated: boolean;
  children: React.ReactNode;
  companyId: Props['companyId'];
  location: Props['location'];
}> = ({ isAuthenticated, children, companyId, location }) => {
  if (!isAuthenticated) {
    return (
      <Redirect
        to={getLoginUrl(companyId, location.pathname, window.location.search)}
      />
    );
  }

  return <>{children}</>;
};

export const NewBookingFlowRouter: React.FC<Props> = ({
  companyId,
  authenticated,
  fetchProfile,
  is_manager,
  location,
}) => {
  useEffect(() => {
    !!companyId && fetchCompanyTheme(companyId);
  }, [companyId]);

  useEffect(() => {
    if (authenticated) {
      fetchProfile();
    }
  }, [authenticated, fetchProfile]);

  if (is_manager) {
    return <MarketplaceAsManager />;
  }

  return (
    /* NOTE: The marketplaceCssHoc will look at its parents to search for a Themeprovider. 
      Some pages (like the contract checkout) are wraped into the marketplaceCssHoc but don't have parent 
      that provide a theme. That's why we need to wrap the router into a MuiThemeProvider
       */ <>
      {['local', 'dev'].includes(Config.REACT_APP_SENTRY_ENVIRONMENT) && (
        <Route
          component={OneClickBookingModule}
          path="/one-click-booking/:companyId/:offerId"
        />
      )}
      <Authenticated
        companyId={companyId}
        isAuthenticated={authenticated}
        location={location}
      >
        <Switch>
          <Route
            component={BoutiqueBookerModule}
            path="/booker-module-s/:companyId/:offerId"
          />
          <Route
            component={ConfirmationCheckout}
            path="/checkout-s/:companyId/validation"
          />
          <Route component={BasketPage} path="/checkout-s/:companyId" />
          <Route
            component={BoutiqueContractCheckout}
            path="/contract-s/:companyId/:contractId"
          />
        </Switch>
      </Authenticated>
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    is_manager: state.auth.is_manager,
    theme: themeSelectors.getTheme(state),
  }),
  { fetchProfile: fetchProfileAction, fetchCompanyTheme },
);

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
  }),
  connector,
  withThemeProvider,
)(NewBookingFlowRouter);
