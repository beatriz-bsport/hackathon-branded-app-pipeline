import Paper from '@material-ui/core/Paper';
import React, { Component } from 'react';
import { withHandlers, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { BUYABLE_ITEM_PASS } from '@bsport/common/lib/master-data/buyable-items';
import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';
import themeSelectors from '../../libs/theme/selectors';
import { getMember } from '../../libs/member/selectors';

import { getInvoice } from '../../libs/invoice/selectors';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItem } from '../../libs/invoice/actions';
import {
  fetchVideoPurchase,
  fetchNumberVideoPurchase,
  fetchVideoBulk,
  retrieveVideo,
  fetchVideoAnalyticsbyMember,
} from '../../libs/video/actions';
import {
  retrieveConsumerPackBulk,
  updateCredit as updateCreditAction,
} from '../../libs/consumer-payment-pack/actions';
import { getMemberVideoListWithConsumerPack } from '../../libs/video/selectors';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import VideoItemForManger from '../../libs/video/components/VideoItemForManager.component';
import VideoDetail from '../../libs/video/components/VideoDetail.component';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '../../libs/payment-packs/selectors';
import { getConsumerPack } from '../../libs/consumer-payment-pack/selectors';
import type {
  Video,
  VideoPurchase,
  VideoAnalyticsData,
} from '../../libs/video/types';

const VIDEO_PURCHASES_PAGE_SIZE = 5;
type Props = {
  classes: *,
  fetchVideoPurchase: (page: number, page_size: number) => void,
  fetchVideoDetails: () => void,
  fetchVideoViews: () => void,
  vodId: ?number,
  id: number,
  selectVideo: (memberId: number, videoId: number) => void,
  unselectVideo: (memberId: number) => void,
  onPageRequested: (page: number, page_sizz: number) => void,
  handleItemSelection: (
    selectVideo: selectVideo,
    purchaseVideo: VideoPurchase,
  ) => void,
  loading: boolean,
  videos: object<VideoPurchase>,
  videoCurrentPage: number,
  selectedVideo: ?VideoPurchase,
  getPass: (id: number) => void,
  getPaymentPack: (id: number) => PaymentPack,
  consumerPackLoading: boolean,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  analyticsbyMember: {
    data: VideoAnalyticsData,
    loading: boolean,
  },
  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  onInvoiceClick?: (uuid: string) => void,
  privateConsumerPassInvoice: ?Invoice,
  videoPurchasedCount: number,
};
const ClickOnPurchaseVideo = withTranslation(['video'])(
  (props: { classes: Object, t: TFunction }) => (
    <div className={props.classes.container}>
      <div className={props.classes.emptyMessageContainer}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography
          className={props.classes.emptyMessageText}
          color="textSecondary"
          variant="caption"
        >
          {props.t('details.pleaseSelectVod')}
        </Typography>
      </div>
    </div>
  ),
);
export class MemberDetailVod extends Component<Props, state> {
  componentDidMount() {
    this.props.fetchVideoPurchase(1, VIDEO_PURCHASES_PAGE_SIZE);
    if (this.props.vodId) {
      this.props.fetchVideoDetails();
      this.props.fetchVideoViews();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.vodId &&
      (!prevProps.vodId || prevProps.vodId !== this.props.vodId)
    ) {
      this.props.fetchVideoDetails();
      this.props.fetchVideoViews();
    }
  }

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  selectVideo = (video: Video) => {
    if (this.props.vodId && this.props.vodId === video.id) {
      this.props.unselectVideo(this.props.id);
    } else {
      this.props.selectVideo(this.props.id, video.id);
    }
  };

