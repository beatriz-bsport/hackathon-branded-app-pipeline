import React, { PureComponent } from 'react';
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
import uniq from 'lodash/uniq';
import themeSelectors from '#src/libs/theme/selectors';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
  fetchConsumerGiftcardSentList as fetchConsumerGiftcardSentListAction,
  retrieveConsumerGiftcard,
  sendEmailInvitation,
} from '#src/libs/giftcard/actions';

import ConsumerGiftcardListItem from '#src/libs/giftcard/components/ConsumerGiftcardListItem.component';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction } from '#src/libs/invoice/actions';
import {
  Giftcard,
  ConsumerGiftcard,
  WithGiftcard,
  WithSender,
  WithReceiver,
} from '#src/libs/giftcard/types';
import ConsumerGiftcardDetail from '#src/libs/giftcard/components/ConsumerGiftcardDetail.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  getConsumerGiftcard,
  withSender,
  withReceiver,
  getConsumerGiftcardSentList,
} from '#src/libs/giftcard/selectors';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';

import { Invoice } from '#src/libs/invoice/types';
import ConsumerGiftcardInvitationModal from '#src/libs/giftcard/components/ConsumerGiftcardInvitationModal.components';
import ConsumerPhysicalGiftcardDetails from '#src/libs/giftcard/components/ConsumerPhysicalGiftcardDetails.components';
import { getMember } from '#src/libs/member/selectors';
import { RootState } from '../../reducers';
import { snackbarSuccess } from '../../libs/snackbar/actions';
import { OptionCallback } from '../../state/types';
import { GiftcardKindEnum } from '#src/libs/giftcard/constants';

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
  consumerGiftcardLoading: boolean;
  consumerGiftcardList: Array<ConsumerGiftcard>;
  consumerGiftcardCount: number;
  fetchConsumerGiftcardList: (params: any) => void;
  selectedConsumerGiftcardId: null | number;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  HandlersProps &
  StateHandlersProps &
  WithStyles &
  WithTranslation;

const PAGE_SIZE = 15;

