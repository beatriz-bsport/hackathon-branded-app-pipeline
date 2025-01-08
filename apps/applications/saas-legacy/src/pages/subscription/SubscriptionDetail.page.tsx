import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { createStyles, Theme } from '@material-ui/core';
import { PAYMENT_ENGINE_STRIPE } from '@bsport/common/master-data/payment-group.js';
import Fab from '@material-ui/core/Fab';
import PersonIcon from '@material-ui/icons/Person';
import withStyles from '@material-ui/core/styles/withStyles';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';
import {
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchPaymentPackList as fetchPaymentPackListAction,
} from '#src/libs/payment-packs/actions';

import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivatePassList as fetchPrivatePassListAction,
} from '#src/libs/private-service/actions';
import {
  fetchPaymentComboList as fetchPaymentComboListAction,
  fetchPaymentCombo as fetchPaymentComboAction,
} from '#src/libs/payment-combo/actions';
import { getPrivatePassAvailable } from '#src/libs/private-service/selectors/private-pass';
import { getEnabled as getEnabledPaymentPackList } from '#src/libs/payment-packs/selectors';
import { getAvailablePaymentComboList } from '#src/libs/payment-combo/selectors';
import {
  fetch as fetchSubscriptionAction,
  cancelPause as cancelPauseAction,
  updatePlannedInvoicePrice as updatePlannedInvoicePriceAction,
  updateSubscriptionRenewal as updateSubscriptionRenewalAction,
  updatePlannedInvoiceDate as updatePlannedInvoiceDateAction,
  freezeSubscription as freezeSubscriptionAction,
  switchSubscriptionPaymentPack as switchSubscriptionPaymentPackAction,
  switchSubscriptionPrivatePass as switchSubscriptionPrivatePassAction,
  switchSubscriptionPaymentCombo as switchSubscriptionPaymentComboAction,
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction,
  fetchSubscriptionEventList as fetchSubscriptionEventListAction,
  flagPlannedInvoiceAsLast as flagPlannedInvoiceAsLastAction,
  unflagPlannedInvoiceAsLast as unflagPlannedInvoiceAsLastAction,
  downloadPDFContractTermsForBillingPlan as downloadPDFContractTermsForBillingPlanAction,
} from '#src/libs/subscription/actions';
import { fetchMember as fetchMemberAction } from '#src/libs/member/actions';
import {
  get as getSubscriptionById,
  getSubscriptionEventList,
  getSubscriptionEventState,
} from '#src/libs/subscription/selectors';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import SubscriptionComponent from '#src/libs/subscription/components/Subscription.component';
import SubscriptionPaymentComboSwitcherDialog from '#src/libs/subscription/components/SubscriptionPaymentComboSwitcherDialog.component';
// @ts-expect-error
import SubscriptionPaymentMethodSwitcherDialog from '#src/libs/subscription/components/SubscriptionPaymentMethodSwitcherDialog.component';
import SubscriptionPaymentPackSwitcherDialog from '#src/libs/subscription/components/SubscriptionPaymentPackSwitcherDialog.component';
import SubscriptionPrivatePassSwitcherDialog from '#src/libs/subscription/components/SubscriptionPrivatePassSwitcherDialog.component';
// @ts-expect-error
import SubscriptionScheduledStopDialog from '#src/libs/subscription/components/SubscriptionScheduledStopDialog.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '#src/libs/payment/actions';
import { getSavedPaymentMethodList } from '#src/libs/payment/selectors';
import { fetchStripeReaders } from '#src/libs/terminal/actions';
import { getStripeReaders } from '#src/libs/terminal/selectors';

import type {
  Subscription,
  PauseRequestData,
  PauseRequestResults,
  PauseRequestErrorResults,
} from '#src/libs/subscription/types';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';
import type {
  OptionCallback,
  OptionBackgroundCallback,
} from '#src/state/types';
import type { MaterialStyleType, WithHandlerType } from '../../utils/types';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import themeSelectors, {
  getStripeRegion,
  getCompanyCountry,
} from '../../libs/theme/selectors';
import { RootState } from '../../reducers';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';

type BeforeHandlerProps = RouterProps &
  typeof stateHandlerInit &
  WithHandlerType<typeof stateHandlerSetter> &
  ConnectedProps<typeof connector>;
