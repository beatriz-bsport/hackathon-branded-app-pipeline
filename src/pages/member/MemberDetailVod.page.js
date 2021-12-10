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
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';
import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';
import themeSelectors from '../../libs/theme/selectors';
import { getMember } from '../../libs/member/selectors';

import { getInvoice } from '../../libs/invoice/selectors';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItem } from '../../libs/invoice/actions';
import {
  fetchUniqueVideoPurchaseByMember,
  fetchNumberVideoPurchase,
  fetchVideoBulk,
  retrieveVideo,
  fetchVideoAnalyticsbyMember,
  retrieveVideoPurchase as retrieveVideoPurchaseAction,
  fetchVideoPurchaseByMemberByVideo as fetchVideoPurchaseByMemberByVideoAction,
} from '../../libs/video/actions';
import {
  retrieveConsumerPackBulk,
  updateCredit as updateCreditAction,
} from '../../libs/consumer-payment-pack/actions';
import {
  withPack,
  withVideoData,
  getVideoPurchasedByMember,
  getSelectedVideoPurchased,
  getAssociatedVideoPurchasedByMember,
} from '../../libs/video/selectors';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import VideoItemForManager from '../../libs/video/components/VideoItemForManager.component';
import VideoDetail from '../../libs/video/components/VideoDetail.component';
import paymentPackSelectors from '../../libs/payment-packs/selectors';
import type {
  Video,
  VideoPurchase,
  VideoAnalyticsData,
} from '../../libs/video/types';

