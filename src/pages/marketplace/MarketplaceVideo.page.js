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
import {
  getPlaylistList,
  withCoachInVideo,
} from '../../libs/playlist/selectors';
import {
  getVideoList,
  withVideoCoach,
  withVideoCategory,
} from '../../libs/video/selectors';

import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getMarketplaceRoute } from './routing-utils';

import VideoSearchBar from '../../libs/video/components/VideoSearchBar.component';
import VideoItemList from '../../libs/video/components/VideoItemList.component';
import {
  fetchVideoList as fetchVideoListAction,
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoFilterableParams,
} from '../../libs/video/actions';
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
  videoToStream: ?Video,
  closeVideoStream: () => void,
  location: Location,
  companyId: number,
  loading: boolean,
  classes: Object,
  setSearchParams: (string, string) => void,
  fetchPlaylistList: (string) => void,
  openPlaylist: (string) => void,
  playlistList: Array<*>,
  t: TFunction,
  searchParams: {
    coaches: string,
    duration_second_range: string,
    SCTs: string,
    search: string,
    levels: string,
  },
  fetchVideoFilterableParams: (params: any) => void,
  videoFilterableParams: { SCTs: Array<SCT>, coaches: Array<AssociatedCoach> },
};

export class MarketplaceVideo extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchVideoList();
    this.props.fetchPlaylistList({ company: this.props.companyId });
    this.props.fetchVideoFilterableParams({
      company: this.props.companyId,
      status: STATUS_PROCESSED,
    });
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
                coaches={this.props.videoFilterableParams.coaches || []}
                scts={this.props.videoFilterableParams.SCTs || []}
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
    ['coaches', 'duration_second_range', 'SCTs', 'search', 'levels'],
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
      videoList: withVideoCoach(withVideoCategory(getVideoList))(state),
      loading: state.video.loading || state.video.filterableParams.loading,
      videoFilterableParams: state.video.filterableParams.items,
      hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
    }),
    {
      fetchVideoList: fetchVideoListAction,
      fetchPlaylistList,
      fetchMoreVideo: fetchMoreVideoAction,
      push: pushRouter,
      fetchVideoFilterableParams,
    },
  ),
  withHandlers({
    turnSearchParamsIntoQueryParams: ({ searchParams }) => () => {
      const params = {};
      if (searchParams.SCTs) {
        params.SCT__pk__in = searchParams.SCTs;
      }
      if (searchParams.coaches) {
        params.coaches__id__in = searchParams.coaches;
      }
      if (searchParams.levels) {
        params.level__pk__in = searchParams.levels;
      }
      return params;
    },
  }),
  withHandlers({
    openVideo: ({ companyName, companyId, push }) => (videoId) =>
      push(getMarketplaceRoute(companyName, companyId, `vod/video/${videoId}`)),
    fetchMoreVideo: ({
      fetchMoreVideo,
      companyId,
      turnSearchParamsIntoQueryParams,
    }) => () => {
      const params = turnSearchParamsIntoQueryParams();
      fetchMoreVideo({
        status: STATUS_PROCESSED,
        company: companyId,
        ...params,
      });
    },
    fetchVideoList: ({
      companyId,
      fetchVideoList,
      turnSearchParamsIntoQueryParams,
    }) => (options) => {
      const params = turnSearchParamsIntoQueryParams();

      fetchVideoList(
        { status: STATUS_PROCESSED, company: companyId, ...params },
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
