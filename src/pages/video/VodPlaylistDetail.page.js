// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import flatten from 'lodash/flatten';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';

import PlaylistDetail from '../../libs/playlist/components/PlaylistDetail.component';
import VideoSearchModal from '../../libs/video/components/VideoSearchModal.component';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions.ts';
import { getPlaylist, withCoachInVideo } from '../../libs/playlist/selectors';
import {
  retrievePlaylist as retrievePlaylistAction,
  subVideoToPlaylist as subVideoToPlaylistAction,
  addVideoToPlaylist as addVideoToPlaylistAction,
} from '../../libs/playlist/actions';
import {
  fetchVideoBulk as fetchVideoBulkAction,
  retrieveVideo as retrieveVideoAction,
  searchVideo as searchVideoAction,
} from '../../libs/video/actions';
import {
  getVideoSearchList,
  getVideo,
  withCoach,
  withCategory,
} from '../../libs/video/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  id: number,
  videoId: number,

  loading: boolean,
  retrievePlaylist: () => void,
  retrieveVideo: (id: number) => void,
  replaceToVideoInPlaylist: (playlistId: number, videoId: number) => void,
  goToVideoInPlaylist: (videoId: number) => void,

  classes: Object,
  searchVideoText: string,
  searchVideo: (SyntheticEvent<>) => void,
  searchLoading: boolean,
  searchedVideoList: Array<Video>,
  closeVideoSearch: () => void,
  addVideoToPlaylist: (Video, OptionCallback) => void,

  videoSearchOpen: boolean,

  openVideoSearch: () => void,
  subVideoToPlaylist: (Video, OptionCallback) => void,
  playlist: ?VideoPlaylist,
  videoId: ?number,
  selectedVideo: ?Video,
};

export class VodPlaylistDetailPage extends React.Component<Props> {
  componentDidMount() {
    this.props.retrievePlaylist();
    if (this.props.videoId) {
      this.props.retrieveVideo(this.props.videoId);
    }

    const currentFirstVideoId = this.getFirstVideoId(this.props);
    if (currentFirstVideoId) {
      this.props.replaceToVideoInPlaylist(this.props.id, currentFirstVideoId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const currentFirstVideoId = this.getFirstVideoId(this.props);
    const prevFirstVideoId = this.getFirstVideoId(prevProps);

    if (currentFirstVideoId && currentFirstVideoId !== prevFirstVideoId) {
      this.props.goToVideoInPlaylist(currentFirstVideoId);
    }
    if (!!this.props.videoId && this.props.videoId !== prevProps.videoId) {
      this.props.retrieveVideo(this.props.videoId);
    }
  }

  getFirstVideoId = (props: Props) => {
    if (
      !props.videoId &&
      !!props.playlist &&
      !!props.playlist.videos &&
      !!props.playlist.videos.length &&
      !!props.playlist.videos[0]
    ) {
      return props.playlist.videos[0].id;
    }
    return null;
  };

  render() {
    if (this.props.loading || !this.props.playlist) {
      return <LinearProgress />;
    }
    return (
      <div container={this.props.classes.container}>
        <PlaylistDetail
          onAddVideo={this.props.openVideoSearch}
          onSubVideo={this.props.subVideoToPlaylist}
          playlist={this.props.playlist}
          videoPlayingId={this.props.videoId}
          selectedVideo={this.props.selectedVideo}
          onOpenVideo={this.props.goToVideoInPlaylist}
          authenticated
        />
        {!!this.props.videoSearchOpen && (
          <VideoSearchModal
            text={this.props.searchVideoText}
            onChangeText={this.props.searchVideo}
            videoList={this.props.searchedVideoList}
            loading={this.props.searchLoading}
            onClose={this.props.closeVideoSearch}
            onSubmit={this.props.addVideoToPlaylist}
          />
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({ id: 'id:number', videoId: 'videoId:number' }),
  connect(
    (state, { id, videoId }) => ({
      playlist: withCoachInVideo(getPlaylist)(state, id),
      loading: state.playlist.loading,
      searchedVideoList: getVideoSearchList(state),
      searchLoading: state.video.search.loading,
      selectedVideo: withCategory(withCoach(getVideo))(state, videoId),
    }),
    {
      retrievePlaylist: retrievePlaylistAction,
      retrieveVideo: retrieveVideoAction,
      fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
      fetchVideoBulk: fetchVideoBulkAction,
      addVideoToPlaylist: addVideoToPlaylistAction,
      subVideoToPlaylist: subVideoToPlaylistAction,
      searchVideo: searchVideoAction,
      goToVideoInPlaylist: (playlist, video) =>
        push(`/vod/playlist/${playlist}/video/${video}`),
      replaceToVideoInPlaylist: (playlist, video) =>
        replace(`/vod/playlist/${playlist}/video/${video}`),
    },
  ),
  withHandlers({
    retrieveVideo: ({ retrieveVideo, fetchAssociatedCoachBulk }) => (id) => {
      retrieveVideo(id, {
        onSuccess: (video) => fetchAssociatedCoachBulk(video.coaches),
      });
    },
    retrievePlaylist: ({
      id,
      retrievePlaylist,
      fetchVideoBulk,
      fetchAssociatedCoachBulk,
    }) => () => {
      retrievePlaylist(id, {
        onSuccess: (pl) => {
          fetchVideoBulk(pl.videos, {
            onSuccess: (videos) => {
              fetchAssociatedCoachBulk(flatten(videos.map((v) => v.coaches)));
            },
          });
        },
      });
    },
  }),
  withStateHandlers(
    {
      videoSearchOpen: false,
      searchVideoText: '',
    },
    {
      setSearchVideoText: () => (searchVideoText) => ({ searchVideoText }),
      openVideoSearch: () => () => ({ videoSearchOpen: true }),
      closeVideoSearch: () => () => ({ videoSearchOpen: false }),
    },
  ),
  withHandlers({
    goToVideoInPlaylist: ({ goToVideoInPlaylist, id }) => (videoId) =>
      goToVideoInPlaylist(id, videoId),
    searchVideo: ({ searchVideo, setSearchVideoText }) => (ev) => {
      setSearchVideoText(ev.target.value);
      if (ev.target.value) {
        searchVideo({ search: ev.target.value, mine: true });
      }
    },
    addVideoToPlaylist: ({
      retrievePlaylist,
      addVideoToPlaylist,
      closeVideoSearch,
      id,
      replaceToVideoInPlaylist,
    }) => (video, options) => {
      addVideoToPlaylist(id, video, {
        onSuccess: (playlist) => {
          closeVideoSearch();
          retrievePlaylist();
          if (options && options.onSuccess) {
            options.onSuccess(playlist);
          }
          replaceToVideoInPlaylist(id, video);
        },
        onError: options && options.onError,
      });
    },
    subVideoToPlaylist: ({
      subVideoToPlaylist,
      retrievePlaylist,
      closeVideoSearch,
      id,
      videoId,
      replaceToVideoInPlaylist,
    }) => (video, options) => {
      subVideoToPlaylist(id, video, {
        onSuccess: (playlist) => {
          if (options && options.onSuccess) {
            options.onSuccess(playlist);
          }
          closeVideoSearch();
          retrievePlaylist();
          if (videoId === video) {
            replaceToVideoInPlaylist(id, '');
          }
        },
        onError: options && options.onError,
      });
    },
  }),
)(VodPlaylistDetailPage);
