// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';

import VideoThumbnailList from '../../video/components/VideoThumbnailList.component';
import VideoPlayerFull from '../../video/components/VideoPlayerFull.component';

import PlaylistEmpty from './PlaylistEmpty.component';

type Props = {
  onAddVideo: (id: number, options: OptionCallback) => void,
  selectedVideo: ?Video,
  videoPlayingId: ?number,
  playlist: VideoPlaylist,
  onOpenVideo: (id: number) => void,
  onSubVideo: (id: number, options: OptionCallback) => void,
  authenticated: boolean,
  requestVideoAccess: ?() => void,
};

const PlaylistDetail = (props: Props) => {
  return (
    <Grid spacing={2} container direction="row">
      <Grid item xs={12} md={8}>
        {props.selectedVideo ? (
          <VideoPlayerFull
            authenticated={props.authenticated}
            video={props.selectedVideo}
            requestVideoAccess={props.requestVideoAccess}
          />
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

export default PlaylistDetail;
