import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateServiceDetailPage from './PrivateServiceDetailPage/PrivateServiceDetail.page';
import PrivateServiceSelectorPage from './PrivateServiceSelectorPage/PrivateServiceSelector.page';

export const MarketplacePrivateServiceRouter: React.FC = () => {
  return (
    <Switch>
      <Route
        component={PrivateServiceDetailPage}
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
