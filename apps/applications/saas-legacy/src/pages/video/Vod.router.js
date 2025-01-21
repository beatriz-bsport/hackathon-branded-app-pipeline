// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import VodVideoListPage from './VodVideoList.page';
import VodPlaylistListPage from './VodPlaylistList.page';
import VodPlaylistDetailPage from './VodPlaylistDetail.page';
import VodVideoDetailPage from './VodVideoDetail.page';

const VodRouter = () => {
  return (
    <Switch>
      <Route component={VodVideoDetailPage} path="/vod/video/:videoId" />
      <Route component={VodVideoListPage} path="/vod/video" />
      <Route
        component={VodPlaylistDetailPage}
        path="/vod/playlist/:id/video/:videoId"
      />
      <Route component={VodPlaylistDetailPage} path="/vod/playlist/:id" />
      <Route component={VodPlaylistListPage} path="/vod/playlist" />
    </Switch>
  );
};

export default VodRouter;
