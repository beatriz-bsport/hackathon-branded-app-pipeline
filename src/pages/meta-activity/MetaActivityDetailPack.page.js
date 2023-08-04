// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { push as routerPush } from 'connected-react-router';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert/Alert';

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
};

const PAGE_SIZE = 10;
const CONSUMER_PACKS_PAGE_SIZE = 7;

const ClickOnPaymentPack = withTranslation(['paymentPack'])(
  (props: { classes: Object, t: TFunction }) => (
    <div className={props.classes.container}>
      <div className={props.classes.emptyMessageContainer}>
        <Alert className={props.classes.alertInfo} color="grey" severity="info">
          {props.t('details.pleaseSelectAPack')}
        </Alert>
      </div>
    </div>
  ),
);

export class MetaActivityDetailPacks extends Component<state, Props> {
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
                cpps.map((cpp) =>
                  cpp.src_consumer_payment_pack.map((id) => id),
                ),
              ),
            );
          },
        },
      );
    }
  }

  renderItem = (pack) => {
    if (!pack) return null;
    return (
      <PaymentPackListItem
        key={pack.id}
        divider
        creditScaleFactor={this.props.theme.pass_credit_factor}
        onClick={() => this.props.goToPack(this.props.id, pack.id)}
        pack={pack}
        selected={pack.id === this.props.packId}
      />
    );
  };

  render() {
    const { paymentPacks, t, classes } = this.props;
    return (
      <div>
        <Grid container alignItems="stretch" direction="row">
          <Grid item className={classes.panel} md={6} sm={12}>
            <Typography className={classes.header} component="h2" variant="h5">
              {t('detail.pack.paymentPacks')}
            </Typography>
            <Paper>
              <PaginatedListBase
                itemPerPage={PAGE_SIZE}
                items={paymentPacks.items}
                listProps={{ disablePadding: 'true', dense: 'true' }}
                loading={paymentPacks.loading}
                nbItems={paymentPacks.count}
                onPageRequested={(page: number, pageSize: number) =>
                  this.props.fetchPaymentPacks(this.props.id, page, pageSize)
                }
                page={paymentPacks.page}
                renderEmpty={() => (
                  <div>
                    <Typography
                      className={this.props.classes.emptyContainer}
                      color="textSecondary"
                      variant="caption"
                    >
                      {t('detail.pack.noCompatiblePass')}
                    </Typography>
                    <Divider />
                  </div>
                )}
                renderItem={this.renderItem}
              />
            </Paper>
          </Grid>
          <Grid item className={classes.panel} md={6} sm={12}>
            {this.props.packId ? (
              <div>
                <Typography
                  className={classes.header}
                  component="h2"
                  variant="h5"
                >
                  {t('detail.pack.consumerPacks')}
                </Typography>
                <Paper>
                  <PaginatedConsumerPackList
                    consumerPacksUpdatingById={
                      this.props.consumerPacks.updatingById
                    }
                    itemPerPage={CONSUMER_PACKS_PAGE_SIZE}
                    items={this.props.consumerPacks.items}
                    loading={this.props.consumerPacks.loading}
                    nbItems={this.props.consumerPacks.count}
                    onClick={(cpp) => {
                      this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
                    }}
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
                            this.props.fetchConsumerPaymentPackLinks(
                              flatten(
                                cpps.map((cpp) =>
                                  cpp.src_consumer_payment_pack.map((id) => id),
                                ),
                              ),
                            );
                          },
                        },
                      )
                    }
                    page={this.props.consumerPacks.page}
                    paymentPack={this.props.selectedPaymentPack}
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
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
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
        updatingById: state.consumerPaymentPack.updatingById,
      },
      theme: state.theme.theme,
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
      goToPack: (id, ppId) => routerPush(`/activity/${id}/pack/${ppId}`),
      goToConsumerPackDetail: (memberId, passId) =>
        routerPush(`/member/${memberId}/pass/${passId}`),
      fetchConsumerPaymentPackLinks,
    },
  ),
)(MetaActivityDetailPacks);