type State = {
  consumerGiftcardToInvite: ConsumerGiftcard | null;
  consumerPhysicalGiftcardSelected: ConsumerGiftcard | null;
};
export class MemberDetailGiftcard extends PureComponent<Props, State> {
  state: State = {
    consumerGiftcardToInvite: null,
    consumerPhysicalGiftcardSelected: null,
  };

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
        {
          onSuccess: (data: ConsumerGiftcard) => {
            if (!data.consumer_giftcard_source) {
              // No invoice for shared consumer gifcard (copy)
              this.props.fetchInvoiceByInvoiceItem(
                this.props.selectedConsumerGiftcardId,
              );
            } else {
              this.props.setRelatedInvoice(null);
            }
          },
        },
      );
    }
  };

  sendInvitations = (data: any, options: OptionCallback<ConsumerGiftcard>) => {
    this.props.sendEmailInvitation(
      this.state.consumerGiftcardToInvite.id,
      data,
      {
        onSuccess: (...args) => {
          this.props.retrieveConsumerGiftcard(
            this.state.consumerGiftcardToInvite.id,
          );
          this.setState({ consumerGiftcardToInvite: null });
          if (options?.onSuccess) options.onSuccess(...args);
        },
        onError: options?.onError,
      },
    );
  };

  render() {
    const { classes, t } = this.props;
    if (!this.props.id) return null;
    return (
      <Grid container spacing={2}>
        <Grid item md={6} sm={12} style={{ width: '100%' }}>
          <Typography variant="h5">
            {t('consumerGiftcard.list.myPurchases')}
          </Typography>
          <Paper className={classes.listConsumerGiftcard}>
            <PaginatedListBase
              itemPerPage={PAGE_SIZE}
              items={this.props.sentState.consumerGiftcardList}
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              loading={this.props.sentState.consumerGiftcardLoading}
              nbItems={this.props.sentState.consumerGiftcardCount}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerGiftcardSentList(
                  this.props.id,
                  page,
                  pageSize,
                )
              }
              page={this.props.sentState.consumerGiftcardPage}
              renderCustomPageFirst={!!this.props.selectedConsumerGiftcardId}
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography color="textSecondary" variant="caption">
                    {t('consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(
                consumerGiftcard: WithGiftcard<
                  WithSender<WithReceiver<ConsumerGiftcard>>
                >,
              ) => (
                <ConsumerGiftcardListItem
                  key={consumerGiftcard.id}
                  divider
                  showReceiver
                  consumerGiftcard={consumerGiftcard}
                  giftcard={consumerGiftcard.giftcard}
                  memberReceiver={consumerGiftcard.dst_member}
                  memberSender={consumerGiftcard.src_member}
                  onClickReceiver={
                    consumerGiftcard.dst_member && this.props.goToMemberGiftcard
                  }
                  onClickSeeDetails={
                    consumerGiftcard.kind === GiftcardKindEnum.PHYSICAL
                      ? () =>
                          this.setState({
                            consumerPhysicalGiftcardSelected: consumerGiftcard,
                          })
                      : null
                  }
                  onClickSender={this.props.goToMemberGiftcard}
                  onClickSendInvitation={
                    consumerGiftcard.date_activated
                      ? null
                      : () =>
                          this.setState({
                            consumerGiftcardToInvite: consumerGiftcard,
                          })
                  }
                  selected={
                    consumerGiftcard.id ===
                    this.props.selectedConsumerGiftcardId
                  }
                  sharedFromFranchisor={
                    !!consumerGiftcard.consumer_giftcard_source
                  }
                />
              )}
            />
          </Paper>
          {!!this.state.consumerGiftcardToInvite && (
            <ConsumerGiftcardInvitationModal
              companyId={this.state.consumerGiftcardToInvite.source_company_id}
              consumerGiftcard={this.state.consumerGiftcardToInvite}
              onClose={() => this.setState({ consumerGiftcardToInvite: null })}
              onSubmit={this.sendInvitations}
              snackbarSuccess={this.props.snackbarSuccess}
            />
          )}
          {!!this.state.consumerPhysicalGiftcardSelected && (
            <ConsumerPhysicalGiftcardDetails
              consumerGiftcard={this.state.consumerPhysicalGiftcardSelected}
              isOpen={!!this.state.consumerPhysicalGiftcardSelected}
              onClose={() =>
                this.setState({ consumerPhysicalGiftcardSelected: null })
              }
            />
          )}
          {!this.props.is_pos_member && (
            <>
              <Typography variant="h5">
                {t('consumerGiftcard.list.myGifted')}
              </Typography>
              <Paper className={classes.listConsumerGiftcard}>
                <PaginatedListBase
                  itemPerPage={PAGE_SIZE}
                  items={this.props.receivedState.consumerGiftcardList}
                  listProps={{
                    disablePadding: 'true',
                    dense: 'true',
                  }}
                  loading={this.props.receivedState.consumerGiftcardLoading}
                  nbItems={this.props.receivedState.consumerGiftcardCount}
                  onPageRequested={(page: number, pageSize: number) =>
                    this.props.fetchConsumerGiftcardReceivedList(
                      this.props.id,
                      page,
                      pageSize,
                    )
                  }
                  page={this.props.receivedState.consumerGiftcardPage}
                  renderCustomPageFirst={
                    !!this.props.selectedConsumerGiftcardId
                  }
                  renderEmpty={() => (
                    <div className={classes.emptyContainer}>
                      <Typography color="textSecondary" variant="caption">
                        {t('consumerGiftcard.isEmpty')}
                      </Typography>
                      <Divider />
                    </div>
                  )}
                  renderItem={(
                    cgc: WithGiftcard<
                      WithSender<WithReceiver<ConsumerGiftcard>>
                    >,
                  ) => (
                    <ConsumerGiftcardListItem
                      key={cgc.id}
                      divider
                      showAsRecipient
                      showSender
                      consumerGiftcard={cgc}
                      giftcard={cgc.giftcard}
                      memberReceiver={cgc.dst_member}
                      memberSender={cgc.src_member}
                      onClickReceiver={this.props.goToMemberGiftcard}
                      onClickSender={this.props.goToMemberGiftcard}
                      selected={
                        cgc.id === this.props.selectedConsumerGiftcardId
                      }
                      sharedFromFranchisor={!!cgc.consumer_giftcard_source}
                    />
                  )}
                />
              </Paper>
            </>
          )}
        </Grid>
        <Grid item md={6} sm={12}>
          {this.props.selectedConsumerGiftcardId && (
            <ConsumerGiftcardDetail
              consumerGiftcard={this.props.selectedConsumerGiftcard}
              consumerGiftCardLoading={this.props.consumerGiftcardLoading}
              goToGiftcard={this.props.goToGiftcard}
              invoice={this.props.relatedInvoice}
              onInvoiceClick={this.props.goToInvoice}
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
    {
      id,
      selectedConsumerGiftcardId,
    }: { id: number; selectedConsumerGiftcardId: number },
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
    is_pos_member: getMember(state, id)?.is_pos,
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
      // @ts-expect-error
      selectedConsumerGiftcardId,
    ),
    companyTheme: themeSelectors.getTheme(state),
  }),
  {
    fetchGiftcardBulk: fetchGiftcardBulkAction,
    snackbarSuccess,
    goToMemberGiftcard: (consumerGiftcardId: number, memberId: number) =>
      push(`/member/${memberId}/giftcard/${consumerGiftcardId}`),
    fetchConsumerGiftcardReceivedList: fetchConsumerGiftcardReceivedListAction,
    fetchConsumerGiftcardSentList: fetchConsumerGiftcardSentListAction,
    fetchMemberBulkById: fetchMemberBulkByIdAction,
    goToInvoice: (uuid: string) => push(`/invoice/${uuid}`),
    fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
    retrieveConsumerGiftcard,
    goToGiftcard: (giftcardId: number) => push(`/giftcard/${giftcardId}`),
    sendEmailInvitation,
  },
);