  render() {
    return (
      <Grid container direction="row" spacing={3}>
        <Grid
          container
          alignItems="stretch"
          item
          xs={12}
          lg={6}
          direction="column"
          spacing={3}
        >
          <Grid item style={{ width: '100%' }}>
            <Paper>
              <PaginatedListBase
                itemPerPage={VIDEO_PURCHASES_PAGE_SIZE}
                loading={this.props.loading}
                listProps={{ disablePadding: true }}
                items={this.props.videos}
                nbItems={this.props.videoPurchasedCount}
                page={this.props.videoCurrentPage}
                onPageRequested={(page, page_size) =>
                  this.props.onPageRequested(page, page_size)
                }
                renderItem={(purchaseVideo) =>
                  purchaseVideo.video && (
                    <VideoItemForManger
                      onClick={() =>
                        this.props.handleItemSelection(
                          this.selectVideo,
                          purchaseVideo,
                        )
                      }
                      selected={
                        this.props.selectedVideo &&
                        this.props.selectedVideo.id === purchaseVideo.id
                      }
                      key={purchaseVideo.id}
                      video={purchaseVideo}
                      memberId={this.props.id}
                      date_created={purchaseVideo.date_created}
                    />
                  )
                }
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.selectedVideo && this.props.analyticsbyMember.data ? (
            <VideoDetail
              consumerPack={
                this.props.selectedVideo &&
                this.props.getPass(
                  parseInt(
                    this.props.selectedVideo.consumer_payment_pack_id,
                    10,
                  ),
                )
              }
              getPaymentPack={this.props.getPaymentPack}
              decrementCredit={this.props.decrementCredit}
              incrementCredit={this.props.incrementCredit}
              video={this.props.selectedVideo}
              member={this.props.id}
              onConsumerPassSelected={this.goToConsumerPass}
              loading={this.props.consumerPackLoading || this.props.loading}
              analytics={this.props.analyticsbyMember}
              onInvoiceClick={this.props.onInvoiceClick}
              invoice={this.props.privateConsumerPassInvoice}
              fetchDetailPanelData={this.fetchDetailPanelData}
            />
          ) : (
            <ClickOnPurchaseVideo classes={this.props.classes} />
          )}
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  containerRecurrentBooking: {
    width: '100%',
  },
  bookButtonWideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'noWrap',
  },
  recurrenceRuleContainer: {
    marginTop: theme.spacing(3),
  },
  bookButtonWide: {
    width: '30%',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  createRecurrentBooking: {
    paddingTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  graphContainer: {
    padding: theme.spacing(2),
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(2),
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  emptyMessageText: {
    marginTop: theme.spacing(2),
  },
});
export default compose(
  mapRouterParamsToProps({
    id: 'id:number',
    vodId: 'vodId:number',
  }),
  withTranslation('booking'),
  withStyles(styles),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  withState('selectedVideo2', 'setSelectedvideo2', null),
  connect(
    (state, { id, vodId, relatedInvoice }) => ({
      loading: state.video.loading || state.video.purchase.loading,
      loading2:
        state.video.loading ||
        state.video.purchase.loading ||
        (vodId && !state.video.analyticsbyMember.data),
      theme: themeSelectors.getTheme(state),
      member: getMember(state, id),
      videos: getMemberVideoListWithConsumerPack(state, id),
      selectedVideo: vodId
        ? getMemberVideoListWithConsumerPack(state, id).find(
            (purchaseVideos) => purchaseVideos.id === vodId,
          )
        : null,
      videoPurchasedCount: state.video.purchase.purchaseByMember,
      videoCurrentPage: state.video.purchase.page,
      paymentPacks: getAllPaymentPacks(state),
      consumerPackLoading: state.consumerPaymentPack.loading,
      getPaymentPack: (id_: number) => paymentPackSelectors.get(state, id_),
      getPass: (id_: number) => getConsumerPack(state, id_),
      analyticsbyMember: {
        data: state.video.analyticsbyMember.data,
        loading: state.video.analyticsbyMember.loading,
      },
      privateConsumerPassInvoice: getInvoice(state, relatedInvoice),
    }),
    {
      fetchVideoPurchaseAction: fetchVideoPurchase,
      fetchVideoListBulkAction: fetchVideoBulk,
      retrieveVideoAction: retrieveVideo,
      retrieveConsumerPackBulkAction: retrieveConsumerPackBulk,
      goToConsumerPass: (memberId, consumerPassId) =>
        push(`/member/${memberId}/pass/${consumerPassId}/`),
      unselectVideo: (id) => push(`/member/${id}/vod`),
      selectVideo: (id, vodId) => push(`/member/${id}/vod/${vodId}/`),
      incrementCredit: (id_) => updateCreditAction(id_, 1),
      decrementCredit: (id_) => updateCreditAction(id_, -1),
      onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
      fetchVideoAnalyticsbyMemberAction: fetchVideoAnalyticsbyMember,
      fetchInvoiceByInvoiceItemAction: fetchInvoiceByInvoiceItem,
      fetchNumberVideoPurchaseAction: fetchNumberVideoPurchase,
    },
  ),
  withHandlers({
    handleItemSelection: ({
      setRelatedInvoice,
      fetchInvoiceByInvoiceItemAction,
    }) => (selectVideo, purchaseVideo) => {
      selectVideo(purchaseVideo);
      if (purchaseVideo.consumer_payment_pack) {
        fetchInvoiceByInvoiceItemAction(
          BUYABLE_ITEM_PASS,
          purchaseVideo.consumer_payment_pack.id,
          {
            onSuccess: (inv) => {
              setRelatedInvoice(inv.uuid);
            },
          },
        );
      }
    },
  }),
  withHandlers({
    fetchVideoPurchase: ({
      id,
      fetchVideoPurchaseAction,
      fetchVideoListBulkAction,
      retrieveConsumerPackBulkAction,
    }) => (page, page_size) => {
      fetchVideoPurchaseAction(
        page,
        page_size,
        { member_id: id },
        {
          onSuccess: (payload) => {
            fetchVideoListBulkAction(payload.map((purVideo) => purVideo.video));
            retrieveConsumerPackBulkAction(
              payload.map((v) => v.consumer_payment_pack),
            );
          },
        },
      );
    },
    onPageRequested: ({
      id,
      fetchVideoPurchaseAction,
      fetchVideoListBulkAction,
      retrieveConsumerPackBulkAction,
      fetchNumberVideoPurchaseAction,
    }) => (page, page_size) => {
      fetchVideoPurchaseAction(
        page,
        page_size,
        { member_id: id },
        {
          onSuccess: (payload) => {
            fetchVideoListBulkAction(payload.map((purVideo) => purVideo.video));
            retrieveConsumerPackBulkAction(
              payload.map((v) => v.consumer_payment_pack),
            );
            fetchNumberVideoPurchaseAction({ member_id: id });
          },
        },
      );
    },
  }),
  withHandlers({
    fetchVideoDetails: ({ vodId, retrieveVideoAction, videos }) => () => {
      if (videos && videos.length && vodId) {
        const videoId = videos.find((vod) => vod.id === vodId);
        retrieveVideoAction(videoId.video.id);
      }
    },
    fetchVideoViews: ({
      fetchVideoAnalyticsbyMemberAction,
      vodId,
      id,
      videos,
    }) => () => {
      if (videos && videos.length && vodId) {
        const videoId = videos.find((vod) => vod.id === vodId);
        fetchVideoAnalyticsbyMemberAction(videoId.video.id, {
          member: id,
        });
      }
    },
  }),
)(MemberDetailVod);
