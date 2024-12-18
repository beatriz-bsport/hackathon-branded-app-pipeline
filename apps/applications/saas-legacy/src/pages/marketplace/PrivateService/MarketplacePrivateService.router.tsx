import React from 'react';
import { Route, Switch } from 'react-router-dom';
// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';
import Config from '#src/config';

const PrivateServiceDetailPage = asyncComponent(
  () => import('./PrivateServiceDetailPage/PrivateServiceDetail.page'),
);

const PrivateServiceSelectorPage = asyncComponent(
  () => import('./PrivateServiceSelectorPage/PrivateServiceSelector.page'),
);

const SlotSelectorPage = asyncComponent(() => import('./SlotSelectorPage'));

const SlotSelectorPageComponent =
  Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production'
    ? SlotSelectorPage
    : PrivateServiceDetailPage;

export const MarketplacePrivateServiceRouter: React.FC = () => {
  return (
    <Switch>
      <Route
        component={SlotSelectorPageComponent}
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
