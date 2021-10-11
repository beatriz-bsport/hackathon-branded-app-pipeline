import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { withTranslation, WithTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import GiftcardCardDetail from '../../libs/giftcard/components/GiftcardCardDetail.component';
import {
  retrieveGiftcard,
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAction,
} from '../../libs/giftcard/actions';
import ConsumerGiftcardListItem from '../../libs/giftcard/components/ConsumerGiftcardListItem.component';
import { Giftcard, ConsumerGiftcard } from '../../libs/giftcard/types';
import { fetchMemberBulkById as fetchMemberBulkAction } from '../../libs/member/actions';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import { snackbarSuccess } from '../../actions/snackbar.actions';
import {
  withSender,
  withReceiver,
  getConsumerGiftcardList,
  getGiftcard,
} from '../../libs/giftcard/selectors';

import BackofficeLinearProgressComponent from '../../components/navigation/BackofficeLinearProgress.component';
import { RootState } from '../../reducers';

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    emptyContainer: {
      padding: theme.spacing(2),
    },
    fullWidth: {},
  });

type OwnProps = {
  id: number;
  giftcard: Giftcard | null;
  consumerGiftcardLoading: boolean;
  consumerGiftcardList: Array<ConsumerGiftcard>;
  consumerGiftcardCount: number;
  fetchConsumerGiftcardList: (params: any) => void;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

const PAGE_SIZE = 15;

export class GiftcardDetailPage extends Component<Props> {
  componentDidMount() {
    this.props.retrieveGiftcard(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id !== prevProps.id) {
      this.props.retrieveGiftcard(this.props.id);
    }
  }

  render() {
    const { classes, t } = this.props;
    if (!this.props.giftcard) {
      return <BackofficeLinearProgressComponent />;
    }
    return (
      <Grid container spacing={2}>
        <Grid item sm={12} md={6}>
          <GiftcardCardDetail
            snackbarSuccess={this.props.snackbarSuccess}
            giftcard={this.props.giftcard}
          />
        </Grid>
        <Grid item sm={12} md={6} style={{ width: '100%' }}>
          <Paper className={classes.fullWidth}>
            <PaginatedListBase
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              items={this.props.consumerGiftcardList}
              nbItems={this.props.consumerGiftcardCount}
              loading={this.props.consumerGiftcardLoading}
              page={this.props.consumerGiftcardPage}
              itemPerPage={PAGE_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerGiftcardList(page, pageSize)
              }
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography variant="caption" color="textSecondary">
                    {t('consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(cgc: ConsumerGiftcard) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  consumerGiftcard={cgc}
                  showReceiver
                  showSender
                  memberSender={cgc.src_member}
                  memberReceiver={cgc.dst_member}
                  giftcard={this.props.giftcard}
                  onClickSender={this.props.goToMemberGiftcard}
                  divider
                  onClickReceiver={
                    cgc.dst_member && this.props.goToMemberGiftcard
                  }
                />
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    consumerGiftcardCount: state.giftcard.consumerGiftcard.count,
    consumerGiftcardLoading: state.giftcard.consumerGiftcard.loading,
    consumerGiftcardPage: state.giftcard.consumerGiftcard.page,
    consumerGiftcardList: withSender(withReceiver(getConsumerGiftcardList))(
      state,
    ),
    giftcard: getGiftcard(state, id),
  }),
  {
    retrieveGiftcard,
    fetchMemberBulk: fetchMemberBulkAction,
    snackbarSuccess,
    goToMemberGiftcard: (
      consumerGiftcardId: number,
      giftcardId: number,
      memberId: number,
    ) => push(`/member/${memberId}/giftcard/${consumerGiftcardId}`),
    fetchConsumerGiftcardList: fetchConsumerGiftcardListAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withHandlers({
    fetchConsumerGiftcardList: ({
      fetchConsumerGiftcardList,
      id,
      fetchMemberBulk,
    }) => (page: number, page_size: number) => {
      fetchConsumerGiftcardList(
        { page, page_size, giftcard: id },
        {
          onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
            fetchMemberBulk([
              ...consumerGiftcardList.map((cg) => cg.src_member),
              ...consumerGiftcardList.map((cg) => cg.dst_member),
            ]);
          },
        },
      );
    },
  }),
  withTitle(({ giftcard }) => (giftcard ? giftcard.name : '')),
)(GiftcardDetailPage);
