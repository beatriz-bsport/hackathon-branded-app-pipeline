// @flow

import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';

import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/master-data/subscription-payment-methods.js';
import Fab from '@material-ui/core/Fab';
import PersonIcon from '@material-ui/icons/Person';
import withStyles from '@material-ui/core/styles/withStyles';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withTitle from '../../hocs/with-title.hoc';
import {
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchPaymentPackList as fetchPaymentPackListAction,
} from '../../libs/payment-packs/actions';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getEnabled as getEnabledPaymentPackList } from '../../libs/payment-packs/selectors';

import {
  fetch as fetchSubscriptionAction,
  stop as stopSubscription,
  updatePlannedInvoicePrice as updatePlannedInvoicePriceAction,
  updateSubscriptionRenewal as updateSubscriptionRenewalAction,
  freezeSubscription as freezeSubscriptionAction,
  switchSubscriptionPaymentPack as switchSubscriptionPaymentPackAction,
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction,
  fetchSubscriptionEventList as fetchSubscriptionEventListAction,
  flagPlannedInvoiceAsLast as flagPlannedInvoiceAsLastAction,
  unflagPlannedInvoiceAsLast as unflagPlannedInvoiceAsLastAction,
} from '../../libs/subscription/actions';
import { fetchMember as fetchMemberAction } from '../../libs/member/actions';
import {
  get as getSubscriptionById,
  getSubscriptionEventList,
  getSubscriptionEventState,
} from '../../libs/subscription/selectors';
import SubscriptionComponent from '../../libs/subscription/components/SubscriptionDEPRECATED.component';
import SubscriptionFreezerDialog from '../../libs/subscription/components/SubscriptionFreezerDialog.component';
import PlannedInvoicePriceUpdater from '../../libs/subscription/components/PlannedInvoicePriceUpdater.component';
import SubscriptionPaymentPackSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentPackSwitcherDialog.component';
import SubscriptionPaymentMethodSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentMethodSwitcherDialog.component';
import StopConfirmationDialog from '../../libs/subscription/components/StopConfirmationDialog.component';
import SubscriptionScheduledStopDialog from '../../libs/subscription/components/SubscriptionScheduledStopDialog.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';

import type {
  Subscription,
  PlannedInvoice,
} from '../../libs/subscription/types';
import type { OptionCallback } from '../../state/types';

type Props = {
  classes: Object,
  loading: boolean,

  subscription: ?Subscription,

  fetchSubscription: () => void,
  goToInvoice: (uuid: string) => void,
  goToMember: (id: number) => void,
  goToSubscribe: (id: number) => void,

  plannedInvoiceToUpdate: ?PlannedInvoice,
  setPlannedInvoiceToUpdate: (pl: ?PlannedInvoice) => void,

  setFreezeDialogOpen: (boolean) => void,
  freezeDialogOpen: boolean,
  freezeSubscription: ({ days: number }) => void,

  setSwitchPaymentMethodDialogOpen: (open: boolean) => void,
  switchPaymentMethodDialogOpen: boolean,
  switchPaymentMethod: (source: string) => void,
  openPaymentMethodSwitch: () => void,

  switchPackDialogOpen: boolean,
  setSiwtchPackDialogOpen: (boolean) => void,
  switchSubscriptionPaymentPack: (payment_pack: number) => void,
  availablePaymentPackList: Array<PaymentPack>,

  stop: (id: number) => void,
  setStopDialogOpen: (open: boolean) => void,
  stopDialogOpen: boolean,

  eventList: Array<SubscriptionEvent>,
  eventPage: number,
  eventLoading: boolean,
  fetchSubscriptionEventList: (data: {
    page: number,
    page_size: number,
    billing_plan: number,
  }) => void,

  memberLoading: boolean,

  openPackSwitcherDialog: () => void,

  updateSubscriptionRenewal: (data: { auto_renewal: boolean }) => void,
  updatePlannedInvoicePrice: (
    id: number,
    data: {
      planned_invoice: number,
      price: string,
    },
    options: OptionCallback,
  ) => void,
  fetchPrivatePassList: () => void,

  requestSetupIntentSecret: () => void,
  fetchPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  scheduledStopDialogOpen: boolean,
  setScheduledStopDialogOpen: (open: boolean) => void,
  flagPlannedInvoiceAsLast: (id: number) => void,
  unflagPlannedInvoiceAsLast: (id: number) => void,
};

