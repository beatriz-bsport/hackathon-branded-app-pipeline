// @flow

import React from 'react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'connected-react-router';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import themeSelectors from '../../libs/theme/selectors';

import { WidgetUtils } from '../../libs/widget/WidgetUtils';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  getVideoList,
  withCategory,
  withCoach,
} from '../../libs/video/selectors';
import {
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoList as fetchVideoListAction,
} from '../../libs/video/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { getMarketplaceRoute } from '../../libs/marketplace/routing-utils';
import VideoItemList from '../../libs/video/components/VideoItemList.component';

type Props = {
  fetchVideoList: () => void,
  fetchMoreVideo: () => void,
  fetchAssociatedCoachesList: (params: any) => void,
  videoList: Array<Video>,
  loading: boolean,
  hasMoreVideo: boolean,
  hideCoach: boolean,
  goToVodPage: () => void,
  openVideo: () => void,
  companyId: string,
  classes: Object,
  t: TFunction,
};

const STATUS_PROCESSED = 400;

class ConsumerVOD extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchVideoList();
    this.props.fetchAssociatedCoachesList({ company: this.props.companyId });
  }

  onCLickGoToVod = () => {
    this.props.goToVodPage();
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        {!WidgetUtils.isWidget() && (
          <div className={this.props.classes.header}>
            <Button
              onClick={this.onCLickGoToVod}
              color="primary"
              variant="contained"
            >
              <VideoLibrary className={this.props.classes.iconLeft} />
              {this.props.t('myVideos.gotToVOD')}
            </Button>
          </div>
        )}
        <Typography variant="h4" component="h3">
          {this.props.t('myVideos.title')}
        </Typography>
        <Divider className={this.props.classes.sectionDivider} />
        <VideoItemList
          hideCoach={this.props.hideCoach}
          videoList={this.props.videoList}
          openVideo={this.props.openVideo}
          onShowMore={this.props.fetchMoreVideo}
          hasMoreVideo={this.props.hasMoreVideo}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
  },
  sectionDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      videoList: withCoach(withCategory(getVideoList))(state),
      loading: state.video.loading,
      hideCoach: themeSelectors.getTheme(state).hideCoach,
      hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
    }),
    {
      fetchVideoList: fetchVideoListAction,
      fetchAssociatedCoachesList,
      fetchMoreVideo: fetchMoreVideoAction,
      push: pushRouter,
    },
  ),
  routerParamsToProps({
    companyId: 'companyId:number',
  }),
  withTranslation(['consumerSpace']),
  withHandlers({
    openVideo:
      ({ membership, push }) =>
      (videoId) => {
        const url = getMarketplaceRoute(
          membership.company_name,
          membership.company,
          `vod/video/${videoId}`,
        );
        push(url);
      },
    goToVodPage:
      ({ membership, push }) =>
      () =>
        push(
          getMarketplaceRoute(
            membership.company_name,
            membership.company,
            'vod/video',
          ),
        ),
    fetchMoreVideo:
      ({ fetchMoreVideo, companyId }) =>
      () => {
        fetchMoreVideo({
          status: STATUS_PROCESSED,
          company: companyId,
          my_purchases: true,
        });
      },
    fetchVideoList:
      ({ companyId, fetchVideoList }) =>
      (options) => {
        fetchVideoList(
          {
            status: STATUS_PROCESSED,
            company: companyId,
            my_purchases: true,
          },
          1,
          options,
        );
      },
  }),
)(ConsumerVOD);