type HandlersProps = {
  fetchConsumerGiftcardSentList: (
    id: number,
    page: number,
    page_size: number,
  ) => void;
  fetchConsumerGiftcardReceivedList: (
    id: number,
    page: number,
    page_size: number,
  ) => void;
  fetchInvoiceByInvoiceItem: (objectId: number) => void;
};

type StateHandlersProps = {
  relatedInvoice: Invoice | null;
  setRelatedInvoice: (invoice?: Invoice) => void;
};

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
    fetchConsumerGiftcardSentList:
      ({
        fetchConsumerGiftcardSentList,
        fetchGiftcardBulk,
        fetchMemberBulkById,
        selectedConsumerGiftcardId,
      }) =>
      (id: number, page: number, page_size: number) => {
        fetchConsumerGiftcardSentList(
          id,
          { page, page_size, current_item_id: selectedConsumerGiftcardId },
          {
            onSuccess: (consumerGiftcardList: ConsumerGiftcard[]) => {
              fetchGiftcardBulk(
                consumerGiftcardList.map((cg: ConsumerGiftcard) => cg.giftcard),
              );
              fetchMemberBulkById(
                uniq([
                  ...consumerGiftcardList.map((cg) => cg.src_member),
                  ...consumerGiftcardList.map((cg) => cg.dst_member),
                ]),
              );
            },
          },
        );
      },
    fetchConsumerGiftcardReceivedList:
      ({
        fetchConsumerGiftcardReceivedList,
        fetchGiftcardBulk,
        fetchMemberBulkById,
        selectedConsumerGiftcardId,
      }) =>
      (id: number, page: number, page_size: number) => {
        fetchConsumerGiftcardReceivedList(
          id,
          { page, page_size, current_item_id: selectedConsumerGiftcardId },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
              fetchMemberBulkById(
                uniq([
                  ...consumerGiftcardList.map((cg) => cg.src_member),
                  ...consumerGiftcardList.map((cg) => cg.dst_member),
                ]),
              );
            },
          },
        );
      },
    fetchInvoiceByInvoiceItem:
      ({ fetchInvoiceByInvoiceItem, setRelatedInvoice }) =>
      (objectId: number) => {
        fetchInvoiceByInvoiceItem(BUYABLE_ITEM_GIFTCARD, objectId, {
          onSuccess: (inv: Invoice) => {
            setRelatedInvoice(inv);
          },
        });
      },
  }),
)(MemberDetailGiftcard);
