import React from 'react';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { RouteChildrenProps, withRouter } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { push as pushRouter } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  createStyles,
  withStyles,
  type WithStyles,
  type Theme,
} from '@material-ui/core/styles';
import PlaylistListMarketPlace from '#src/libs/playlist/components/PlaylistListMarketplace.component';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { getPlaylistList } from '#src/libs/playlist/selectors';
import {
  getVideoList,
  withVideoCoach,
  withVideoCategory,
} from '#src/libs/video/selectors';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { urlToMarketplaceTab } from '#src/libs/marketplace/utils';

import VideoSearchBar from '#src/libs/video/components/VideoSearchBar.component';
// @ts-expect-error
import VideoItemList from '#src/libs/video/components/VideoItemList.component';
import {
  fetchVideoList as fetchVideoListAction,
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoFilterableParams,
} from '#src/libs/video/actions';
import {
  fetchPlaylistList,
  fetchMorePlaylist,
} from '#src/libs/playlist/actions';

import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { getActiveCustomLevels } from '#src/libs/level/selectors';

import themeSelectors from '#src/libs/theme/selectors';
import { getMarketplaceRoute } from '#src/libs/marketplace/routing-utils';
import { Video, VideoStatusEnum } from '#src/libs/video/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import { PLAYLIST_PAGE_SIZE } from '#src/libs/playlist/constant';
import type { WithHandlerType } from '../../utils/types';
import type { RootState } from '../../reducers';
import { OptionCallback } from '#src/state/types';

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
  companyTheme?: CompanyTheme;
  store?: any;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapHandlers> &
  WithStyles<typeof styles> &
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
    this.props.fetchLevelList({
      company: this.props.companyId,
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
      <div
        className={clsx(
          classes.container,
          'bs-marketplace-vod-page__main-container',
        )}
      >
        <div
          className={clsx(
            classes.container2,
            'bs-marketplace-vod-page__sub-container',
          )}
        >
          <div
            className={clsx(
              classes.videoListContainer,
              'bs-marketplace-vod-page__vod-list-container',
            )}
          >
            <div
              className={clsx(
                classes.searchContainer,
                'bs-marketplace-vod-page__vod-search-container',
              )}
            >
              <VideoSearchBar
                coachDisplay={this.props.companyTheme?.coach_display}
                coaches={this.props.videoFilterableParams.coaches || []}
                customLevels={this.props.customLevels || []}
                hideCoach={
                  this.props.companyTheme && this.props.companyTheme.hideCoach
                }
                onChangeSearchParams={this.props.setSearchParams}
                scts={this.props.videoFilterableParams.SCTs || []}
                searchParams={this.props.searchParams}
              />
            </div>
            <Divider
              className={clsx(
                classes.divider,
                'bs-marketplace-vod-page__search-divider',
              )}
            />
            <VideoItemList
              coachDisplay={this.props.companyTheme?.coach_display}
              hasMoreVideo={this.props.hasMoreVideo}
              hideCoach={
                this.props.companyTheme && this.props.companyTheme.hideCoach
              }
              loading={this.props.loading}
              onShowMore={this.props.fetchMoreVideo}
              openVideo={this.props.openVideo}
              videoList={this.props.videoList}
            />
          </div>
          {!!this.props.playlistList.length && (
            <PlaylistListMarketPlace
              hasMorePlaylist={this.props.hasMorePlaylist}
              onShowMore={this.props.fetchMorePlaylist}
              openPlaylist={this.props.openPlaylist}
              playlistList={this.props.playlistList}
            />
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
  });
const mapStateToProps = (state: RootState) => ({
  playlistList: getPlaylistList(state),
  companyTheme: themeSelectors.getTheme(state),
  videoList: withVideoCoach(withVideoCategory(getVideoList))(state),
  loading: state.video.loading,
  videoFilterableParams: state.video.filterableParams.items,
  hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
  hasMorePlaylist:
    state.playlist.list.nextPage && state.playlist.list.nextPage > 1,
  customLevels: getActiveCustomLevels(state),
});

const mapDispatchToProps = {
  fetchVideoList: fetchVideoListAction,
  fetchPlaylistList,
  fetchMorePlaylist,
  fetchMoreVideo: fetchMoreVideoAction,
  push: pushRouter,
  fetchVideoFilterableParams,
  fetchLevelList: fetchLevelListAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

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

  const { duration_second_range } = searchParams;

  if (typeof duration_second_range === 'string') {
    params.duration_second_range = duration_second_range;
  }

  return params;
};

const mapHandlers = {
  fetchMoreVideo: (props: OwnAndConnectedProps) => () => {
    const params = turnSearchParamsIntoQueryParams(props.searchParams);
    props.fetchMoreVideo({
      status: VideoStatusEnum.processed,
      company: props.companyId,
      is_marketplace: true,
      ...params,
    });
  },
  fetchVideoList:
    (props: OwnAndConnectedProps) => (options: OptionCallback<Video[]>) => {
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
  fetchPlaylistList: (props: OwnAndConnectedProps) => () => {
    props.fetchPlaylistList({
      company: props.companyId,
      page_size: PLAYLIST_PAGE_SIZE,
    });
  },
  fetchMorePlaylist: (props: OwnAndConnectedProps) => () => {
    props.fetchMorePlaylist({
      company: props.companyId,
      page_size: PLAYLIST_PAGE_SIZE,
    });
  },
  openVideo: (props: OwnAndConnectedProps) => (videoId: number) => {
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
  openPlaylist: (props: OwnAndConnectedProps) => (id: number) => {
    if (props.openPlaylist) {
      props.openPlaylist(id, props.companyId, props.companyName);
      return;
    }

    props.push(
      urlToMarketplaceTab(
        props.companyName,
        props.companyId.toString(),
        `vod/playlist/${id}`,
      ),
    );
  },
};

export const MarketplaceVideoDataProvider = compose<Props, OwnProps>(
  marketplaceCssHoc(),
  withStyles(styles),
  withTranslation('video'),
  connector,
  withHandlers(mapHandlers),
);

export default compose<any, OwnProps>(
  withRouter,
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName:string',
  }),
  withQueryParams([
    ['coaches', 'duration_second_range', 'SCTs', 'search', 'levels'],
    'searchParams',
    'setSearchParams',
  ]),
  MarketplaceVideoDataProvider,
)(MarketplaceVideo);
