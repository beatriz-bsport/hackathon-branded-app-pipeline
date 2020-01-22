// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../AsyncComponent';

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

export const ConsumerRouter = () => (
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

export default ConsumerRouter;
