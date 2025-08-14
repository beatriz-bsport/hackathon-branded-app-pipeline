// @flow
import React, { useEffect } from 'react';
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';

import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { fetchMarketplaceSettings } from '#src/libs/marketplace/actions';
import { getFranchiseId } from '#src/libs/franchise/selectors';
import { BsportRequestFromHeaderValue } from '../../constants';
import useSaasRouterTracker from '../../hooks/useSaasRouterTracker';
import asyncComponent from '../../AsyncComponent';
import { getAuthToken } from '../../http';
import namespaces from '../../i18n/namespaces.json';
import { configureAnalyticsB2CInstance } from '#src/components/analytics/mixpanel';

const ConsumerHome = asyncComponent(() => import('./ConsumerHome.page'));
const ConsumerSpacePreSelector = asyncComponent(() =>
  import('./ConsumerSpacePreSelector.router'),
);
const ConsumerMembershipSelector = asyncComponent(() =>
  import('./ConsumerMembershipSelector.page'),
);
const ConsumerMembershipValidator = asyncComponent(() =>
  import('./ConsumerMembershipValidator.page'),
);

const ConsumerChangeEmailRequestPage = asyncComponent(() =>
  import('./ConsumerChangeEmail.page'),
);
const ConsumerFranchiseeSelector = asyncComponent(() =>
  import('./ConsumerFranchiseeSelector.page'),
);
type Props = {
  companyId?: string,
  isManager: boolean,
  authenticated: boolean,
  // franchisorId?: number,
} & RouteProps;

export const ConsumerRouter = (props: Props) => {
  useSaasRouterTracker(BsportRequestFromHeaderValue.SAAS_CONSUMER_ROUTER);

  useEffect(() => {
    configureAnalyticsB2CInstance();
  }, []);

  if (
    !props.authenticated &&
    props.companyId &&
    !window.location.pathname.includes('change_email')
  ) {
    const { pathname } = props.location;
    return (
      <Redirect
        to={`/login/customer?membership=${
          props.companyId
        }&next=${encodeURIComponent(
          `${pathname}${props.location.search ?? '?'}&membership=${
            props.companyId
          }`,
        )}`}
      />
    );
  }
  if (
    !props.authenticated &&
    !window.location.pathname.includes('change_email')
  ) {
    return <Redirect to="/login" />;
  }
  if (props.isManager) {
    return (
      <Switch>
        <Route
          exact
          component={ConsumerFranchiseeSelector}
          path="/c/franchisee-selector/:franchisorId"
        />
        <Redirect to="/" />;
      </Switch>
    );
  }

  const token = getAuthToken();
  if (
    !getAuthToken() ||
    (token === 'null' && !window.location.pathname.includes('change_email'))
  ) {
    return <Redirect to="/login/signout" />;
  }
  return (
    <Switch>
      <Route
        exact
        component={ConsumerMembershipValidator}
        path="/c/membership-validator/:companyId/"
      />
      <Route
        exact
        component={ConsumerMembershipSelector}
        path="/c/membership-selector/"
      />
      <Route
        exact
        component={ConsumerFranchiseeSelector}
        path="/c/franchisee-selector/:franchisorId"
      />

      <Route
        component={ConsumerChangeEmailRequestPage}
        path="/c/:companyId/change_email/:uuid"
      />
      <Route component={ConsumerHome} path="/c/:companyId/" />
      <Route exact component={ConsumerSpacePreSelector} path="/(|customer)" />
      <Route component={ConsumerSpacePreSelector} path="/" />
    </Switch>
  );
};

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  withTranslation(namespaces),
  connect(
    (state) => ({
      authenticated: state.auth.authenticated,
      isManager: state.auth.is_manager,
      username: state.auth.username,
      theme: state.theme.theme,
      franchisorId: getFranchiseId(state),
    }),
    {
      fetchMarketplaceSettings,
    },
  ),
  lifecycle({
    UNSAFE_componentWillMount() {
      let id = this.props.companyId;
      if (Number.isNaN(id) || id === undefined) {
        if (this.props.theme.company !== undefined) {
          id = this.props.theme.company;
        }
      }

      this.props.fetchMarketplaceSettings(id);
    },
  }),
)(ConsumerRouter);
