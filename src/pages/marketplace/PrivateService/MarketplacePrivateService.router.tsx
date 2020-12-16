import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateServiceDetailPage from './PrivateServiceDetailPage/PrivateServiceDetail.page.tsx';
import PrivateServiceSelectorPage from './PrivateServiceSelectorPage/PrivateServiceSelector.page.tsx';

export const MarketplacePrivateServiceRouter: React.FC = () => {
  return (
    <Switch>
      <Route
        path="/m/:companyName/:companyId/private-service/:serviceId"
        component={PrivateServiceDetailPage}
      />

      <Route
        path="/m/:companyName/:companyId/private-service"
        component={PrivateServiceSelectorPage}
      />
    </Switch>
  );
};

export default MarketplacePrivateServiceRouter;
