import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { RouteChildrenProps, withRouter } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { push as pushRouter } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { getPlaylistList } from '../../libs/playlist/selectors';
import {
  getVideoList,
  withVideoCoach,
  withVideoCategory,
} from '../../libs/video/selectors';

import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import VideoSearchBar from '../../libs/video/components/VideoSearchBar.component';
import VideoItemList from '../../libs/video/components/VideoItemList.component';
import {
  fetchVideoList as fetchVideoListAction,
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoFilterableParams,
} from '../../libs/video/actions';
import { fetchPlaylistList } from '../../libs/playlist/actions';

import MarketplacePlaylistItem from '../../libs/playlist/components/PlaylistItemMarketplace.component';
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { getMarketplaceRoute } from './routing-utils';
import { VideoStatusEnum } from '../../libs/video/types';

type OwnProps = {
  companyId: number;
  companyName: string;
  searchParams: {
    coaches: string;
    duration_second_range: string;
    SCTs: string;
    search: string;
    levels: string;
  };
  setSearchParams: (key: string) => (value: any) => void;
  openVideo?: (videoId: number, companyId: number, companyName: string) => void;
  openPlaylist?: (id: number, companyId: number, companyName: string) => void;
};

type ConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = ConnectedProps &
  WithHandlerType<typeof mapHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  RouteChildrenProps<any>;

export class MarketplaceVideo extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchVideoList();
    this.props.fetchPlaylistList({ company: this.props.companyId });
    this.props.fetchVideoFilterableParams({
      company: this.props.companyId,
      status: VideoStatusEnum.processed,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.searchParams !== this.props.searchParams) {
      this.props.fetchVideoList();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.container2}>
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
          {!!this.props.playlistList.length && (
            <div className={classes.playlistListContainer}>
              <Typography variant="h6" component="h3">
                {this.props.t('playlist.playlist')}
              </Typography>
              <div className={classes.playlistItemsContainer}>
                {this.props.playlistList.map((pl: any) => (
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
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme: any) => ({
  container: {
    width: '100%',
  },
  container2: {
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

const mapStateToProps = (state: RootState) => ({
  playlistList: getPlaylistList(state),
  videoList: withVideoCoach(withVideoCategory(getVideoList))(state),
  loading: state.video.loading,
  videoFilterableParams: state.video.filterableParams.items,
  hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
});

const mapDispatchToProps = {
  fetchVideoList: fetchVideoListAction,
  fetchPlaylistList,
  fetchMoreVideo: fetchMoreVideoAction,
  push: pushRouter,
  fetchVideoFilterableParams,
};

const turnSearchParamsIntoQueryParams = (searchParams?: any) => {
  const params: any = {};
  if (searchParams && searchParams.SCTs) {
    params.SCT__pk__in = searchParams.SCTs;
  }
  if (searchParams && searchParams.coaches) {
    params.coaches__id__in = searchParams.coaches;
  }
  if (searchParams && searchParams.levels) {
    params.level__pk__in = searchParams.levels;
  }
  if (searchParams && searchParams.search) {
    params.search = searchParams.search;
  }
  return params;
};

const mapHandlers = {
  fetchMoreVideo: (props: ConnectedProps) => () => {
    const params = turnSearchParamsIntoQueryParams(props.searchParams);
    props.fetchMoreVideo({
      status: VideoStatusEnum.processed,
      company: props.companyId,
      ...params,
    });
  },
  fetchVideoList: (props: ConnectedProps) => (options: any) => {
    const params = turnSearchParamsIntoQueryParams(props.searchParams);
    props.fetchVideoList(
      {
        status: VideoStatusEnum.processed,
        company: props.companyId,
        is_marketplace: true,
        ...params,
      },
      1,
      options,
    );
  },
  openVideo: (props: ConnectedProps) => (videoId: number) => {
    if (props.openVideo) {
      props.openVideo(videoId, props.companyId, props.companyName);
      return;
    }
    props.push(
      getMarketplaceRoute(
        props.companyName,
        props.companyId,
        `vod/video/${videoId}`,
      ),
    );
  },
  openPlaylist: (props: ConnectedProps) => (id: number) => {
    if (props.openPlaylist) {
      props.openPlaylist(id, props.companyId, props.companyName);
      return;
    }

    props.push(`/m/${props.companyName}/${props.companyId}/vod/playlist/${id}`);
  },
};

export const MarketplaceVideoDataProvider = compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['video']),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapHandlers),
);

export default compose<any, OwnProps>(
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
  MarketplaceVideoDataProvider,
)(MarketplaceVideo);
