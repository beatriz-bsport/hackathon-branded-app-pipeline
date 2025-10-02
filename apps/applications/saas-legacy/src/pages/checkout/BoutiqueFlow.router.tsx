import React, { useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import themeSelectors from '#src/libs/theme/selectors';
import { getOneClickBookingUrl } from '#src/libs/marketplace/routing-utils';

import { fetchProfile as fetchProfileAction } from '#src/libs/consumer-space/actions';
import withThemeProvider from '#src/hocs/company-themifier.hoc';
// @ts-expect-error
import asyncComponent from '#src/AsyncComponent.js';
import { RootState } from '#src/reducers';
import { AuthenticatedSwitch } from './components/AuthenticatedSwitch';
import { requestOptInTrackingB2C as requestOptInTrackingB2CAction } from '#src/components/analytics/actions';
import { useSafeFlag } from '#src/utils/feature-flag/flagWrapper';
import { FeatureFlags } from '#src/utils/feature-flag/flags';

const MarketplaceAsManager = asyncComponent(
  () =>
    // @ts-expect-error
    import('../marketplace/MarketplaceAsManager.page'),
);

const OneClickBookingModule = asyncComponent(
  () => import('./express-checkouts/OneClickBookingModule/index.page'),
);

const ExpressPassCheckout = asyncComponent(
  () => import('./express-checkouts/pass/ExpressPassCheckout.page'),
);

const BoutiqueBookerModule = asyncComponent(
  () => import('./booker-modules/OfferBooker/BoutiqueBookerModule.page'),
);

// @ts-expect-error
const BasketPage = asyncComponent(() => import('./basket/Basket.page'));
const MemberAreaBasketUnifiedPage = asyncComponent(
  // @ts-expect-error
  () => import('./basket/MemberAreaBasketUnified.page'),
);

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
} & ConnectedProps<typeof connector>;

export const NewBookingFlowRouter: React.FC<Props> = ({
  companyId,
  authenticated,
  fetchProfile,
  is_manager,
  location,
  theme,
  requestOptInTrackingB2C,
}) => {
  useEffect(() => {
    !!companyId && fetchCompanyTheme(companyId);
  }, [companyId]);

  useEffect(() => {
    if (authenticated) {
      fetchProfile();
    }
  }, [authenticated, fetchProfile]);

  useEffect(() => {
    // Opt in B2C tracking and opt out B2B tracking
    requestOptInTrackingB2C();
  }, []);

  const showMemberAreaBasketUnified = useSafeFlag(
    FeatureFlags.MEMBER_AREA_BASKET_UNIFIED,
  );

  if (is_manager) {
    return <MarketplaceAsManager />;
  }

  return (
    /* NOTE: The marketplaceCssHoc will look at its parents to search for a Themeprovider.
     * Some pages (like the contract checkout) are wraped into the marketplaceCssHoc but don't have parent
     * that provide a theme. That's why we need to wrap the router into a MuiThemeProvider
     */
    <Switch>
      <Route
        component={OneClickBookingModule}
        path="/one-click-booking/:companyId/:offerId"
      />
      <Route
        component={ExpressPassCheckout}
        path="/pass-express-checkout/:companyId/:passId/:passType"
      />
      <Route
        component={ConfirmationCheckout}
        path={'/checkout-s/:companyId/validation'}
      />
      <AuthenticatedSwitch
        companyId={companyId}
        isAuthenticated={authenticated}
        location={location}
        routes={[
          {
            component: BoutiqueBookerModule,
            path: '/booker-module-s/:companyId/:offerId',
            redirectTo:
              theme.one_click_checkout_enabled &&
              !theme.requires_email_confirmation_when_signing_up
                ? ({ params }) =>
                    getOneClickBookingUrl(
                      Number(params.companyId),
                      Number(params.offerId),
                      window.location.search,
                    )
                : undefined,
          },
          {
            component: showMemberAreaBasketUnified
              ? MemberAreaBasketUnifiedPage
              : BasketPage,
            path: '/checkout-s/:companyId',
          },
          {
            component: BoutiqueContractCheckout,
            path: '/contract-s/:companyId/:contractId',
          },
        ]}
      />
    </Switch>
  );
};

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    is_manager: state.auth.is_manager,
    theme: themeSelectors.getTheme(state),
  }),
  {
    fetchProfile: fetchProfileAction,
    fetchCompanyTheme,
    requestOptInTrackingB2C: requestOptInTrackingB2CAction,
  },
);

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
  }),
  connector,
  withThemeProvider,
)(NewBookingFlowRouter);
