// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { push as pushRouter } from 'connected-react-router';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';


import { getMarketplaceRoute } from './routing-utils';

import {
  getVideoList,
  withCategory,
  withCoach,
} from '../../libs/video/selectors';
import VideoSearchBar from '../../libs/video/components/VideoSearchBar.component';
import VideoItemList from '../../libs/video/components/VideoItemList.component';
import {
  fetchVideoList as fetchVideoListAction,
  fetchMoreVideo as fetchMoreVideoAction,
} from '../../libs/video/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';

import VideoStreamDialog from '../../libs/video/components/VideoStreamDialog.component';

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
        <div className={this.props.classes.container}>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '&>*': {
      maxWidth: 1200,
      width: '100%',
    },
  },
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  gridContainer: {},
  divider: {
    marginBottom: theme.spacing(4),
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
  connect(
    (state) => ({
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
        status: 400,
        company: companyId,
        ...(searchParams || {}),
      });
    },
    fetchVideoList: ({ companyId, fetchVideoList, searchParams }) => (
      options,
    ) => {
      fetchVideoList(
        { status: 400, company: companyId, ...(searchParams || {}) },
        1,
        options,
      );
    },
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