type RouterProps = { id: number };
type Props = BeforeHandlerProps &
  WithHandlerType<typeof mapWithHandlers1> &
  WithHandlerType<typeof mapWithHandlers2> &
  MaterialStyleType<ReturnType<typeof styles>>;

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
    this.props.fetchPaymentComboList();
    this.props.fetchPaymentMethodList();
    this.props.fetchStripeReaders();
  }

  render() {
    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    const { loading, subscription, goToInvoice, goToMember, goToSubscribe } =
      this.props;
    return (
      <div className={this.props.classes.container}>
        {loading ? <LinearProgress /> : null}
        <SubscriptionComponent
          cancelPause={this.props.cancelPause}
          downloadContractTerms={this.props.downloadContractTerms}
          // @ts-expect-error
          eventList={this.props.eventList}
          eventLoading={this.props.eventLoading}
          eventPage={this.props.eventPage}
          fetchSubscriptionEventList={this.props.fetchSubscriptionEventList}
          goToInvoice={goToInvoice}
          goToMember={goToMember}
          goToSubscribe={goToSubscribe}
          loading={this.props.loading}
          paymentMethod={this.props.savedPaymentMethodList.find(
            // @ts-expect-error
            (pm) => pm.id === subscription.stripe_payment_method_id,
          )}
          paymentMethodLoading={this.props.paymentMethodLoading}
          plannedInvoiceUpdateLoading={this.props.plannedInvoiceUpdateLoading}
          requestPause={this.props.freezeSubscription}
          requestPaymentComboSwitch={this.props.openPaymentComboSwitcherDialog}
          requestPaymentMethodSwitch={this.props.openPaymentMethodSwitch}
          requestPaymentPackSwitch={this.props.openPackSwitcherDialog}
          requestPrivatePassSwitch={this.props.openPrivatePassSwitcherDialog}
          requestScheduledStop={(
            plannedInvoiceId?: number,
            stopNote?: string,
          ) => {
            if (plannedInvoiceId) {
              this.props.flagPlannedInvoiceAsLast(plannedInvoiceId, stopNote);
            } else {
              this.props.setScheduledStopDialogOpen(true);
            }
          }}
          requestStop={() => this.props.setStopDialogOpen(true)}
          requestUpdatePrice={this.props.updatePlannedInvoicePrice}
          subscription={subscription}
          unflagPlannedInvoiceAsLast={this.props.unflagPlannedInvoiceAsLast}
          // @ts-expect-error
          updateDate={this.props.updatePlannedInvoiceDate}
          // @ts-expect-error
          updateSubscriptionRenewal={this.props.updateSubscriptionRenewal}
        />
        {this.props.switchPackDialogOpen ? (
          <SubscriptionPaymentPackSwitcherDialog
            // @ts-expect-error
            loading={this.props.switchSubscriptionItemLoading}
            onCancel={() => this.props.setSwitchPackDialogOpen(false)}
            onSubmit={this.props.switchSubscriptionPaymentPack}
            open={!!this.props.switchPackDialogOpen}
            paymentPackList={this.props.availablePaymentPackList}
            subscription={subscription}
          />
        ) : null}
        {this.props.switchPrivatePassDialogOpen ? (
          <SubscriptionPrivatePassSwitcherDialog
            loading={this.props.switchSubscriptionItemLoading}
            onCancel={() => this.props.setSwitchPrivatePassDialogOpen(false)}
            // @ts-expect-error
            onSubmit={this.props.switchSubscriptionPrivatePass}
            open={!!this.props.switchPrivatePassDialogOpen}
            privatePassList={this.props.availablePrivatePassList}
            subscription={subscription}
          />
        ) : null}
        {this.props.switchPaymentComboDialogOpen ? (
          <SubscriptionPaymentComboSwitcherDialog
            loading={this.props.switchSubscriptionItemLoading}
            onCancel={() => this.props.setSwitchPaymentComboDialogOpen(false)}
            // @ts-expect-error
            onSubmit={this.props.switchSubscriptionPaymentCombo}
            open={!!this.props.switchPaymentComboDialogOpen}
            paymentComboList={this.props.availablePaymentComboList}
            subscription={subscription}
          />
        ) : null}

        {this.props.switchPaymentMethodDialogOpen &&
        !!stripeRegion &&
        !!companyCountry ? (
          <SubscriptionPaymentMethodSwitcherDialog
            cardBillingDetailsMandatory={
              this.props.theme.force_billing_details_on_cards
            }
            companyId={this.props.companyId}
            enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
              {
                currency: this.props.theme.currency,
                companyCountry,
                withCredit: true,
                withTerminal: true,
                stripeRegion,
              },
            )}
            loading={this.props.memberLoading}
            member={this.props.memberById[this.props.subscription.member]}
            onCancel={() => this.props.setSwitchPaymentMethodDialogOpen(false)}
            onSubmit={this.props.switchPaymentMethod}
            open={this.props.switchPaymentMethodDialogOpen}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            stripeReaders={this.props.stripeReaders || []}
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
        <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
          {(hasMemberProfileAccessPermission: boolean) =>
            hasMemberProfileAccessPermission &&
            !!this.props.subscription && (
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
            )
          }
        </ObjectLevelPermissionProvider>
      </div>
    );
  }
}
const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    // @ts-expect-error
    subscription: getSubscriptionById(state, id),
    companyId: state.theme.theme.company,
    memberLoading: state.member.loading,
    loading:
      state.subscription.detail.loading ||
      state.subscription.createOrUpdate.loading,
    switchSubscriptionItemLoading:
      state.subscription.switchSubscriptionItem.loading,
    availablePaymentPackList: getEnabledPaymentPackList(state),
    availablePrivatePassList: getPrivatePassAvailable(state),
    availablePaymentComboList: getAvailablePaymentComboList(state),
    eventList: getSubscriptionEventList(state),
    // @ts-expect-error
    eventPage: getSubscriptionEventState(state).page,
    // @ts-expect-error
    eventLoading: getSubscriptionEventState(state).loading,
    savedPaymentMethodList: getSavedPaymentMethodList(state),
    memberById: state.member.detailData,
    paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
    theme: themeSelectors.getTheme(state),
    plannedInvoiceUpdateLoading:
      // @ts-expect-error
      state.subscription.plannedInvoice.createOrUpdate.loading,
    stripeReaders: getStripeReaders(state),
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
    switchSubscriptionPrivatePass: switchSubscriptionPrivatePassAction,
    switchSubscriptionPaymentCombo: switchSubscriptionPaymentComboAction,
    fetchPaymentPackList: fetchPaymentPackListAction,
    fetchPrivatePassList: fetchPrivatePassListAction,
    fetchPrivatePassBulk: fetchPrivatePassBulkAction,
    fetchPaymentComboList: fetchPaymentComboListAction,
    fetchPaymentCombo: fetchPaymentComboAction,
    switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
    flagPlannedInvoiceAsLast: flagPlannedInvoiceAsLastAction,
    unflagPlannedInvoiceAsLast: unflagPlannedInvoiceAsLastAction,
    fetchStripeReaders,
    downloadPDFContractTermsForBillingPlan:
      downloadPDFContractTermsForBillingPlanAction,
  },
);

