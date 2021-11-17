import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { withTranslation, WithTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';
import { BUYABLE_ITEM_GIFTCARD } from '@bsport/common/lib/master-data/buyable-items';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
  fetchConsumerGiftcardSentList as fetchConsumerGiftcardSentListAction,
  retrieveConsumerGiftcard,
} from '../../libs/giftcard/actions';

import ConsumerGiftcardListItem from '../../libs/giftcard/components/ConsumerGiftcardListItem.component';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction } from '../../libs/invoice/actions';
import {
  Giftcard,
  ConsumerGiftcard,
  WithGiftcard,
  WithSender,
  WithReceiver,
} from '../../libs/giftcard/types';
import ConsumerGiftcardDetail from '../../libs/giftcard/components/ConsumerGiftcardDetail.component';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import { snackbarSuccess } from '../../libs/snackbar/actions';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  getConsumerGiftcard,
  withSender,
  withReceiver,
  getConsumerGiftcardSentList,
} from '../../libs/giftcard/selectors';
import { fetchMemberBulkById as fetchMemberBulkAction } from '../../libs/member/actions';

import { RootState } from '../../reducers';
import { Invoice } from '../../libs/invoice/types';

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    emptyContainer: {
      padding: theme.spacing(2),
    },
    listConsumerGiftcard: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(1),
    },
  });

