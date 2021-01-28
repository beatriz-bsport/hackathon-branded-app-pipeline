// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import { push as pushRouter } from 'connected-react-router';
import { LinearProgress, Theme } from '@material-ui/core';

import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import VideoThumbnailList from '../../libs/video/components/VideoThumbnailList.component';
import VideoPlayerFull from '../../libs/video/components/VideoPlayerFull.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getMarketplaceRoute } from './routing-utils';
import {
  retrieveVideo as retrieveVideoAction,
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoList as fetchVideoListAction,
  registerVideo as registerVideoAction,
} from '../../libs/video/actions';
import {
  getVideo,
  getVideoList,
  withCategory,
  withCoach,
} from '../../libs/video/selectors';

import {
  getConsumerPaymentPackCompatibleList,
  withPaymentPack,
} from '../../libs/consumer-payment-pack/selectors';
import { getPaymentPackCompatibleList } from '../../libs/payment-packs/selectors';
import {
  fetchConsumerPaymentPackCompatibleList as fetchConsumerPaymentPackCompatibleListAction,
  resetConsumerPaymentPackCompatibleList,
} from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import VideoRegisterDialog from '../../libs/video/components/RegisterVideoDialog.component';

import { fetchPrivateConsumerPassCompatibleList as fetchPrivateConsumerPassCompatibleListAction } from '../../libs/private-service/actions';
import { getPrivateConsumerPassCompatibleList } from '../../libs/private-service/selectors/private-consumer-pass';

import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { Video } from '../../libs/video/types';

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type OwnProps = {
  videoId: number;
  companyId: number;
  companyName: string;
  requestSignUp?: () => void;
  onRequestBuyPass: (companyId: number, companyName: string) => void;
  openVideo: (videoId: number, companyId: number, companyName: string) => void;
  store?: any;
  requestVideoAccessRefreshFlag?: number;
} & StateHandlerType;

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = ConnectProps &
  OwnProps &
  WithHandlerType<typeof mapHandlers> &
  MaterialStyleType<ReturnType<typeof styles>>;

export class MarketplaceVideoDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.retrieveVideo();
    this.props.fetchVideoListSimilar();
    this.props.resetConsumerPaymentPackCompatibleList();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.requestVideoAccessRefreshFlag !== undefined) {
      if (
        prevProps.requestVideoAccessRefreshFlag !==
        this.props.requestVideoAccessRefreshFlag
      ) {
        this.requestVideoAccess();
      }
    }
  }

  requestVideoAccess = () => {
    if (!this.props.authenticated) {
      this.props.requestSignUp();
      return;
    }

    this.props.fetchPrivateConsumerPassCompatibleList(
      {
        video: this.props.videoId,
      },
      {
        onSuccess: () => this.props.setPrivateConsumerPassReady(true),
        onError: () => this.props.setPrivateConsumerPassReady(true),
      },
    );
    this.props.fetchConsumerPaymentPackCompatibleList(
      {
        video: this.props.videoId,
      },
      {
        onSuccess: (cppList: any) => {
          this.props.fetchPaymentPackBulk(
            cppList.map((cpp: any) => cpp.payment_pack),
          );
          this.props.setConsumerPaymentPackReady(true);
        },
        onError: () => this.props.setConsumerPaymentPackReady(true),
      },
    );
    this.props.setRegisterVideoOpen(true);
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        {!!this.props.loading && <LinearProgress />}
        <Grid
          spacing={2}
          container
          direction="row"
          className={this.props.classes.gridContainer}
        >
          <Grid item xs={12} md={8}>
            {!!this.props.video && (
              <VideoPlayerFull
                authenticated={this.props.authenticated}
                video={this.props.video}
                requestVideoAccess={this.requestVideoAccess}
                videoPlayerKey={this.props.videoPlayerKey}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <VideoThumbnailList
              videoList={this.props.videoListSimilar}
              loading={this.props.similarVideoLoading}
              hasMoreVideo={this.props.hasMoreVideo}
              fetchMoreVideo={this.props.fetchMoreVideo}
              onOpenVideo={this.props.openVideo}
            />
          </Grid>
        </Grid>
        <VideoRegisterDialog
          consumerPaymentPackList={this.props.consumerPaymentPackCompatibleList}
          privateConsumerPassList={this.props.privateConsumerPassCompatibleList}
          creditPrice={this.props.video && this.props.video.credit_price}
          registerVideo={this.props.registerVideo}
          open={this.props.registerVideoOpen}
          onBuyPass={this.props.onRequestBuyPass}
          onClose={() => this.props.setRegisterVideoOpen(false)}
          loading={
            !(
              this.props.consumerPaymentPackReady &&
              this.props.privateConsumerPassReady
            )
          }
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  gridContainer: {
    maxWidth: 1400,
  },
});

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  authenticated: state.auth.authenticated,
  video: withCoach(withCategory(getVideo))(state, ownProps.videoId),
  videoListSimilar: withCoach(withCategory(getVideoList))(state),
  hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
  similarVideoLoading: state.video.loading,
  privateConsumerPassCompatibleList: getPrivateConsumerPassCompatibleList(
    state,
  ),
  consumerPaymentPackCompatibleList: withPaymentPack(
    getConsumerPaymentPackCompatibleList,
  )(state),
  paymentPackCompatibleList: getPaymentPackCompatibleList(state),
  loading: state.video.loading,
});