export class SubscriptionDetail extends Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.fetchSubscription();
    this.props.fetchSubscriptionEventList({
      page: 1,
      page_size: 10,
    });
  }

  componentDidMount() {
    this.props.fetchPrivatePassList();
  }

  render() {
    const {
      loading,
      subscription,
      stop,
      goToInvoice,
      goToMember,
      goToSubscribe,
    } = this.props;
    return (
      <div className={this.props.classes.container}>
        {loading ? <LinearProgress /> : null}
        <SubscriptionComponent
          eventList={this.props.eventList}
          eventLoading={this.props.eventLoading}
          eventPage={this.props.eventPage}
          fetchSubscriptionEventList={this.props.fetchSubscriptionEventList}
          goToInvoice={goToInvoice}
          goToMember={goToMember}
          goToSubscribe={goToSubscribe}
          loading={this.props.loading}
          requestFreeze={() => this.props.setFreezeDialogOpen(true)}
          requestPaymentMethodSwitch={this.props.openPaymentMethodSwitch}
          requestPaymentPackSwitch={this.props.openPackSwitcherDialog}
          requestScheduledStop={() =>
            this.props.setScheduledStopDialogOpen(true)
          }
          requestStop={() => this.props.setStopDialogOpen(true)}
          requestUpdatePrice={this.props.setPlannedInvoiceToUpdate}
          stopSubscription={stop}
          subscription={subscription}
          unflagPlannedInvoiceAsLast={this.props.unflagPlannedInvoiceAsLast}
          updateSubscriptionRenewal={this.props.updateSubscriptionRenewal}
        />
        {this.props.plannedInvoiceToUpdate ? (
          <PlannedInvoicePriceUpdater
            onCancel={() => this.props.setPlannedInvoiceToUpdate(null)}
            onSubmit={this.props.updatePlannedInvoicePrice}
            open={!!this.props.plannedInvoiceToUpdate}
            planned_invoice={this.props.plannedInvoiceToUpdate}
          />
        ) : null}
        {this.props.freezeDialogOpen ? (
          <SubscriptionFreezerDialog
            onCancel={() => this.props.setFreezeDialogOpen(false)}
            onSubmit={this.props.freezeSubscription}
            open={!!this.props.freezeDialogOpen}
            subscription={subscription}
          />
        ) : null}
        {this.props.switchPackDialogOpen ? (
          <SubscriptionPaymentPackSwitcherDialog
            onCancel={() => this.props.setSiwtchPackDialogOpen(false)}
            onSubmit={this.props.switchSubscriptionPaymentPack}
            open={!!this.props.switchPackDialogOpen}
            paymentPackList={this.props.availablePaymentPackList}
            subscription={subscription}
          />
        ) : null}
        {this.props.switchPaymentMethodDialogOpen ? (
          <SubscriptionPaymentMethodSwitcherDialog
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
            loading={this.props.memberLoading}
            onCancel={() => this.props.setSwitchPaymentMethodDialogOpen(false)}
            onSubmit={this.props.switchPaymentMethod}
            open={this.props.switchPaymentMethodDialogOpen}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
          />
        ) : null}
        {this.props.stopDialogOpen ? (
          <StopConfirmationDialog
            onCancel={() => this.props.setStopDialogOpen(false)}
            onSubmit={this.props.stop}
            open={this.props.stopDialogOpen}
          />
        ) : null}
        {this.props.scheduledStopDialogOpen ? (
          <SubscriptionScheduledStopDialog
            loading={loading}
            onCancel={() => this.props.setScheduledStopDialogOpen(false)}
            onSubmit={this.props.flagPlannedInvoiceAsLast}
            open={this.props.scheduledStopDialogOpen}
            subscription={subscription}
          />
        ) : null}
        {this.props.subscription ? (
          <div className={this.props.classes.bottomButtonContainer}>
            <Fab
              className={this.props.classes.bottomButton}
              color="primary"
              onClick={() => {
                if (this.props.subscription) {
                  this.props.goToMember(this.props.subscription.member);
                }
              }}
              variant="extended"
            >
              <PersonIcon className={this.props.classes.leftIcon} />
              {this.props.subscription
                ? this.props.subscription.memberName
                : ' - '}
            </Fab>
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: '30vh',
  },
  bottomButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  bottomButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withState('plannedInvoiceToUpdate', 'setPlannedInvoiceToUpdate', null),
  withState('freezeDialogOpen', 'setFreezeDialogOpen', false),
  withState('switchPackDialogOpen', 'setSiwtchPackDialogOpen', false),
  withState('stopDialogOpen', 'setStopDialogOpen', false),
  withState(
    'switchPaymentMethodDialogOpen',
    'setSwitchPaymentMethodDialogOpen',
    false,
  ),
  withState('scheduledStopDialogOpen', 'setScheduledStopDialogOpen', false),
  connect(
    (state, { id }) => ({
      subscription: getSubscriptionById(state, id),
      memberLoading: state.member.loading,
      loading:
        state.subscription.detail.loading ||
        state.subscription.createOrUpdate.loading,
      availablePaymentPackList: getEnabledPaymentPackList(state),
      eventList: getSubscriptionEventList(state),
      eventPage: getSubscriptionEventState(state).page,
      eventLoading: getSubscriptionEventState(state).loading,
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      fetchSubscription: fetchSubscriptionAction,
      fetchMember: fetchMemberAction,
      fetchSubscriptionEventList: fetchSubscriptionEventListAction,
      stop: stopSubscription,
      goToInvoice: (uuid: string) => pushRouter(`/invoice/${uuid}`),
      goToMember: (id: number) => pushRouter(`/member/${id}/`),
      goToSubscribe: (id: number) => pushRouter(`/subscription/add/${id}`),
      updatePlannedInvoicePrice: updatePlannedInvoicePriceAction,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      updateSubscriptionRenewal: updateSubscriptionRenewalAction,
      freezeSubscription: freezeSubscriptionAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      switchSubscriptionPaymentPack: switchSubscriptionPaymentPackAction,
      fetchPaymentPackList: () =>
        fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
      fetchPrivatePassList,
      switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
      flagPlannedInvoiceAsLast: flagPlannedInvoiceAsLastAction,
      unflagPlannedInvoiceAsLast: unflagPlannedInvoiceAsLastAction,
    },
  ),
  withHandlers({
    requestSetupIntentSecret:
      ({ subscription }) =>
      () =>
        requestSetupIntentSecretAPI(subscription.member),
    fetchPaymentMethodList:
      ({ subscription, fetchPaymentMethodList }) =>
      () =>
        fetchPaymentMethodList({ member: subscription.member }),
    fetchSubscriptionEventList:
      ({ fetchSubscriptionEventList, id }) =>
      (params = {}) =>
        fetchSubscriptionEventList({ ...params, object_id: id }),
    openPaymentMethodSwitch:
      ({ setSwitchPaymentMethodDialogOpen }) =>
      () => {
        setSwitchPaymentMethodDialogOpen(true);
      },
    switchPaymentMethod:
      ({
        id,
        switchSubscriptionPaymentMethod,
        setSwitchPaymentMethodDialogOpen,
      }) =>
      (source, options, payment_method_id) => {
        switchSubscriptionPaymentMethod(
          {
            id,
            source,
            payment_method_id,
            payment_method_identifier: BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
          },
          {
            onSuccess: (sub) => {
              if (options && options.onSuccess) options.onSuccess(sub);
              setSwitchPaymentMethodDialogOpen(false);
            },
            onError: options ? options.onError : null,
          },
        );
      },
    fetchSubscription:
      ({ fetchSubscription, fetchPaymentPackBulk, fetchMember, id }) =>
      () => {
        fetchSubscription(id, {
          onSuccess: (sub) => {
            fetchPaymentPackBulk([sub.payment_pack]);
            fetchMember(sub.member);
          },
        });
      },
    openPackSwitcherDialog:
      ({ setSiwtchPackDialogOpen, fetchPaymentPackList }) =>
      () => {
        setSiwtchPackDialogOpen(true);
        fetchPaymentPackList();
      },
    switchSubscriptionPaymentPack:
      ({
        id,
        switchSubscriptionPaymentPack,
        fetchPaymentPackBulk,
        setSiwtchPackDialogOpen,
      }) =>
      (data, options) => {
        switchSubscriptionPaymentPack(id, data, {
          onSuccess: (sub) => {
            setSiwtchPackDialogOpen(false);
            if (options && options.onSucess) options.onSuccess(sub);
            fetchPaymentPackBulk([sub.payment_pack]);
          },
          onError: (err) => {
            if (options && options.onError) options.onError(err);
          },
        });
      },
    freezeSubscription:
      ({ id, freezeSubscription, setFreezeDialogOpen }) =>
      (data, options) => {
        const options_ = {
          onSuccess: (...args) => {
            if (options && options.onSuccess) options.onSuccess(...args);
            setFreezeDialogOpen(false);
          },
          onError: (err) => {
            if (options && options.onError) options.onError(err);
          },
        };

        freezeSubscription(id, data, options_);
      },
    updateSubscriptionRenewal:
      ({ id, updateSubscriptionRenewal }) =>
      (data, options) => {
        updateSubscriptionRenewal(id, data, options);
      },
  }),
  withHandlers({
    stop:
      ({ stop, setStopDialogOpen, id, fetchSubscription }) =>
      (params, options) => {
        stop(id, params, {
          onSuccess: (...args) => {
            if (options && options.onSuccess) options.onSuccess(...args);
            setStopDialogOpen(false);
            fetchSubscription();
          },
          onError: (err) => {
            if (options && options.onError) options.onError(err);
          },
        });
      },
    flagPlannedInvoiceAsLast:
      ({ flagPlannedInvoiceAsLast, fetchSubscription }) =>
      (id) => {
        flagPlannedInvoiceAsLast(id, '', {
          onSuccess: () => fetchSubscription(),
        });
      },
    unflagPlannedInvoiceAsLast:
      ({ unflagPlannedInvoiceAsLast, fetchSubscription }) =>
      (id) => {
        unflagPlannedInvoiceAsLast(id, {
          onSuccess: () => fetchSubscription(),
        });
      },
    updatePlannedInvoicePrice:
      ({
        updatePlannedInvoicePrice,
        id,
        setPlannedInvoiceToUpdate,
        fetchSubscription,
      }) =>
      (data, options) => {
        updatePlannedInvoicePrice(id, data, {
          onSuccess: (...args) => {
            options.onSuccess(...args);
            setPlannedInvoiceToUpdate(null);
            fetchSubscription();
          },
          onError: options.onError,
        });
      },
  }),
  withTitle(({ subscription }) => (subscription ? subscription.name : '')),
)(SubscriptionDetail);
