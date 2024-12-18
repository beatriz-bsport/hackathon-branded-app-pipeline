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
  playbackUrl: string,
  playbackUrlLoading: boolean,
  accessDenied: boolean,
};

const PlaylistDetail = (props: Props) => {
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item md={8} xs={12}>
        {props.selectedVideo ? (
          <VideoPlayerFull
            accessDenied={props.accessDenied}
            authenticated={props.authenticated}
            playbackUrl={props.playbackUrl}
            playbackUrlLoading={props.playbackUrlLoading}
            requestVideoAccess={props.requestVideoAccess}
            video={props.selectedVideo}
          />
        ) : (
          <PlaylistEmpty onAddVideo={props.onAddVideo} />
        )}
      </Grid>
      <Grid item md={4} xs={12}>
        <VideoThumbnailList
          count={props.playlist.videos.length}
          description={props.playlist.description}
          onAddVideo={props.onAddVideo}
          onDeleteVideo={props.onSubVideo}
          onOpenVideo={props.onOpenVideo}
          title={props.playlist.name}
          videoList={props.playlist.videos}
          videoPlayingId={props.videoPlayingId}
        />
      </Grid>
    </Grid>
  );
};

export default PlaylistDetail;