const mapWithHandlers1 = {
  requestSetupIntentSecret:
    ({ subscription }: BeforeHandlerProps) =>
    () =>
      requestSetupIntentSecretAPI(subscription.member),
  fetchPaymentMethodList:
    ({ subscription, fetchPaymentMethodList }: BeforeHandlerProps) =>
    () =>
      fetchPaymentMethodList({ member: subscription.member }),
  fetchSubscriptionEventList:
    ({ fetchSubscriptionEventList, id }: BeforeHandlerProps) =>
    (params = {}) =>
      // @ts-expect-error
      fetchSubscriptionEventList({ ...params, object_id: id }),
  openPaymentMethodSwitch:
    ({ setSwitchPaymentMethodDialogOpen }: BeforeHandlerProps) =>
    () => {
      setSwitchPaymentMethodDialogOpen(true);
    },
  switchPaymentMethod:
    ({
      id,
      switchSubscriptionPaymentMethod,
      setSwitchPaymentMethodDialogOpen,
    }: BeforeHandlerProps) =>
    (
      source: any,
      options: OptionCallback<Subscription>,
      payment_method_id: number,
    ) => {
      switchSubscriptionPaymentMethod(
        {
          id,
          // @ts-expect-error
          is_v2: true,
          payment_method_id: payment_method_id?.toString(),
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
  fetchSubscription:
    ({
      fetchSubscription,
      fetchPaymentPackBulk,
      fetchMember,
      id,
    }: BeforeHandlerProps) =>
    () => {
      fetchSubscription(id, {
        // @ts-expect-error
        onSuccess: (sub: Subscription) => {
          fetchPaymentPackBulk([sub.payment_pack]);
          fetchMember(sub.member);
        },
      });
    },
  openPackSwitcherDialog:
    ({ setSwitchPackDialogOpen, fetchPaymentPackList }: BeforeHandlerProps) =>
    () => {
      setSwitchPackDialogOpen(true);
      fetchPaymentPackList({ disabled: false, page_size: 70000 });
    },
  openPrivatePassSwitcherDialog:
    ({
      setSwitchPrivatePassDialogOpen,
      fetchPrivatePassList,
    }: BeforeHandlerProps) =>
    () => {
      setSwitchPrivatePassDialogOpen(true);
      fetchPrivatePassList();
    },
  openPaymentComboSwitcherDialog:
    ({
      setSwitchPaymentComboDialogOpen,
      fetchPaymentComboList,
    }: BeforeHandlerProps) =>
    () => {
      setSwitchPaymentComboDialogOpen(true);
      fetchPaymentComboList();
    },
  switchSubscriptionPaymentPack:
    ({
      id,
      switchSubscriptionPaymentPack,
      fetchPaymentPackBulk,
      setSwitchPackDialogOpen,
    }: BeforeHandlerProps) =>
    (data: { payment_pack: number }, options: OptionCallback<Subscription>) => {
      switchSubscriptionPaymentPack(id, data, {
        // @ts-expect-error
        onSuccess: (sub: Subscription) => {
          setSwitchPackDialogOpen(false);
          if (options && options.onSuccess) options.onSuccess(sub);
          fetchPaymentPackBulk([sub.payment_pack]);
        },
        onError: (err) => {
          if (options && options.onError) options.onError(err);
        },
      });
    },
  switchSubscriptionPrivatePass:
    ({
      id,
      switchSubscriptionPrivatePass,
      fetchPrivatePassBulk,
      setSwitchPrivatePassDialogOpen,
    }: BeforeHandlerProps) =>
    (data: { private_pass: number }, options: OptionCallback<Subscription>) => {
      switchSubscriptionPrivatePass(id, data, {
        // @ts-expect-error
        onSuccess: (sub: Subscription) => {
          setSwitchPrivatePassDialogOpen(false);
          if (options && options.onSuccess) options.onSuccess(sub);
          fetchPrivatePassBulk([sub.private_pass]);
        },
        onError: (err) => {
          if (options && options.onError) options.onError(err);
        },
      });
    },
  switchSubscriptionPaymentCombo:
    ({
      id,
      switchSubscriptionPaymentCombo,
      fetchPaymentCombo,
      setSwitchPaymentComboDialogOpen,
    }: BeforeHandlerProps) =>
    (
      data: { payment_combo: number },
      options: OptionCallback<Subscription>,
    ) => {
      switchSubscriptionPaymentCombo(id, data, {
        // @ts-expect-error
        onSuccess: (sub: Subscription) => {
          setSwitchPaymentComboDialogOpen(false);
          if (options && options.onSuccess) options.onSuccess(sub);
          fetchPaymentCombo(sub.payment_combo);
        },
        onError: (err) => {
          if (options && options.onError) options.onError(err);
        },
      });
    },

  freezeSubscription:
    ({ id, freezeSubscription }: BeforeHandlerProps) =>
    (
      data: PauseRequestData,
      options: OptionBackgroundCallback<
        void,
        PauseRequestResults,
        PauseRequestErrorResults
      >,
    ) => {
      freezeSubscription(id, data, options);
    },

  updateSubscriptionRenewal:
    ({ id, updateSubscriptionRenewal }: BeforeHandlerProps) =>
    (data: any, options: OptionCallback<Subscription>) => {
      // @ts-expect-error
      updateSubscriptionRenewal(id, data, options);
    },
};

const mapWithHandlers2 = {
  cancelPause:
    ({ cancelPause, fetchSubscription, id }: BeforeHandlerProps) =>
    (pauseId: number, options: OptionCallback<Subscription>) => {
      cancelPause(id, pauseId, {
        // @ts-expect-error
        onSuccess: (args?: Subscription) => {
          if (options && options.onSuccess) options.onSuccess(args);
          // @ts-expect-error
          fetchSubscription();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
  updatePlannedInvoiceDate:
    ({ updatePlannedInvoiceDate, fetchSubscription, id }: BeforeHandlerProps) =>
    (
      data: {
        date: string;
        planned_invoice: number;
      },
      options: OptionCallback<Subscription>,
    ) => {
      updatePlannedInvoiceDate(id, data, {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          // @ts-expect-error
          fetchSubscription();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
  flagPlannedInvoiceAsLast:
    ({ flagPlannedInvoiceAsLast, fetchSubscription }: BeforeHandlerProps) =>
    (id: number, note?: string) => {
      flagPlannedInvoiceAsLast(id, note, {
        // @ts-expect-error
        onSuccess: fetchSubscription,
      });
    },
  unflagPlannedInvoiceAsLast:
    ({ unflagPlannedInvoiceAsLast, fetchSubscription }: BeforeHandlerProps) =>
    (id: number) => {
      unflagPlannedInvoiceAsLast(id, {
        // @ts-expect-error
        onSuccess: fetchSubscription,
      });
    },
  updatePlannedInvoicePrice:
    ({
      updatePlannedInvoicePrice,
      id,
      fetchSubscription,
    }: BeforeHandlerProps) =>
    (
      data: {
        planned_invoice: number;
        price: string;
        update_all: boolean;
        update_recurrent_price: boolean;
      },
      options: OptionCallback<Subscription>,
    ) => {
      updatePlannedInvoicePrice(id, data, {
        onSuccess: (args: any) => {
          options && options.onSuccess(args);
          // @ts-expect-error
          fetchSubscription();
        },
        onError: options.onError,
      });
    },
  downloadContractTerms:
    ({ downloadPDFContractTermsForBillingPlan, id }: BeforeHandlerProps) =>
    (options: OptionCallback) => {
      downloadPDFContractTermsForBillingPlan(id, options);
    },
};

const styles = (theme: Theme) =>
  createStyles({
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

const stateHandlerInit = {
  switchPackDialogOpen: false,
  switchPrivatePassDialogOpen: false,
  switchPaymentComboDialogOpen: false,
  stopDialogOpen: false,
  switchPaymentMethodDialogOpen: false,
  scheduledStopDialogOpen: false,
};
const stateHandlerSetter = {
  setSwitchPackDialogOpen: () => (switchPackDialogOpen: boolean) => {
    return { switchPackDialogOpen };
  },
  setSwitchPrivatePassDialogOpen:
    () => (switchPrivatePassDialogOpen: boolean) => {
      return { switchPrivatePassDialogOpen };
    },
  setSwitchPaymentComboDialogOpen:
    () => (switchPaymentComboDialogOpen: boolean) => {
      return { switchPaymentComboDialogOpen };
    },
  setStopDialogOpen: () => (stopDialogOpen: boolean) => {
    return { stopDialogOpen };
  },
  setSwitchPaymentMethodDialogOpen:
    () => (switchPaymentMethodDialogOpen: boolean) => {
      return { switchPaymentMethodDialogOpen };
    },
  setScheduledStopDialogOpen: () => (scheduledStopDialogOpen: boolean) => {
    return { scheduledStopDialogOpen };
  },
};
export default compose(
  withStyles(styles),
  withState('switchPackDialogOpen', 'setSwitchPackDialogOpen', false),
  withState(
    'switchPrivatePassDialogOpen',
    'setSwitchPrivatePassDialogOpen',
    false,
  ),
  withState(
    'switchPaymentComboDialogOpen',
    'setSwitchPaymentComboDialogOpen',
    false,
  ),
  withState('stopDialogOpen', 'setStopDialogOpen', false),
  withState(
    'switchPaymentMethodDialogOpen',
    'setSwitchPaymentMethodDialogOpen',
    false,
  ),
  withState('scheduledStopDialogOpen', 'setScheduledStopDialogOpen', false),
  connector,
  withHandlers(mapWithHandlers1),
  withHandlers(mapWithHandlers2),
  withTitle(({ subscription }) => (subscription ? subscription.name : '')),
  // @ts-expect-error
  withMemberBannerHOC(({ subscription }) => ({
    name: subscription.memberName,
    archived: subscription.memberArchived,
  })),
)(SubscriptionDetail);
