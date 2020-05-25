// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MarketplaceVideo from './MarketplaceVideo.page';
import MarketplaceVideoDetail from './MarketplaceVideoDetail.page';

export const MarketplaceVodRouter = () => {
  return (
    <Switch>
      <Route
        path="/m/:companyName/:companyId/vod/video/:videoId"
        component={MarketplaceVideoDetail}
      />
      <Route
        path="/m/:companyName/:companyId/vod"
        component={MarketplaceVideo}
      />
    </Switch>
  );
};

export default MarketplaceVodRouter;
