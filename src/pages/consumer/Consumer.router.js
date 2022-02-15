// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import asyncComponent from '../../AsyncComponent';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { getAuthToken } from '../../http';
import { fetchMarketplaceSettings } from '#libs/marketplace/actions';
import { getFranchiseId } from '#libs/franchise/selectors';

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
  companyId: ?string,
  isManager: boolean,
  authenticated: boolean,
  // franchisorId?: number,
};

export const ConsumerRouter = (props: Props) => {
  if (
    !props.authenticated &&
    props.companyId &&
    !window.location.pathname.includes('change_email')
  ) {
    return <Redirect to={`/login/customer?membership=${props.companyId}`} />;
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
          path="/c/franchisee-selector/:franchisorId"
          component={ConsumerFranchiseeSelector}
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
        path="/c/membership-validator/:companyId/"
        component={ConsumerMembershipValidator}
      />
      <Route
        exact
        path="/c/membership-selector/"
        component={ConsumerMembershipSelector}
      />
      <Route
        exact
        path="/c/franchisee-selector/:franchisorId"
        component={ConsumerFranchiseeSelector}
      />

      <Route
        path="/c/:companyId/change_email/:uuid"
        component={ConsumerChangeEmailRequestPage}
      />
      <Route path="/c/:companyId/" component={ConsumerHome} />
      <Route exact path="/(|customer)" component={ConsumerSpacePreSelector} />
      <Route path="/" component={ConsumerSpacePreSelector} />
    </Switch>
  );
};

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
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
    componentWillMount() {
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
