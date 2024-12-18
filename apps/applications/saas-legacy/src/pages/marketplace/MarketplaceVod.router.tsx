import React, { useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';

import MarketplaceVideo from './MarketplaceVideo.page';
import MarketplaceVideoDetail from './MarketplaceVideoDetail.page';
import MarketplacePlaylistDetailPage from './MarketplacePlaylistDetail.page';

interface Props {
  requestSignUp: () => void;
}

export const MarketplaceVodRouter: React.FC<Props> = (props) => {
  const withProps = useCallback(
    (Component: any, routeProps: any) => {
      return <Component {...props} {...routeProps} />;
    },
    [props],
  );

  return (
    <Switch>
      <Route
        path="/m/:companyName/:companyId/vod/video/:videoId"
        render={(routeProps) => withProps(MarketplaceVideoDetail, routeProps)}
      />

      <Route
        path="/m/:companyName/:companyId/vod/playlist/:id/video/:videoId"
        render={(routeProps) =>
          withProps(MarketplacePlaylistDetailPage, routeProps)
        }
      />
      <Route
        path="/m/:companyName/:companyId/vod/playlist/:id"
        render={(routeProps) =>
          withProps(MarketplacePlaylistDetailPage, routeProps)
        }
      />

      <Route
        path="/m/:companyName/:companyId/vod"
        render={(routeProps) => withProps(MarketplaceVideo, routeProps)}
      />
    </Switch>
  );
};

export default MarketplaceVodRouter;
