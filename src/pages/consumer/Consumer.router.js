// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import asyncComponent from '../../AsyncComponent';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getAuthToken } from '../../http.ts';

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

type Props = {
  companyId: ?string,
  isManager: boolean,
  authenticated: boolean,
};

export const ConsumerRouter = (props: Props) => {
  if (!props.authenticated && props.companyId) {
    return <Redirect to={`/login/customer?membership=${props.companyId}`} />;
  }
  if (!props.authenticated) {
    return <Redirect to="/login" />;
  }
  if (props.isManager) {
    return <Redirect to="/" />;
  }

  const token = getAuthToken();
  if (!getAuthToken() || token === 'null') {
    return <Redirect to="/login/signout" />;
  }

  return (
    <Switch>
      <Route
        exact
        path="/c/membership-selector/"
        component={ConsumerMembershipSelector}
      />
      <Route
        exact
        path="/c/membership-validator/:companyId/"
        component={ConsumerMembershipValidator}
      />
      <Route path="/c/:companyId/" component={ConsumerHome} />
      <Route exact path="/(|customer)" component={ConsumerSpacePreSelector} />
      <Route path="/" component={ConsumerSpacePreSelector} />
    </Switch>
  );
};

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect((state) => ({
    authenticated: state.auth.authenticated,
    isManager: state.auth.is_manager,
    username: state.auth.username,
  })),
)(ConsumerRouter);
