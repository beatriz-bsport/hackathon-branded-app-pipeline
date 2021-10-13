import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import type { Theme } from '@material-ui/core';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import { PAYMENT_ENGINE_STRIPE } from '@bsport/common/lib/master-data/payment-group';
import Fab from '@material-ui/core/Fab';
import PersonIcon from '@material-ui/icons/Person';
import withStyles from '@material-ui/core/styles/withStyles';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withTitle from '../../hocs/with-title.hoc';
import {
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchAllPaymentPacks as fetchAllPaymentPacksAction,
} from '../../libs/payment-packs/actions';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getEnabled as getEnabledPaymentPackList } from '../../libs/payment-packs/selectors';

import {
  fetch as fetchSubscriptionAction,
  cancelPause as cancelPauseAction,
  updatePlannedInvoicePrice as updatePlannedInvoicePriceAction,
  updateSubscriptionRenewal as updateSubscriptionRenewalAction,
  updatePlannedInvoiceDate as updatePlannedInvoiceDateAction,
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
import SubscriptionComponent from '../../libs/subscription/components/Subscription.component';
import SubscriptionPaymentPackSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentPackSwitcherDialog.component';
import SubscriptionPaymentMethodSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentMethodSwitcherDialog.component';
import SubscriptionScheduledStopDialog from '../../libs/subscription/components/SubscriptionScheduledStopDialog.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';

import { Subscription } from '../../libs/subscription/types';
import { OptionCallback } from '../../state/types';
import { PaymentPack } from '../../libs/payment-packs/types';
import { PaymentMethod } from '../../libs/payment/types';
import { MaterialStyleType } from '../../utils/types';
import { RootState } from '../../reducers';
import { Member } from '../../libs/member/types';

type Props = {
  loading: boolean;

  subscription?: Subscription;

  fetchSubscription: () => void;
  goToInvoice: (uuid: string) => void;
  goToMember: (id: number) => void;
  goToSubscribe: (id: number) => void;

  setFreezeDialogOpen: (open: boolean) => void;
  freezeDialogOpen: boolean;
  freezeSubscription: ({ days }: { days: number }) => void;

  setSwitchPaymentMethodDialogOpen: (open: boolean) => void;
  switchPaymentMethodDialogOpen: boolean;
  switchPaymentMethod: (source: string) => void;
  openPaymentMethodSwitch: () => void;

  switchPackDialogOpen: boolean;
  setSiwtchPackDialogOpen: (open: boolean) => void;
  switchSubscriptionPaymentPack: (payment_pack: number) => void;
  availablePaymentPackList: Array<PaymentPack>;

  setStopDialogOpen: (open: boolean) => void;
  stopDialogOpen: boolean;

  eventList: Array<any>;
  eventPage: number;
  eventLoading: boolean;
  fetchSubscriptionEventList: ({
    page,
    page_size,
    billing_plan,
  }: {
    page: number;
    page_size: number;
    billing_plan?: number;
  }) => void;

  memberLoading: boolean;

  openPackSwitcherDialog: () => void;

  updateSubscriptionRenewal: ({
    auto_renewal,
  }: {
    auto_renewal: boolean;
  }) => void;
  updatePlannedInvoicePrice: (
    id: number,
    data: {
      planned_invoice: number;
      price: string;
    },
    options: OptionCallback,
  ) => void;
  fetchPrivatePassList: () => void;

  requestSetupIntentSecret: () => void;
  fetchPaymentMethodList: () => void;
  savedPaymentMethodList: Array<PaymentMethod>;
  scheduledStopDialogOpen: boolean;
  setScheduledStopDialogOpen: (open: boolean) => void;
  flagPlannedInvoiceAsLast: (id: number) => void;
  unflagPlannedInvoiceAsLast: (id: number) => void;
  memberById: { [key: number]: Member };
  cancelPause: (pauseId: number, options: OptionCallback<Subscription>) => void;
} & MaterialStyleType<ReturnType<typeof styles>>;

export class SubscriptionDetail extends Component<Props> {
  componentWillMount() {
    this.props.fetchSubscription();
    this.props.fetchSubscriptionEventList({
      page: 1,
      page_size: 10,
    });
  }

  componentDidMount() {
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentMethodList();
  }

  render() {
    const {
      loading,
      subscription,
      goToInvoice,
      goToMember,
      goToSubscribe,
    } = this.props;

    return (
      <div className={this.props.classes.container}>
        {loading ? <LinearProgress /> : null}
        <SubscriptionComponent
          subscription={subscription}
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
          paymentMethod={this.props.savedPaymentMethodList.find(
            (pm) => pm.id === subscription.stripe_payment_method_id,
          )}
          requestPaymentPackSwitch={this.props.openPackSwitcherDialog}
          requestStop={() => this.props.setStopDialogOpen(true)}
          requestPause={this.props.freezeSubscription}
          updateDate={this.props.updatePlannedInvoiceDate}
          requestUpdatePrice={this.props.updatePlannedInvoicePrice}
          cancelPause={this.props.cancelPause}
          requestScheduledStop={(plannedInvoiceId) => {
            if (plannedInvoiceId) {
              this.props.flagPlannedInvoiceAsLast(plannedInvoiceId);
            } else {
              this.props.setScheduledStopDialogOpen(true);
            }
          }}
          requestFreeze={() => this.props.setFreezeDialogOpen(true)}
          unflagPlannedInvoiceAsLast={this.props.unflagPlannedInvoiceAsLast}
        />
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
            loading={this.props.memberLoading}
            onSubmit={this.props.switchPaymentMethod}
            onCancel={() => this.props.setSwitchPaymentMethodDialogOpen(false)}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
            member={this.props.memberById[this.props.subscription.member]}
          />
        ) : null}
        {this.props.scheduledStopDialogOpen ? (
          <SubscriptionScheduledStopDialog
            subscription={subscription}
            open={this.props.scheduledStopDialogOpen}
            onCancel={() => this.props.setScheduledStopDialogOpen(false)}
            loading={loading}
            onSubmit={this.props.flagPlannedInvoiceAsLast}
          />
        ) : null}
        {!!this.props.subscription && (
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
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
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
    (state: RootState, { id }: { id: number }) => ({
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
      memberById: state.member.detailData,
    }),
    {
      cancelPause: cancelPauseAction,
      fetchSubscription: fetchSubscriptionAction,
      fetchMember: fetchMemberAction,
      fetchSubscriptionEventList: fetchSubscriptionEventListAction,
      updatePlannedInvoiceDate: updatePlannedInvoiceDateAction,
      goToInvoice: (uuid: string) => pushRouter(`/invoice/${uuid}`),
      goToMember: (id: number) => pushRouter(`/member/${id}/`),
      goToSubscribe: (id: number) => pushRouter(`/subscription/add/${id}`),
      updatePlannedInvoicePrice: updatePlannedInvoicePriceAction,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      updateSubscriptionRenewal: updateSubscriptionRenewalAction,
      freezeSubscription: freezeSubscriptionAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      switchSubscriptionPaymentPack: switchSubscriptionPaymentPackAction,
      fetchAllPaymentPacks: fetchAllPaymentPacksAction,
      fetchPrivatePassList,
      switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
      flagPlannedInvoiceAsLast: flagPlannedInvoiceAsLastAction,
      unflagPlannedInvoiceAsLast: unflagPlannedInvoiceAsLastAction,
    },
  ),
  withHandlers({
    requestSetupIntentSecret: ({ subscription }) => () =>
      requestSetupIntentSecretAPI(subscription.member),
    fetchPaymentMethodList: ({ subscription, fetchPaymentMethodList }) => () =>
      fetchPaymentMethodList({ member: subscription.member }),
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
    }) => (
      source,
      options: OptionCallback<Subscription>,
      payment_method_id: number,
    ) => {
      switchSubscriptionPaymentMethod(
        id,
        {
          is_v2: true,
          payment_method_id,
          payment_engine: PAYMENT_ENGINE_STRIPE,
        },
        {
          onSuccess: (sub: Subscription) => {
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
        onSuccess: (sub: Subscription) => {
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
    }) => (data, options: OptionCallback<Subscription>) => {
      switchSubscriptionPaymentPack(id, data, {
        onSuccess: (sub: Subscription) => {
          setSiwtchPackDialogOpen(false);
          if (options && options.onSuccess) options.onSuccess(sub);
          fetchPaymentPackBulk([sub.payment_pack]);
        },
        onError: (err) => {
          if (options && options.onError) options.onError(err);
        },
      });
    },
    freezeSubscription: ({ id, freezeSubscription, setFreezeDialogOpen }) => (
      data,
      options: OptionCallback<Subscription>,
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
      options: OptionCallback<Subscription>,
    ) => {
      updateSubscriptionRenewal(id, data, options);
    },
  }),
  withHandlers({
    cancelPause: ({ cancelPause, fetchSubscription, id }) => (
      pauseId: number,
      options: OptionCallback<Subscription>,
    ) => {
      cancelPause(id, pauseId, {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          fetchSubscription();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
    updatePlannedInvoiceDate: ({
      updatePlannedInvoiceDate,
      fetchSubscription,
      id,
    }) => (data, options: OptionCallback<Subscription>) => {
      updatePlannedInvoiceDate(id, data, {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          fetchSubscription();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
    flagPlannedInvoiceAsLast: ({
      flagPlannedInvoiceAsLast,
      fetchSubscription,
    }) => (id: number) => {
      flagPlannedInvoiceAsLast(id, { onSuccess: () => fetchSubscription() });
    },
    unflagPlannedInvoiceAsLast: ({
      unflagPlannedInvoiceAsLast,
      fetchSubscription,
    }) => (id: number) => {
      unflagPlannedInvoiceAsLast(id, { onSuccess: () => fetchSubscription() });
    },
    updatePlannedInvoicePrice: ({
      updatePlannedInvoicePrice,
      id,
      fetchSubscription,
    }) => (data, options: OptionCallback<Subscription>) => {
      updatePlannedInvoicePrice(id, data, {
        onSuccess: (...args) => {
          if (options && options.onSuccess) {
            options.onSuccess(...args);
          }
          fetchSubscription();
        },
        onError: options.onError,
      });
    },
  }),
  withTitle(({ subscription }) => (subscription ? subscription.name : '')),
)(SubscriptionDetail);
