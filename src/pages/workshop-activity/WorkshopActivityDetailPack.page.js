// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { push as routerPush } from 'connected-react-router';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';

import { withTranslation, TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import flatten from 'lodash/flatten';
import PaymentPackListItem from '../../libs/payment-packs/components/PaymentPackListItem.component';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  resetCompatiblePaymentPacks as resetCompatiblePaymentPacksAction,
  fetchOne as fetchDetailPaymentPackAction,
} from '../../libs/payment-packs/actions';
import PaginatedConsumerPackList from '../../libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import {
  resetByPaymentPack as resetByPaymentPackAction,
  fetchByPaymentPack as fetchByPaymentPackAction,
} from '../../libs/consumer-payment-pack/actions';
import { getConsumerPacksByPackWithMember } from '../../libs/consumer-payment-pack/selectors';

import type { PaymentPack } from '../../libs/payment-packs/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  getActivityCompatiblePaymentPacks,
  getPaymentPackById,
} from '../../libs/payment-packs/selectors';
import { fetchFilteredMembers } from '../../libs/member/actions';

import { getMetaActivity } from '../../libs/meta-activity/selectors';
import { fetchConsumerPaymentPackLinks } from '../../libs/relationship/actions';
import { withIsSharedActive } from '../../libs/relationship/selectors';

type Props = {
  id: number,
  paymentPacks: Array<PaymentPack>,
  classes: Object,
  metaActivity: MetaActivity,
  fetchPaymentPacks: (id: number) => void,
  fetchConsumerPaymentPackLinks: (
    links_id: number,
    options: OptionCallback,
  ) => void,
};

const PAGE_SIZE = 10;
const CONSUMER_PACKS_PAGE_SIZE = 7;

const ClickOnPaymentPack = withTranslation(['paymentPack'])(
  (props: { classes: Object, t: TFunction }) => (
    <div className={props.classes.container}>
      <div className={props.classes.emptyMessageContainer}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography
          className={props.classes.emptyMessageText}
          color="textSecondary"
          variant="caption"
        >
          {props.t('details.pleaseSelectAPack')}
        </Typography>
      </div>
    </div>
  ),
);

export class WorkshopActivityDetailPacks extends Component<state, Props> {
  componentWillMount() {
    this.props.resetPaymentPacks();
    this.props.resetConsumerPacks();
    if (this.props.packId) {
      this.props.fetchDetailPaymentPack(this.props.packId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.packId !== prevProps.packId) {
      this.props.resetConsumerPacks();
      this.props.fetchConsumerPacks(
        this.props.packId,
        1,
        CONSUMER_PACKS_PAGE_SIZE,
        {
          onSuccess: (cpps) => {
            this.props.fetchFilteredMembers({
              id__in: cpps.map((b) => b.member_id),
            });
            this.props.fetchConsumerPaymentPackLinks(
              flatten(
                cpps.map((cpp) => cpp.src_consumer_payment_pack.map((i) => i)),
              ),
            );
          },
        },
      );
    }
  }

  render() {
    const { paymentPacks, t, classes } = this.props;
    return (
      <div>
        <Grid container direction="row" alignItems="stretch">
          <Grid item sm={12} md={6} className={classes.panel}>
            <Typography variant="h5" component="h2" className={classes.header}>
              {t('detail.pack.paymentPacks')}
            </Typography>
            <Paper>
              <PaginatedListBase
                listProps={{ disablePadding: 'true', dense: 'true' }}
                items={paymentPacks.items}
                nbItems={paymentPacks.count}
                loading={paymentPacks.loading}
                page={paymentPacks.page}
                itemPerPage={PAGE_SIZE}
                onPageRequested={(page: number, pageSize: number) =>
                  this.props.fetchPaymentPacks(this.props.id, page, pageSize)
                }
                renderEmpty={() => (
                  <div>
                    <Typography
                      className={this.props.classes.emptyContainer}
                      variant="caption"
                      color="textSecondary"
                    >
                      {t('detail.pack.noCompatiblePass')}
                    </Typography>
                    <Divider />
                  </div>
                )}
                renderItem={(pack) => (
                  <PaymentPackListItem
                    key={pack.id}
                    pack={pack}
                    divider
                    selected={pack.id === this.props.packId}
                    onClick={() => this.props.goToPack(this.props.id, pack.id)}
                  />
                )}
              />
            </Paper>
          </Grid>
          <Grid item sm={12} md={6} className={classes.panel}>
            {this.props.packId ? (
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  className={classes.header}
                >
                  {t('detail.pack.consumerPacks')}
                </Typography>
                <Paper>
                  <PaginatedConsumerPackList
                    paymentPack={this.props.selectedPaymentPack}
                    items={this.props.consumerPacks.items}
                    onClick={(cpp) => {
                      this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
                    }}
                    nbItems={this.props.consumerPacks.count}
                    loading={this.props.consumerPacks.loading}
                    page={this.props.consumerPacks.page}
                    consumerPacksUpdating={this.props.consumerPacks.updating}
                    itemPerPage={CONSUMER_PACKS_PAGE_SIZE}
                    onPageRequested={(page: number, pageSize: number) =>
                      this.props.fetchConsumerPacks(
                        this.props.packId,
                        page,
                        pageSize,
                        {
                          onSuccess: (cpps) => {
                            this.props.fetchFilteredMembers({
                              id__in: cpps.map((b) => b.member_id),
                            });
                          },
                        },
                      )
                    }
                  />
                </Paper>
              </div>
            ) : (
              <ClickOnPaymentPack classes={this.props.classes} />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  header: {
    paddingBottom: theme.spacing(1),
  },
  panel: {
    width: '100%',
    padding: theme.spacing(1),
  },
  typographyContainer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
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
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number', packId: 'packId:number' }),
  withTranslation(['metaActivity']),
  withStyles(styles),
  connect(
    (state, { id, packId }) => ({
      loading: state.metaActivity.loading,
      metaActivity: getMetaActivity(state, id),
      paymentPacks: {
        items: getActivityCompatiblePaymentPacks(state),
        count: state.paymentPack.byActivity.count || 0,
        page: state.paymentPack.byActivity.page || 1,
        loading: state.paymentPack.byActivity.loading,
      },
      selectedPaymentPack: getPaymentPackById(state)[packId],
      consumerPacks: {
        items: withIsSharedActive(getConsumerPacksByPackWithMember)(state),
        count: state.consumerPaymentPack.byPaymentPack.count,
        loading:
          state.consumerPaymentPack.byPaymentPack.loading ||
          state.paymentPack.loading,
        page: state.consumerPaymentPack.byPaymentPack.page,
      },
    }),
    {
      fetchConsumerPacks: (
        paymentPackId: number,
        page: number,
        pageSize: number,
        options: OptionCallback,
      ) => fetchByPaymentPackAction(paymentPackId, page, pageSize, options),
      resetPaymentPacks: resetCompatiblePaymentPacksAction,
      fetchPaymentPacks: fetchActivityCompatiblePaymentPacksAction,
      fetchDetailPaymentPack: fetchDetailPaymentPackAction,
      fetchFilteredMembers,
      resetConsumerPacks: resetByPaymentPackAction,
      goToPack: (id, ppId) =>
        routerPush(`/workshop-activity/${id}/pack/${ppId}`),
      goToConsumerPackDetail: (memberId, passId) =>
        routerPush(`/member/${memberId}/pass/${passId}`),
      fetchConsumerPaymentPackLinks,
    },
  ),
)(WorkshopActivityDetailPacks);
