// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ConsumerHome from './ConsumerHome.page';
import ConsumerSpacePreSelector from './ConsumerSpacePreSelector.router';
import ConsumerMembershipSelector from './ConsumerMembershipSelector.page';
import ConsumerMembershipValidator from './ConsumerMembershipValidator.page';

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
    <Route exact path="/(|customer)" component={ConsumerSpacePreSelector} />
    <Route path="/c/:companyId/" component={ConsumerHome} />
  </Switch>
);

export default ConsumerRouter;