const mapDispatchToProps = {
  retrieveVideo: retrieveVideoAction,
  fetchVideoList: fetchVideoListAction,
  fetchMoreVideo: fetchMoreVideoAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  fetchPrivateConsumerPassCompatibleList: fetchPrivateConsumerPassCompatibleListAction,
  fetchConsumerPaymentPackCompatibleList: fetchConsumerPaymentPackCompatibleListAction,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  resetConsumerPaymentPackCompatibleList,
  registerVideo: registerVideoAction,
  push: pushRouter,
};

const mapHandlers = {
  registerVideo: (props: ConnectProps & OwnProps) => (data: any) =>
    props.registerVideo(props.videoId, data, {
      onSuccess: () => {
        props.retrieveVideo(props.videoId);
        props.setRegisterVideoOpen(false);
        props.setVideoPlayerKey(props.videoPlayerKey + 1);
      },
    }),
  onRequestBuyPass: (props: ConnectProps & OwnProps) => () => {
    if (props.onRequestBuyPass) {
      props.onRequestBuyPass(props.companyId, props.companyName);
      return;
    }
    props.push(getMarketplaceRoute(props.companyName, props.companyId, 'pass'));
  },
  retrieveVideo: (props: ConnectProps & OwnProps) => () => {
    props.retrieveVideo(props.videoId, {
      onSuccess: (video) => {
        props.fetchAssociatedCoachBulk(video.coaches);
      },
    });
  },
  openVideo: (props: ConnectProps & OwnProps) => (videoId: number) => {
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
  fetchMoreVideo: (props: ConnectProps & OwnProps) => () => {
    props.fetchMoreVideo({
      status: 400,
      similar: props.videoId,
    });
  },
  fetchVideoListSimilar: (props: ConnectProps & OwnProps) => () => {
    props.fetchVideoList(
      {
        status: 400,
        similar: props.videoId,
      },
      1,
      {
        onSuccess: (videoList) => {
          props.fetchAssociatedCoachBulk(
            flatten(videoList.map((v: Video) => v.coaches)),
          );
        },
      },
    );
  },
};

const withStateHandlersInit = {
  consumerPaymentPackReady: false,
  registerVideoOpen: false,
  privateConsumerPassReady: false,
  videoPlayerKey: 0,
};

const withStateHandlersSetter = {
  setConsumerPaymentPackReady: () => (consumerPaymentPackReady: boolean) => {
    return { consumerPaymentPackReady };
  },
  setRegisterVideoOpen: () => (registerVideoOpen: boolean) => {
    return { registerVideoOpen };
  },
  setPrivateConsumerPassReady: () => (privateConsumerPassReady: boolean) => {
    return { privateConsumerPassReady };
  },
  setVideoPlayerKey: () => (videoPlayerKey: number) => {
    return { videoPlayerKey };
  },
};

export const MarketplaceVideoDetailDataProvider = compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapHandlers),
);

export default compose(
  routerParamsToProps({
    videoId: 'videoId:number',
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  MarketplaceVideoDetailDataProvider,
)(MarketplaceVideoDetail);
