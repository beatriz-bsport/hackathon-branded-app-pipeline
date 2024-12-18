import React from 'react';
import { Route, Switch } from 'react-router';

import FeatureBaseBoardPage from './FeatureBaseBoard.page';

function FeatureBaseRoutes() {
  return (
    <Switch>
      <Route component={FeatureBaseBoardPage} path="/feature-base" />
    </Switch>
  );
}

export default FeatureBaseRoutes;
