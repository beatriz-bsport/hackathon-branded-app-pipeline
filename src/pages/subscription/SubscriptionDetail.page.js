// @flow

import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';

import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import Fab from '@material-ui/core/Fab';
import PersonIcon from '@material-ui/icons/Person';
import withStyles from '@material-ui/core/styles/withStyles';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import {
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchAllPaymentPacks as fetchAllPaymentPacksAction,
} from '../../libs/payment-packs/actions';
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
} from '../../libs/subscription/actions';
import { fetchMember as fetchMemberAction } from '../../libs/member/actions';
import {
  get as getSubscriptionById,
  getSubscriptionEventList,
  getSubscriptionEventState,
} from '../../libs/subscription/selectors';
import SubscriptionComponent from '../../libs/subscription/components/Subscription.component';
import SubscriptionFreezerDialog from '../../libs/subscription/components/SubscriptionFreezerDialog.component';
import PlannedInvoicePriceUpdater from '../../libs/subscription/components/PlannedInvoicePriceUpdater.component';
import SubscriptionPaymentPackSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentPackSwitcherDialog.component';
import SubscriptionPaymentMethodSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentMethodSwitcherDialog.component';
import StopConfirmationDialog from '../../libs/subscription/components/StopConfirmationDialog.component';

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
  setPlannedInvoiceToUpdate: (?PlannedInvoice) => void,

  setFreezeDialogOpen: (boolean) => void,
  freezeDialogOpen: boolean,
  freezeSubscription: ({ days: number }) => void,

  setSwitchPaymentMethodDialogOpen: (boolean) => void,
  switchPaymentMethodDialogOpen: boolean,
  switchPaymentMethod: (source: string) => void,
  openPaymentMethodSwitch: () => void,

  switchPackDialogOpen: boolean,
  setSiwtchPackDialogOpen: (boolean) => void,
  switchSubscriptionPaymentPack: (payment_pack: number) => void,
  availablePaymentPackList: Array<PaymentPack>,

  stop: (id: number) => void,
  setStopDialogOpen: (boolean) => void,
  stopDialogOpen: boolean,

  eventList: Array<SubscriptionEvent>,
  eventPage: number,
  eventLoading: boolean,
  fetchSubscriptionEventList: ({
    page: number,
    page_size: number,
    billing_plan: number,
  }) => void,

  member: ?Member,
  memberLoading: boolean,

  openPackSwitcherDialog: () => void,

  updateSubscriptionRenewal: ({ auto_renewal: boolean }) => void,
  updatePlannedInvoicePrice: (
    id: number,
    data: {
      planned_invoice: number,
      price: string,
    },
    options: OptionCallback,
  ) => void,
};

