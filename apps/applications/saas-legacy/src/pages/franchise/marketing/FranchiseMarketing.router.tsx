import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';

const FranchiseTagManagement = asyncComponent(
  () => import('./FranchiseTagManagement.page'),
);

const CommunicationSentGroupConfigList = asyncComponent(
  () =>
    import(
      './communication-sent-group-config/CommunicationSentGroupConfigListReworked.page'
    ),
);

// const CommunicationSentGroupConfigList = asyncComponent(
//   () =>
//     import(
//       './communication-sent-group-config/CommunicationSentGroupConfigList.page'
//     ),
// );

const CommunicationSentGroupConfigDetail = asyncComponent(
  () =>
    import(
      './communication-sent-group-config/CommunicationSentGroupConfigDetail.page'
    ),
);

export const MarketingRouter = () => {
  return (
    <Switch>
      <Route
        component={FranchiseTagManagement}
        path="/f/marketing/tags/:selectedTagId"
      />
      <Route component={FranchiseTagManagement} path="/f/marketing/tags" />
      <Route
        component={CommunicationSentGroupConfigDetail}
        path="/f/marketing/campaign/:campaignId/:tab/"
      />
      <Route
        component={CommunicationSentGroupConfigList}
        path="/f/marketing/campaign/:campaignId"
      />
      <Route
        component={CommunicationSentGroupConfigList}
        path="/f/marketing/campaign"
      />
    </Switch>
  );
};

export default MarketingRouter;
