import React from 'react';
import { Route, Switch } from 'react-router-dom';
// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';

const PrivateServiceSelectorPage = asyncComponent(
  () => import('./PrivateServiceSelectorPage/PrivateServiceSelector.page'),
);

const SlotSelectorPage = asyncComponent(() => import('./SlotSelectorPage'));

export const MarketplacePrivateServiceRouter: React.FC = () => {
  return (
    <Switch>
      <Route
        component={SlotSelectorPage}
        path="/m/:companyName/:companyId/private-service/:serviceId"
      />

      <Route
        component={PrivateServiceSelectorPage}
        path="/m/:companyName/:companyId/private-service"
      />
    </Switch>
  );
};

export default MarketplacePrivateServiceRouter;
