// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { compose, withProps } from 'recompose';

import PaymentPackNotification from '../../libs/payment-packs/components/PaymentPackNotification.component';
import PaymentPackCard from '../../libs/payment-packs/components/PaymentPackCard.component';
import PaginatedConsumerPackList from '../../libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import PaymentPackDeleteDialog from '../../libs/payment-packs/components/PaymentPackDeleteDialog.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import {
  updateCredit as updateCreditAction,
  resetByPaymentPack as resetByPaymentPackAction,
  fetchByPaymentPack as fetchByPaymentPackAction,
} from '../../libs/consumer-payment-pack/actions';
import { getConsumerPacksByPackWithMember } from '../../libs/consumer-payment-pack/selectors';

import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '../../libs/email-editor/actions';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

import {
  patch as patchPaymentPack,
  createPackNotification as createNotification,
  deletePackNotification as deleteNotification,
  updatePackNotification as updateNotification,
  fetchPackNotifications as fetchNotificationsAction,
  fetchOne as fetchPaymentPack,
} from '../../libs/payment-packs/actions';
import paymentPackSelector, {
  withSCT,
} from '../../libs/payment-packs/selectors';
import type { MetaActivity } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchEstablishmentBulk } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk } from '../../libs/meta-activity/actions';
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
import { fetchFilteredMembers } from '../../libs/member/actions';
import type { OptionCallback } from '../../state/types';

import { snackbarSuccess } from '../../actions/snackbar.actions';

import { getAllSmartList } from '../../libs/smart-list/selectors';

import {
  fetchSmartListBulk as fetchSmartListBulkAction,
  fetchAllSmartLists,
} from '../../libs/smart-list/actions';

type Props = {
  loading: boolean,
  id: number,

  fetchFilteredMembers: (params: any) => void,

  pack: PaymentPack,
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  goToConsumerPackDetail: (memberId: number, passId: number) => void,
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
    options: OptionCallback,
  ) => void,
  resetConsumerPacks: () => void,

  snackbarSuccess: (string) => void,

  classes: Object,

  // notification
  fetchNotifications: (id: number) => void,
  fetchEmailTemplatesSummaries: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  getSmartLists: () => void,
  createNotification: () => void,
  updateNotification: (data: any) => void,
  deleteNotification: (id: number) => void,
  goToSmartlist: () => void,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  smartListLoading: boolean,

  email_templates_list: Array<any>,
  email_templates_details: Array<any>,
  smartLists: Array<any>,
  notifications: Array<any>,
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
  }

  componentDidMount() {
    this.props.fetchPaymentPack(this.props.id, {
      onSuccess: (pp) => {
        this.props.fetchMetaActivityBulk(pp.metaActivities);
        this.props.fetchEstablishmentBulk(pp.establishments);
      },
    });
    this.props.fetchNotifications(this.props.id);
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
      notifications,
    } = this.props;

    if (loading || !this.props.pack) {
      return <LinearProgress />;
    }

    return (
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6} className={classes.paymentPackContainer}>
          <PaymentPackCard
            pack={pack}
            metaActivities={metaActivities}
            establishments={establishments}
            onEditButtonClick={() => this.requestEdit(pack)}
            onDeleteButtonClick={() => this.requestDelete(pack)}
            snackbarSuccess={this.props.snackbarSuccess}
          />
          <PaymentPackNotification
            pack={pack}
            notifications={notifications}
            getEmails={this.props.fetchEmailTemplatesSummaries}
            emails={this.props.email_templates_list}
            getEmailDetail={this.props.fetchEmailTemplateDetail}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emailDetailLoading={this.props.emailDetailLoading}
            createNotification={this.props.createNotification}
            deleteNotification={this.props.deleteNotification}
            updateNotification={this.props.updateNotification}
            onEditButtonClick={(notifId) => this.editNotification(notifId)}
            onDeleteButtonClick={(notifId) => this.deleteNotification(notifId)}
            onCreateButtonClick={() => this.createNotification(pack.id)}
            smartLists={this.props.smartLists}
            smartListLoading={this.props.smartListLoading}
            getSmartLists={this.props.getSmartLists}
            goToSmartlist={this.props.goToSmartlist}
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
    padding: theme.spacing(2),
  },
  paymentPackContainer: {
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(4),
    },
  },
});

function mapStateToProps(state, { id }) {
  return {
    loading: state.paymentPack.loading || state.establishment.loading,
    pack: paymentPackSelector.getWithSCT(state, id),
    notifications: {
      items: paymentPackSelector.getPaymentPackNotifications(state, id),
      loading: state.paymentPack.notification.loading,
      updating: state.paymentPack.notification.update.id,
    },
    metaActivities: [...getMetaActivities(state), ...getWorkshops(state)],
    establishments: getAllEstablishments(state),
    consumerPacks: {
      items: getConsumerPacksByPackWithMember(state),
      count: state.consumerPaymentPack.byPaymentPack.count,
      loading: state.consumerPaymentPack.byPaymentPack.loading,
      page: state.consumerPaymentPack.byPaymentPack.page,
      updating: state.consumerPaymentPack.updatingConsumerPacks,
    },
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.isLoading,
    emailDetailLoading: state.emailTemplate.detail.isLoading,
    smartLists: getAllSmartList(state),

    smartListLoading: state.smartList.isLoading,
  };
}

export default compose(
  withNamespaces(),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    mapStateToProps,
    {
      snackbarSuccess,
      createNotification,
      deleteNotification,
      updateNotification,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      goToEmailCreate: () => pushRouter('/email-template/create'),
      fetchMetaActivityBulk,
      fetchEstablishmentBulk,
      fetchPaymentPack,

      incrementCredit: (consumerPackId) =>
        updateCreditAction(consumerPackId, 1),
      decrementCredit: (consumerPackId) =>
        updateCreditAction(consumerPackId, -1),
      updatePaymentPack: (paymentPackId, data) =>
        patchPaymentPack(paymentPackId, data, true),
      pushToEdit: (paymentPackId: number) =>
        pushRouter(`/payment-pack/${paymentPackId}/edit`),
      resetConsumerPacks: resetByPaymentPackAction,
      goToSmartlist: () => pushRouter('/smart-list'),

      goToConsumerPackDetail: (memberId, passId) =>
        pushRouter(`/member/${memberId}/pass/${passId}`),
      fetchConsumerPacks: (
        paymentPackId: number,
        page: number,
        pageSize: number,
        options: OptionCallback,
      ) => fetchByPaymentPackAction(paymentPackId, page, pageSize, options),
      fetchFilteredMembers,
      fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
      fetchSmartListBulk: fetchSmartListBulkAction,
      fetchNotifications: fetchNotificationsAction,
      fetchEmailTemplatesSummaries,
      getSmartLists: fetchAllSmartLists,
    },
  ),
  withProps(
    ({
      fetchNotifications,
      fetchEmailTemplateSummariesBulk,
      fetchSmartListBulk,
    }) => ({
      fetchNotifications: (params) =>
        fetchNotifications(params, {
          onSuccess: (notificationList) => {
            fetchEmailTemplateSummariesBulk(
              notificationList.map((notification) => notification.email_design),
            );
            fetchSmartListBulk(
              [
                ...notificationList.map(
                  (notification) => notification.smartlist_include,
                ),
                ...notificationList.map(
                  (notification) => notification.smartlist_exclude,
                ),
              ].flat(),
            );
          },
        }),
    }),
  ),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
)(PaymentPackDetail);