type OwnProps = {
  id: number;
  giftcard: Giftcard | null;
  relatedInvoice: Invoice | null;
  consumerGiftcardLoading: boolean;
  consumerGiftcardList: Array<ConsumerGiftcard>;
  consumerGiftcardCount: number;
  fetchConsumerGiftcardList: (params: any) => void;
  selectedConsumerGiftcardId: null | number;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

const PAGE_SIZE = 15;

export class MemberDetailGiftcard extends Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.selectedConsumerGiftcardId !==
      this.props.selectedConsumerGiftcardId
    ) {
      this.fetchData();
    }
    if (prevProps.id !== this.props.id) {
      if (prevProps.id && this.props.id) {
        this.props.fetchConsumerGiftcardSentList(this.props.id, 1, PAGE_SIZE);
        this.props.fetchConsumerGiftcardReceivedList(
          this.props.id,
          1,
          PAGE_SIZE,
        );
      }
    }
  }

  fetchData = () => {
    if (this.props.selectedConsumerGiftcardId) {
      this.props.retrieveConsumerGiftcard(
        this.props.selectedConsumerGiftcardId,
      );
      this.props.fetchInvoiceByInvoiceItem(
        this.props.selectedConsumerGiftcardId,
      );
    }
  };

  goToMemberGiftcard = (
    consumerGiftcardId: number,
    giftcardId: number,
    memberId: number,
  ) => {
    this.props.goToMemberGiftcard(consumerGiftcardId, memberId);
  };

  render() {
    const { classes, t } = this.props;
    if (!this.props.id) return null;
    return (
      <Grid container spacing={2}>
        <Grid item sm={12} md={6} style={{ width: '100%' }}>
          <Typography variant="h5">
            {t('consumerGiftcard.list.myPurchases')}
          </Typography>
          <Paper className={classes.listConsumerGiftcard}>
            <PaginatedListBase
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              items={this.props.sentState.consumerGiftcardList}
              nbItems={this.props.sentState.consumerGiftcardCount}
              loading={this.props.sentState.consumerGiftcardLoading}
              page={this.props.sentState.consumerGiftcardPage}
              itemPerPage={PAGE_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerGiftcardSentList(
                  this.props.id,
                  page,
                  pageSize,
                )
              }
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography variant="caption" color="textSecondary">
                    {t('consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(
                cgc: WithGiftcard<WithSender<WithReceiver<ConsumerGiftcard>>>,
              ) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  consumerGiftcard={cgc}
                  giftcard={cgc.giftcard}
                  divider
                  selected={cgc.id === this.props.selectedConsumerGiftcardId}
                  showReceiver
                  memberReceiver={cgc.dst_member}
                  memberSender={cgc.src_member}
                  onClickSender={this.goToMemberGiftcard}
                  onClickReceiver={cgc.dst_member && this.goToMemberGiftcard}
                />
              )}
            />
          </Paper>
          <Typography variant="h5">
            {t('consumerGiftcard.list.myGifted')}
          </Typography>
          <Paper className={classes.listConsumerGiftcard}>
            <PaginatedListBase
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              items={this.props.receivedState.consumerGiftcardList}
              nbItems={this.props.receivedState.consumerGiftcardCount}
              loading={this.props.receivedState.consumerGiftcardLoading}
              page={this.props.receivedState.consumerGiftcardPage}
              itemPerPage={PAGE_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerGiftcardReceivedList(
                  this.props.id,
                  page,
                  pageSize,
                )
              }
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography variant="caption" color="textSecondary">
                    {t('consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(
                cgc: WithGiftcard<WithSender<WithReceiver<ConsumerGiftcard>>>,
              ) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  consumerGiftcard={cgc}
                  selected={cgc.id === this.props.selectedConsumerGiftcardId}
                  giftcard={cgc.giftcard}
                  showAsRecipient
                  showSender
                  divider
                  onClickSender={this.goToMemberGiftcard}
                  onClickReceiver={this.goToMemberGiftcard}
                  memberReceiver={cgc.dst_member}
                  memberSender={cgc.src_member}
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item sm={12} md={6}>
          {this.props.selectedConsumerGiftcardId && (
            <ConsumerGiftcardDetail
              consumerGiftcard={this.props.selectedConsumerGiftcard}
              invoice={this.props.relatedInvoice}
              onInvoiceClick={this.props.goToInvoice}
              giftcard={this.props.selectedConsumerGiftcard?.giftcard}
              goToGiftcard={this.props.goToGiftcard}
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { selectedConsumerGiftcardId }: { selectedConsumerGiftcardId: number },
  ) => ({
    receivedState: {
      consumerGiftcardCount: state.giftcard.consumerGiftcard.asReceiver.count,
      consumerGiftcardLoading:
        state.giftcard.consumerGiftcard.asReceiver.loading,
      consumerGiftcardPage: state.giftcard.consumerGiftcard.asReceiver.page,
      consumerGiftcardList: withGiftcard(
        withReceiver(withSender(getConsumerGiftcardReceivedList)),
      )(state),
    },
    sentState: {
      consumerGiftcardCount: state.giftcard.consumerGiftcard.asSender.count,
      consumerGiftcardLoading: state.giftcard.consumerGiftcard.asSender.loading,
      consumerGiftcardPage: state.giftcard.consumerGiftcard.asSender.page,
      consumerGiftcardList: withGiftcard(
        withReceiver(withSender(getConsumerGiftcardSentList)),
      )(state),
    },
    selectedConsumerGiftcard: withGiftcard(getConsumerGiftcard)(
      state,
      selectedConsumerGiftcardId,
    ),
  }),
  {
    fetchGiftcardBulk: fetchGiftcardBulkAction,
    snackbarSuccess,
    goToMemberGiftcard: (consumerGiftcardId, memberId) =>
      push(`/member/${memberId}/giftcard/${consumerGiftcardId}`),
    fetchConsumerGiftcardReceivedList: fetchConsumerGiftcardReceivedListAction,
    fetchConsumerGiftcardSentList: fetchConsumerGiftcardSentListAction,
    fetchMemberBulk: fetchMemberBulkAction,
    goToInvoice: (uuid: string) => push(`/invoice/${uuid}`),
    fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
    retrieveConsumerGiftcard,
    goToGiftcard: (giftcardId: number) => push(`/giftcard/${giftcardId}`),
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  routerParamsToProps({
    id: 'id:number',
    selectedConsumerGiftcardId: 'selectedConsumerGiftcardId:number',
  }),
  connector,
  withState('relatedInvoice', 'setRelatedInvoice', null),
  withHandlers({
    fetchConsumerGiftcardSentList: ({
      fetchConsumerGiftcardSentList,
      fetchGiftcardBulk,
      fetchMemberBulk,
    }) => (id: number, page: number, page_size: number) => {
      fetchConsumerGiftcardSentList(
        id,
        { page, page_size },
        {
          onSuccess: (consumerGiftcardList) => {
            fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
            fetchMemberBulk([
              ...consumerGiftcardList.map((cg) => cg.src_member),
              ...consumerGiftcardList.map((cg) => cg.dst_member),
            ]);
          },
        },
      );
    },
    fetchConsumerGiftcardReceivedList: ({
      fetchConsumerGiftcardReceivedList,
      fetchGiftcardBulk,
      fetchMemberBulk,
    }) => (id, page: number, page_size: number) => {
      fetchConsumerGiftcardReceivedList(
        id,
        { page, page_size },
        {
          onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
            fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
            fetchMemberBulk([
              ...consumerGiftcardList.map((cg) => cg.src_member),
              ...consumerGiftcardList.map((cg) => cg.dst_member),
            ]);
          },
        },
      );
    },
    fetchInvoiceByInvoiceItem: ({
      fetchInvoiceByInvoiceItem,
      setRelatedInvoice,
    }) => (objectId: number) => {
      fetchInvoiceByInvoiceItem(BUYABLE_ITEM_GIFTCARD, objectId, {
        onSuccess: (inv: Invoice) => {
          setRelatedInvoice(inv);
        },
      });
    },
  }),
)(MemberDetailGiftcard);