const VIDEO_PURCHASES_PAGE_SIZE = 5;
type Props = {
  classes: any,
  vodId?: number,
  id: number,
  selectVideo: (memberId: number, videoId: number) => void,
  unselectVideo: (memberId: number) => void,
  onPageRequested: (page: number, page_size: number) => void,
  onSelectVideoPurchase: () => void,
  loading: boolean,
  purchasedVideoList: Array<VideoPurchase>,
  videoCurrentPage: number,
  selectedPurchasedVideo?: VideoPurchase,
  getPaymentPack: (id: number) => PaymentPack,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  analyticsbyMember: {
    data: VideoAnalyticsData,
    loading: boolean,
  },
  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  onInvoiceClick?: (uuid: string) => void,
  privateConsumerPassInvoice?: Invoice,
  videoPurchasedCount: number,
  associatedVideoPurchase: Array<VideoPurchase>,
  fetchRelatedInvoice: (videoPurchase: VideoPurchase) => void,
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
    if (this.props.vodId) {
      this.props.onSelectVideoPurchase(this.props.vodId);
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
                items={this.props.purchasedVideoList}
                nbItems={this.props.videoPurchasedCount}
                page={this.props.videoCurrentPage}
                onPageRequested={(page, page_size) =>
                  this.props.onPageRequested(page, page_size)
                }
                renderItem={(purchasedVideo) =>
                  purchasedVideo.video && (
                    <VideoItemForManager
                      onClick={() => {
                        this.props.onSelectVideoPurchase(purchasedVideo.id);
                        this.selectVideo(purchasedVideo);
                      }}
                      selected={
                        this.props.selectedPurchasedVideo &&
                        this.props.selectedPurchasedVideo.id ===
                          purchasedVideo.id
                      }
                      key={purchasedVideo.id}
                      videoPurchase={purchasedVideo}
                      memberId={this.props.id}
                      date_created={purchasedVideo.date_created}
                    />
                  )
                }
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.selectedPurchasedVideo ? (
            <VideoDetail
              getInvoice={this.props.fetchRelatedInvoice}
              getPaymentPack={this.props.getPaymentPack}
              decrementCredit={this.props.decrementCredit}
              incrementCredit={this.props.incrementCredit}
              videoPurchase={this.props.selectedPurchasedVideo}
              onConsumerPassSelected={this.goToConsumerPass}
              loading={this.props.loading}
              analytics={this.props.analyticsbyMember}
              onInvoiceClick={this.props.onInvoiceClick}
              invoice={this.props.privateConsumerPassInvoice}
              associatedVideos={this.props.associatedVideoPurchase}
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
  connect(
    (state, { id, vodId, relatedInvoice }) => ({
      loading:
        state.video.loading ||
        state.video.purchase.loading ||
        state.consumerPaymentPack.loading ||
        state.video.analyticsbyMember.loading,
      theme: themeSelectors.getTheme(state),
      member: getMember(state, id),
      purchasedVideoList: withPack(withVideoData(getVideoPurchasedByMember))(
        state,
        id,
      ),
      associatedVideoPurchase: withPack(
        withVideoData(getAssociatedVideoPurchasedByMember),
      )(state, id),
      selectedPurchasedVideo: withPack(
        withVideoData(getSelectedVideoPurchased),
      )(state, vodId),
      videoPurchasedCount: state.video.purchase.purchaseByMember,
      videoCurrentPage: state.video.purchase.page,
      getPaymentPack: (id_: number) => paymentPackSelectors.get(state, id_),
      analyticsbyMember: {
        data: state.video.analyticsbyMember.data,
        loading: state.video.analyticsbyMember.loading,
      },
      privateConsumerPassInvoice: getInvoice(state, relatedInvoice),
    }),
    {
      fetchVideoPurchaseAction: fetchUniqueVideoPurchaseByMember,
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
      retrieveVideoPurchase: retrieveVideoPurchaseAction,
      fetchVideoPurchaseByMemberByVideo:
        fetchVideoPurchaseByMemberByVideoAction,
    },
  ),

  withHandlers({
    onSelectVideoPurchase:
      ({
        setRelatedInvoice,
        fetchInvoiceByInvoiceItemAction,
        retrieveVideoPurchase,
        retrieveVideoAction,
        fetchVideoAnalyticsbyMemberAction,
        id,
        fetchVideoPurchaseByMemberByVideo,
        retrieveConsumerPackBulkAction,
      }) =>
      (purchaseVideoId) => {
        retrieveVideoPurchase(purchaseVideoId, {
          onSuccess: (videoPurchase) => {
            retrieveVideoAction(videoPurchase.video);
            fetchVideoAnalyticsbyMemberAction(videoPurchase.video, {
              member: id,
            });
            fetchVideoPurchaseByMemberByVideo(videoPurchase.video, id, {
              onSuccess: (videoPurchases) =>
                retrieveConsumerPackBulkAction(
                  videoPurchases.map(
                    (purchase) => purchase.consumer_payment_pack,
                  ),
                ),
            });
            if (videoPurchase.consumer_payment_pack) {
              fetchInvoiceByInvoiceItemAction(
                BUYABLE_ITEM_PASS,
                videoPurchase.consumer_payment_pack,
                {
                  onSuccess: (inv) => {
                    setRelatedInvoice(inv.uuid);
                  },
                },
              );
            } else if (videoPurchase.private_consumer_pass) {
              fetchInvoiceByInvoiceItemAction(
                BUYABLE_ITEM_PRIVATE_PASS,
                videoPurchase.private_consumer_pass,
                {
                  onSuccess: (inv) => {
                    setRelatedInvoice(inv.uuid);
                  },
                },
              );
            }
          },
        });
      },
    fetchRelatedInvoice:
      ({ setRelatedInvoice, fetchInvoiceByInvoiceItemAction }) =>
      (videoPurchase: VideoPurchase) => {
        if (videoPurchase.consumer_payment_pack) {
          fetchInvoiceByInvoiceItemAction(
            BUYABLE_ITEM_PASS,
            videoPurchase.consumer_payment_pack.id,
            {
              onSuccess: (inv) => {
                setRelatedInvoice(inv.uuid);
              },
            },
          );
        } else if (videoPurchase.private_consumer_pass.id) {
          fetchInvoiceByInvoiceItemAction(
            BUYABLE_ITEM_PRIVATE_PASS,
            videoPurchase.private_consumer_pass,
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
    onPageRequested:
      ({
        id,
        fetchVideoPurchaseAction,
        fetchVideoListBulkAction,
        retrieveConsumerPackBulkAction,
        fetchNumberVideoPurchaseAction,
      }) =>
      (page, page_size) => {
        fetchVideoPurchaseAction(id, page, page_size, {
          onSuccess: (payload) => {
            fetchVideoListBulkAction(payload.map((purVideo) => purVideo.video));
            retrieveConsumerPackBulkAction(
              payload.map((v) => v.consumer_payment_pack),
            );
            fetchNumberVideoPurchaseAction({ member_id: id });
          },
        });
      },
  }),
)(MemberDetailVod);
