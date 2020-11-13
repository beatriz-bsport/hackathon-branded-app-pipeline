// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import VodVideoListPage from './VodVideoList.page';
import VodPlaylistListPage from './VodPlaylistList.page';
import VodPlaylistDetailPage from './VodPlaylistDetail.page';
import VodVideoDetailPage from './VodVideoDetail.page';

export const VodRouter = () => {
  return (
    <Switch>
      <Route path="/vod/video/:videoId" component={VodVideoDetailPage} />
      <Route path="/vod/video" component={VodVideoListPage} />
      <Route
        path="/vod/playlist/:id/video/:videoId"
        component={VodPlaylistDetailPage}
      />
      <Route path="/vod/playlist/:id" component={VodPlaylistDetailPage} />
      <Route path="/vod/playlist" component={VodPlaylistListPage} />
    </Switch>
  );
};

export default VodRouter;
