// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';
import { compose } from 'recompose';

import PaymentPackCard from '../../libs/payment-packs/PaymentPackCard.component';
import PaginatedConsumerPackList from '../../libs/payment-packs/PaginatedConsumerPackList.component';
import PaymentPackDeleteDialog from '../../libs/payment-packs/PaymentPackDeleteDialog.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  consumerPaymentPack as consumerPackActions,
  paymentPack as paymentPackActions,
} from '../../actions';
import paymentPackSelector from '../../libs/payment-packs/selectors';
import type { MetaActivity } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAllActivities } from '../../libs/meta-activity/actions/meta-activity.actions';
import { fetchAll as fetchAllWorkshops } from '../../libs/meta-activity/actions/workshop-activity.actions';
import {
  getMetaActivities,
  getWorkshops,
} from '../../libs/meta-activity/selectors';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';

import type {
  PaymentPack,
  ConsumerPaymentPack,
} from '../../libs/payment-packs/types';

type Props = {
  loading: boolean,
  id: number,

  pack: PaymentPack,
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  fetchEstablishments: () => void,
  goToConsumerPackDetail: (memberId: number, passId: number) => void,
  fetchAllActivities: () => void,
  fetchAllWorkshops: () => void,
  consumerPacks: {
    items: Array<ConsumerPaymentPack>,
    count: number,
    loading: boolean,
    page: number,
    updating: Array<number>,
  },

  pushToEdit: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  updatePaymentPack: (id: number, data: [*]) => void,
  fetchConsumerPacks: (
    paymentPackId: number,
    page: number,
    pageSize: number,
  ) => void,
  resetConsumerPacks: () => void,

  classes: Object,
};

type State = {
  paymentPackToDeleteId: ?number,
};

const CONSUMER_PACK_PAGINATION_SIZE = 7;

export class PaymentPackDetail extends Component<Props, State> {
  state = {
    paymentPackToDeleteId: null,
  };

  componentWillMount() {
    this.props.resetConsumerPacks();
    this.props.fetchEstablishments();
    this.props.fetchAllActivities();
    this.props.fetchAllWorkshops();
  }

  requestEdit = (p: PaymentPack) => {
    this.props.pushToEdit(p.id);
  };

  requestDelete = (paymentPack: Object) => {
    this.setState({
      paymentPackToDeleteId: paymentPack.id,
    });
    this.props.fetchConsumerPacks(
      paymentPack.id,
      1,
      CONSUMER_PACK_PAGINATION_SIZE,
    );
  };

  cancelDelete = () => {
    this.setState({ paymentPackToDeleteId: null });
  };

  deletePaymentPack = async (id: number) => {
    this.props.updatePaymentPack(id, { disabled: true });
    this.setState({ paymentPackToDeleteId: null });
  };

  render() {
    const {
      pack,
      loading,
      classes,
      metaActivities,
      establishments,
    } = this.props;

    if (loading) {
      return <LinearProgress />;
    }

    return (
      <Grid container spacing={24} alignItems="stretch">
        <Grid item xs={12} md={6} className={classes.paymentPackContainer}>
          <PaymentPackCard
            pack={pack}
            metaActivities={metaActivities}
            establishments={establishments}
            onEditButtonClick={() => this.requestEdit(pack)}
            onDeleteButtonClick={() => this.requestDelete(pack)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <PaginatedConsumerPackList
              paymentPack={this.props.pack}
              incrementCredit={this.props.incrementCredit}
              decrementCredit={this.props.decrementCredit}
              items={this.props.consumerPacks.items}
              onClick={(cpp) => {
                this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
              }}
              nbItems={this.props.consumerPacks.count}
              loading={this.props.consumerPacks.loading}
              page={this.props.consumerPacks.page}
              consumerPacksUpdating={this.props.consumerPacks.updating}
              itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerPacks(
                  this.props.pack.id,
                  page,
                  pageSize,
                )
              }
            />
          </Paper>
        </Grid>
        <PaymentPackDeleteDialog
          open={!!this.state.paymentPackToDeleteId}
          pack={this.props.pack}
          onDelete={() =>
            this.deletePaymentPack(this.state.paymentPackToDeleteId)
          }
          consumerPackSummary={
            this.state.paymentPackToDeleteId ? (
              <PaginatedConsumerPackList
                paymentPack={this.props.pack}
                incrementCredit={this.props.incrementCredit}
                decrementCredit={this.props.decrementCredit}
                items={this.props.consumerPacks.items}
                consumerPacksUpdating={this.props.consumerPacks.updating}
                nbItems={this.props.consumerPacks.count}
                onClick={(cpp) => {
                  this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
                }}
                loading={this.props.consumerPacks.loading}
                page={this.props.consumerPacks.page}
                itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
                onPageRequested={(page: number, pageSize: number) =>
                  this.props.fetchConsumerPacks(
                    this.props.pack.id,
                    page,
                    pageSize,
                  )
                }
              />
            ) : null
          }
          onCancel={this.cancelDelete}
        />
      </Grid>
    );
  }
}

const styles = (theme) => ({
  emptyContainer: {
    padding: theme.spacing.unit * 2,
  },
  paymentPackContainer: {
    paddingBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing.unit * 4,
    },
  },
});

function mapStateToProps(state, { id }) {
  return {
    loading: state.paymentPack.loading || state.establishment.loading,
    pack: paymentPackSelector.get(state, id),
    metaActivities: [...getMetaActivities(state), ...getWorkshops(state)],
    establishments: getAllEstablishments(state),
    consumerPacks: {
      items: state.consumerPaymentPack.byPaymentPack.items.filter(
        (cpp) => !cpp.reverted,
      ),
      count: state.consumerPaymentPack.byPaymentPack.count,
      loading: state.consumerPaymentPack.byPaymentPack.loading,
      page: state.consumerPaymentPack.byPaymentPack.page,
      updating: state.consumerPaymentPack.updatingConsumerPacks,
    },
  };
}

export default compose(
  withNamespaces(),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    mapStateToProps,
    {
      fetchAllActivities,
      fetchAllWorkshops,
      incrementCredit: (consumerPackId) =>
        consumerPackActions.updateCredit(consumerPackId, 1),
      decrementCredit: (consumerPackId) =>
        consumerPackActions.updateCredit(consumerPackId, -1),
      updatePaymentPack: (paymentPackId, data) =>
        paymentPackActions.patch(paymentPackId, data, true),
      pushToEdit: (paymentPackId: number) =>
        pushRouter(`/payment-pack/${paymentPackId}/edit`),
      resetConsumerPacks: consumerPackActions.resetByPaymentPack,
      fetchEstablishments,
      goToConsumerPackDetail: (memberId, passId) =>
        pushRouter(`/member/${memberId}/pass/${passId}`),
      fetchConsumerPacks: (
        paymentPackId: number,
        page: number,
        pageSize: number,
      ) =>
        consumerPackActions.fetchByPaymentPack(paymentPackId, page, pageSize),
    },
  ),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
)(PaymentPackDetail);
