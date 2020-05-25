// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import type { TFunction } from 'react-i18next';

import VideoThumbnailList from '../../video/components/VideoThumbnailList.component';
import VideoPlayerFull from '../../video/components/VideoPlayerFull.component';

import PlaylistEmpty from './PlaylistEmpty.component';

type Props = {
  onAddVideo: (id: number) => void,
  onDeleteVideo: (id: number) => void,
  t: TFunction,
};
export const PlaylistDetail = (props: Props) => {
  return (
    <Grid spacing={2} container direction="row">
      <Grid item xs={12} md={8}>
        {props.selectedVideo ? (
          <VideoPlayerFull video={props.selectedVideo} />
        ) : (
          <PlaylistEmpty onAddVideo={props.onAddVideo} />
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        <VideoThumbnailList
          onAddVideo={props.onAddVideo}
          onDeleteVideo={props.onSubVideo}
          videoList={props.playlist.videos}
          videoPlayingId={props.videoPlayingId}
          onOpenVideo={props.onOpenVideo}
          description={props.playlist.description}
          title={props.playlist.name}
          count={props.playlist.videos.length}
        />
      </Grid>
    </Grid>
  );
};

export default compose(withTranslation())(PlaylistDetail);
