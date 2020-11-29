// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  getPlaylistList,
  withCoachInVideo,
} from '../../libs/playlist/selectors';
import {
  getVideoList,
  withCategory,
  withCoach,
} from '../../libs/video/selectors';

import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getMarketplaceRoute } from './routing-utils';

import VideoSearchBar from '../../libs/video/components/VideoSearchBar.component';
import VideoItemList from '../../libs/video/components/VideoItemList.component';
import {
  fetchVideoList as fetchVideoListAction,
  fetchMoreVideo as fetchMoreVideoAction,
} from '../../libs/video/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { fetchPlaylistList } from '../../libs/playlist/actions';

import VideoStreamDialog from '../../libs/video/components/VideoStreamDialog.component';
import MarketplacePlaylistItem from '../../libs/playlist/components/PlaylistItemMarketplace.component';

const STATUS_PROCESSED = 400;

type Props = {
  fetchVideoList: () => void,
  videoList: Array<Video>,
  openVideo: (id: number) => void,
  fetchMoreVideo: () => void,
  hasMoreVideo: boolean,
  coaches: Array<Coach>,
  videoToStream: ?Video,
  closeVideoStream: () => void,
  fetchAssociatedCoachesList: (params: any) => void,
  location: Location,
  companyId: number,
  loading: boolean,
  classes: Object,
  SCTs: Array<SCT>,
  setSearchParams: (string, string) => void,
  fetchPlaylistList: (string) => void,
  openPlaylist: (string) => void,
  playlistList: Array<*>,
  t: TFunction,
  searchParams: {
    coach: string,
    duration_second_range: string,
    SCT: string,
    search: string,
    level: string,
  },
};

export class MarketplaceVideo extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchVideoList();
    this.props.fetchAssociatedCoachesList({ company: this.props.companyId });
    this.props.fetchPlaylistList({ company: this.props.companyId });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location.search !== this.props.location.search) {
      this.props.fetchVideoList();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!!this.props.loading && <LinearProgress />}
        <div className={classes.container}>
          <div className={classes.videoListContainer}>
            <div className={classes.searchContainer}>
              <VideoSearchBar
                searchParams={this.props.searchParams}
                onChangeSearchParams={this.props.setSearchParams}
                coaches={this.props.coaches}
                scts={this.props.SCTs}
              />
            </div>
            <Divider className={classes.divider} />
            <VideoItemList
              videoList={this.props.videoList}
              openVideo={this.props.openVideo}
              onShowMore={this.props.fetchMoreVideo}
              hasMoreVideo={this.props.hasMoreVideo}
              loading={this.props.loading}
            />
          </div>
          <div className={classes.playlistListContainer}>
            <Typography variant="h6" component="h3">
              {this.props.t('playlist.playlist')}
            </Typography>
            <div className={classes.playlistItemsContainer}>
              {this.props.playlistList.map((pl) => (
                <div className={classes.playlistListItem}>
                  <MarketplacePlaylistItem
                    key={pl.id}
                    title={pl.name}
                    imageUrl={pl.cover_main}
                    description={pl.description}
                    videoCount={this.props.t('video.thumbnailList.count', {
                      count: pl.videos.length,
                    })}
                    onClick={() => this.props.openPlaylist(pl.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {!!this.props.videoToStream && (
            <VideoStreamDialog
              video={this.props.videoToStream}
              onClose={this.props.closeVideoStream}
            />
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    '&>*': {
      maxWidth: 1200,
      width: '100%',
    },
  },
  videoListContainer: {
    display: 'flex',
    flexBasis: '80%',
    flexDirection: 'column',
  },
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(4),
  },
  playlistListContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '20%',
    border: 'solid',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderTopWidth: 1,
    paddingTop: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      borderLeftWidth: 1,
      borderTopWidth: 0,
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
  playlistItemsContainer: {
    marginLeft: -8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      flexWrap: 'no-wrap',
      maxWidth: 300,
      marginTop: 20,
    },
  },
  playlistListItem: {
    padding: 8,
    marginBottom: 8,
    [theme.breakpoints.up('lg')]: {
      marginBottom: 8,
    },
    [theme.breakpoints.down('md')]: {
      flexBasis: `${100 / 3}%`,
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
    },
  },
});

export default compose(
  withStyles(styles),
  withRouter,
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  withQueryParams([
    ['coach', 'duration_second_range', 'SCT', 'search', 'level'],
    'searchParams',
    'setSearchParams',
  ]),
  withTranslation('video'),
  connect(
    (state) => ({
      playlistList: [
        ...withCoachInVideo(getPlaylistList)(state),
        ...withCoachInVideo(getPlaylistList)(state),
        ...withCoachInVideo(getPlaylistList)(state),
      ],
      videoList: withCoach(withCategory(getVideoList))(state),
      loading: state.video.loading,
      SCTs: state.category.SCTs.filter((sct) =>
        getVideoList(state)
          .map((v) => v.SCT)
          .includes(sct.id),
      ),
      coaches: getActiveCoaches(state),
      hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
    }),
    {
      fetchVideoList: fetchVideoListAction,
      fetchPlaylistList,
      fetchAssociatedCoachesList,
      fetchMoreVideo: fetchMoreVideoAction,
      push: pushRouter,
    },
  ),
  withHandlers({
    openVideo: ({ companyName, companyId, push }) => (videoId) =>
      push(getMarketplaceRoute(companyName, companyId, `vod/video/${videoId}`)),
    fetchMoreVideo: ({ fetchMoreVideo, companyId, searchParams }) => () => {
      fetchMoreVideo({
        status: STATUS_PROCESSED,
        company: companyId,
        ...(searchParams || {}),
      });
    },
    fetchVideoList: ({ companyId, fetchVideoList, searchParams }) => (
      options,
    ) => {
      fetchVideoList(
        {
          status: STATUS_PROCESSED,
          company: companyId,
          ...(searchParams || {}),
        },
        1,
        options,
      );
    },
    openPlaylist: ({ companyName, companyId, push }) => (id) =>
      push(`/m/${companyName}/${companyId}/vod/playlist/${id}`),
  }),
  withStateHandlers(
    {
      videoToStream: null,
    },
    {
      closeVideoStream: () => () => ({ videoToStream: null }),
      setVideoToStream: () => (videoToStream) => ({ videoToStream }),
    },
  ),
)(MarketplaceVideo);