export class SubscriptionDetail extends Component<Props> {
  componentWillMount() {
    this.props.fetchSubscription();
    this.props.fetchSubscriptionEventList({
      page: 1,
      page_size: 10,
    });
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
          subscription={subscription}
          stopSubscription={stop}
          goToInvoice={goToInvoice}
          goToMember={goToMember}
          goToSubscribe={goToSubscribe}
          updateSubscriptionRenewal={this.props.updateSubscriptionRenewal}
          loading={this.props.loading}
          eventList={this.props.eventList}
          eventPage={this.props.eventPage}
          eventLoading={this.props.eventLoading}
          fetchSubscriptionEventList={this.props.fetchSubscriptionEventList}
          requestPaymentMethodSwitch={this.props.openPaymentMethodSwitch}
          requestUpdatePrice={this.props.setPlannedInvoiceToUpdate}
          requestPaymentPackSwitch={this.props.openPackSwitcherDialog}
          requestStop={() => this.props.setStopDialogOpen(true)}
          requestFreeze={() => this.props.setFreezeDialogOpen(true)}
        />
        {this.props.plannedInvoiceToUpdate ? (
          <PlannedInvoicePriceUpdater
            open={!!this.props.plannedInvoiceToUpdate}
            planned_invoice={this.props.plannedInvoiceToUpdate}
            onCancel={() => this.props.setPlannedInvoiceToUpdate(null)}
            onSubmit={this.props.updatePlannedInvoicePrice}
          />
        ) : null}
        {this.props.freezeDialogOpen ? (
          <SubscriptionFreezerDialog
            open={!!this.props.freezeDialogOpen}
            subscription={subscription}
            onCancel={() => this.props.setFreezeDialogOpen(false)}
            onSubmit={this.props.freezeSubscription}
          />
        ) : null}
        {this.props.switchPackDialogOpen ? (
          <SubscriptionPaymentPackSwitcherDialog
            open={!!this.props.switchPackDialogOpen}
            subscription={subscription}
            paymentPackList={this.props.availablePaymentPackList}
            onCancel={() => this.props.setSiwtchPackDialogOpen(false)}
            onSubmit={this.props.switchSubscriptionPaymentPack}
          />
        ) : null}
        {this.props.switchPaymentMethodDialogOpen ? (
          <SubscriptionPaymentMethodSwitcherDialog
            open={this.props.switchPaymentMethodDialogOpen}
            member={this.props.member}
            loading={this.props.memberLoading}
            onSubmit={this.props.switchPaymentMethod}
            onCancel={() => this.props.setSwitchPaymentMethodDialogOpen(false)}
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
          />
        ) : null}
        {this.props.stopDialogOpen ? (
          <StopConfirmationDialog
            open={this.props.stopDialogOpen}
            onSubmit={this.props.stop}
            onCancel={() => this.props.setStopDialogOpen(false)}
          />
        ) : null}
        {this.props.subscription ? (
          <div className={this.props.classes.bottomButtonContainer}>
            <Fab
              color="primary"
              variant="extended"
              className={this.props.classes.bottomButton}
              onClick={() => {
                if (this.props.subscription) {
                  this.props.goToMember(this.props.subscription.member);
                }
              }}
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
  routerParamsToProps({ id: 'id:number' }),
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
  connect(
    (state, { id }) => ({
      subscription: getSubscriptionById(state, id),
      member: state.member.member,
      memberLoading: state.member.loading,
      loading:
        state.subscription.detail.loading ||
        state.subscription.createOrUpdate.loading,
      availablePaymentPackList: getEnabledPaymentPackList(state),
      eventList: getSubscriptionEventList(state),
      eventPage: getSubscriptionEventState(state).page,
      eventLoading: getSubscriptionEventState(state).loading,
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
      updateSubscriptionRenewal: updateSubscriptionRenewalAction,
      freezeSubscription: freezeSubscriptionAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      switchSubscriptionPaymentPack: switchSubscriptionPaymentPackAction,
      fetchAllPaymentPacks: fetchAllPaymentPacksAction,
      switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
    },
  ),
  withHandlers({
    fetchSubscriptionEventList: ({ fetchSubscriptionEventList, id }) => (
      params = {},
    ) => fetchSubscriptionEventList({ ...params, object_id: id }),
    openPaymentMethodSwitch: ({ setSwitchPaymentMethodDialogOpen }) => () => {
      setSwitchPaymentMethodDialogOpen(true);
    },
    switchPaymentMethod: ({
      id,
      switchSubscriptionPaymentMethod,
      setSwitchPaymentMethodDialogOpen,
    }) => (source, options) => {
      switchSubscriptionPaymentMethod(
        id,
        {
          source,
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
    fetchSubscription: ({
      fetchSubscription,
      fetchPaymentPackBulk,
      fetchMember,
      id,
    }) => () => {
      fetchSubscription(id, {
        onSuccess: (sub) => {
          fetchPaymentPackBulk([sub.payment_pack]);
          fetchMember(sub.member);
        },
      });
    },
    openPackSwitcherDialog: ({
      setSiwtchPackDialogOpen,
      fetchAllPaymentPacks,
    }) => () => {
      setSiwtchPackDialogOpen(true);
      fetchAllPaymentPacks();
    },
    switchSubscriptionPaymentPack: ({
      id,
      switchSubscriptionPaymentPack,
      fetchPaymentPackBulk,
      setSiwtchPackDialogOpen,
    }) => (data, options) => {
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
    freezeSubscription: ({ id, freezeSubscription, setFreezeDialogOpen }) => (
      data,
      options,
    ) => {
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
    updateSubscriptionRenewal: ({ id, updateSubscriptionRenewal }) => (
      data,
      options,
    ) => {
      updateSubscriptionRenewal(id, data, options);
    },
  }),
  withHandlers({
    stop: ({ stop, setStopDialogOpen, id, fetchSubscription }) => (
      params,
      options,
    ) => {
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
    updatePlannedInvoicePrice: ({
      updatePlannedInvoicePrice,
      id,
      setPlannedInvoiceToUpdate,
      fetchSubscription,
    }) => (data, options) => {
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
