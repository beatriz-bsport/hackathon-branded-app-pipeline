// very few ts errors, (some function calls make no sense, reflected by type errors. Otherwise all good)
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { DateTime } from 'luxon';

import withQueryParamsToProps from '#src/hocs/query-params-to-props.hoc';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

// SELECTORS
import { getCurrentBasket } from '#src/libs/checkout/selectors';
import { getMembership } from '#src/libs/membership/selectors';

// ACTIONS
import { fetchCurrentBasket } from '#src/libs/checkout/actions';
import {
  resetConsumerState as resetConsumerStateAction,
  cancelBookingAsMember as cancelBookingAsMemberAction,
  cancelPrivateBookingAsMember as cancelPrivateBookingAsMemberAction,
  cancelBookingOptionAsMember as cancelBookingOptionAsMemberAction,
  fetchBookingsAndPrivateBookings,
  fetchMyBookingOptionAsMember as fetchMyBookingOptionAsMemberAction,
  fetchMyBookingOptionWorkshopAsMember as fetchMyBookingOptionWorkshopAsMemberAction,
  fetchMyFutureBookingAsMember as fetchMyFutureBookingAsMemberAction,
  fetchMyFutureBookingWorkshopAsMember as fetchMyFutureBookingWorkshopAsMemberAction,
  fetchMyFuturePrivateBookingAsMember as fetchMyFuturePrivateBookingAsMemberAction,
  fetchMyPastBookingAsMember as fetchMyPastBookingAsMemberAction,
  fetchMyPastBookingWorkshopAsMember as fetchMyPastBookingWorkshopAsMemberAction,
  fetchMyPastPrivateBookingAsMember as fetchMyPastPrivateBookingAsMemberAction,
  fetchConsumerPassesTabDisplay as fetchConsumerPassesTabDisplayAction,
  fetchMyActiveConsumerPaymentPacksAsMember as fetchMyActiveConsumerPaymentPacksAsMemberAction,
  fetchMyActivePrivateConsumerPassesAsMember as fetchMyActivePrivateConsumerPassesAsMemberAction,
  fetchMyActiveUniversalPassesAsMember as fetchMyActiveUniversalPassesAsMemberAction,
  fetchMyExpiredConsumerPaymentPacksAsMember as fetchMyExpiredConsumerPaymentPacksAsMemberAction,
  fetchMyExpiredPrivateConsumerPassesAsMember as fetchMyExpiredPrivateConsumerPassesAsMemberAction,
  fetchMyExpiredUniversalPassesAsMember as fetchMyExpiredUniversalPassesAsMemberAction,
  fetchMyFutureConsumerPaymentPacksAsMember as fetchMyFutureConsumerPaymentPacksAsMemberAction,
  fetchMyFuturePrivateConsumerPassesAsMember as fetchMyFuturePrivateConsumerPassesAsMemberAction,
  fetchMyFutureUniversalPassesAsMember as fetchMyFutureUniversalPassesAsMemberAction,
  fetchConsumerGuestNumberEligibleLeftByOfferBulk as fetchConsumerGuestNumberEligibleLeftByOfferBulkAction,
  fetchMyBookingOptionsPositionAsMemberByOfferIds as fetchMyBookingOptionsPositionAsMemberByOfferIdsAction,
  fetchConsumerInvoicesComplementary as fetchConsumerInvoicesComplementaryAction,
  fetchConsumerPaidInvoices as fetchConsumerPaidInvoicesAction,
  fetchConsumerRefundedInvoices as fetchConsumerRefundedInvoicesAction,
  fetchConsumerUnpaidInvoices as fetchConsumerUnpaidInvoicesAction,
} from '#src/libs/consumer-space/actions';

import {
  fetchConsumerSubscriptionInvoicesDetails as fetchConsumerSubscriptionInvoicesDetailsAction,
  fetchMySubscriptionAsMember as fetchMySubscriptionAsMemberAction,
  fetchMyActiveSubscriptionsAsMember as fetchMyActiveSubscriptionsAsMemberAction,
  fetchMyExpiredSubscriptionsAsMember as fetchMyExpiredSubscriptionsAsMemberAction,
  fetchMyFutureSubscriptionsAsMember as fetchMyFutureSubscriptionsAsMemberAction,
} from '#src/libs/consumer-space/actions/subscription-actions';

import {
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction,
  downloadPDFContractTermsForBillingPlan as downloadPDFContractTermsForBillingPlanAction,
} from '#src/libs/subscription/actions';

import {
  fetchOfferRegisteredIds,
  fetchOfferBulk as fetchOfferBulkAction,
} from '#src/libs/offer/actions';

import {
  fetchMembership,
  fetchMembershipByCompany,
} from '#src/libs/membership/actions';

import { fetchMemberTagList } from '#src/libs/tag/actions';
import { getPlaybackUrl } from '#src/libs/video/actions';
import {
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#src/libs/referral/actions';
import {
  fetchMember,
  fetchMyUserProfile as fetchMyUserProfileAction,
} from '#src/libs/member/actions';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod as detachPaymentMethodAction,
  requestSetupIntentSecret as requestSetupIntentSecretAction,
} from '#src/libs/payment/actions';
import {
  fetchPaymentGroupStatus as fetchPaymentGroupStatusAction,
  setPaymentStatus as setPaymentStatusAction,
  setBackendProcessingAfterPayment as setBackendProcessingAfterPaymentAction,
} from '#src/libs/payment/payment-module-revamped/actions';
import {
  fetchInvoiceList as fetchInvoiceListAction,
  fetchSpecificInvoice as fetchSpecificInvoiceAction,
  applyBalanceToInvoice as applyBalanceToInvoiceAction,
  fetchInvoiceConfigurationAsMember as fetchInvoiceConfigurationAsMemberAction,
  getInvoiceReceiptUrl as getInvoiceReceiptUrlAction,
} from '#src/libs/invoice/actions';

import { bridgeAPIActionsRegistry } from '#src/libs/widget/actionsRegistry';
import { fetchMetaActivityBulkWidget } from '#src/libs/meta-activity/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#src/libs/group-offer/actions';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#src/libs/consumer-payment-pack/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#src/libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#src/libs/establishment/actions';
import { fetchPaymentPackBulkWidget } from '#src/libs/payment-packs/actions';
import {
  fetchCompanyCustomMemberForm as fetchCompanyCustomMemberFormAction,
  submitCustomForm as submitCustomFormAction,
} from '#src/libs/custom-form/actions';
import {
  fetchAssetForBlueprintWidget,
  fetchRoomBlueprintsWidget,
  fetchSpotForBlueprintWidget,
} from '#src/libs/spot-scheduling/actions';
import {
  fetchPrivateConsumerPassBulk as fetchPrivateConsumerPassBulkAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
  fetchPrivatePassBulk,
  fetchPrivateServiceCompatiblePassList,
} from '#src/libs/private-service/actions';

// TYPES
import {
  WidgetApiMessageType,
  WidgetMessageType,
  widgetApiMessageTypes,
} from '#src/libs/widget/types';
import type { CheckoutItem, Basket } from '#src/libs/checkout/types';
import type { Tag } from '#src/libs/tag/types';

// CONSTANTS
import actionsBinder from '#src/libs/widget/actionsBinder';
import {
  fetchRelatedMembersNamesByConsumerPaymentPackLinks,
  fetchRelatedMembersNamesByPrivateConsumerPassLinks,
} from '#src/libs/relationship/actions';
import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../../constants';
// @ts-expect-error
import { disconnect, fetchAccessLevel } from '../../actions/auth.actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getAuthToken } from '../../http';
import { RootState } from '../../reducers';
import { fetchCompanyConfiguration as fetchCompanyConfigurationAction } from '#src/libs/waiting-list/actions';

type OwnProps = {
  companyId: number;
  // eslint-disable-next-line react/no-unused-prop-types
  companyName: string;

  isBackofficePreview?: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export type BridgeWidgetActions = typeof mapDispatchToProps;

type WidgetMessageEvent =
  | {
      data: { type: WidgetMessageType; data: Record<string, unknown> };
    }
  | {
      data: { type: WidgetApiMessageType; args: unknown };
    };

class BridgeWidgetPage extends React.PureComponent<Props> {
  token: string = '';

  UNSAFE_componentWillMount() {
    window.addEventListener('message', this.handleMessages, false);
    window.addEventListener('storage', this.onStorageChange);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessages);
    window.removeEventListener('storage', this.onStorageChange);
    if (!this.props.isBackofficePreview) {
      window?.sessionStorage?.removeItem(
        BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
      );
    }
  }

  // The redux stores of the different widget and the bridge (iframe) are not shared.
  // However, the localStorage can be updated by the bridge and/or another iframe (usually the booking/payment popup).
  //
  // The localStorage contains the authentication token. This means that we can be in the situation where:
  // - the token was updated (deleted because of logout) and this component
  // - the redux store is not in sync with that and authenticated === true, for example
  //
  // To resolve these inconsistencies, we need to listen to these changes and update the redux store if
  // the authentication status has changed.
  // To do so, we listen to localStorage changes to detect token modification.
  // When the token is updated, we refetch user data via a redux action and store it in the redux store.
  onStorageChange = () => {
    const token = getAuthToken();
    if (token !== this.token) {
      this.token = token;
      this.fetchAccessLevel(token);
    }
  };

  componentDidMount() {
    this.bindBridgeActions();
    this.sendAuthenticationResponse();
    if (!this.props.isBackofficePreview) {
      window?.sessionStorage?.setItem(
        BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
        BsportRequestFromHeaderValue.BRIDGE,
      );
    }
  }

  bindBridgeActions = () => {
    actionsBinder({ ...this.props });
  };

  handleBridgeApiCallRequest = <A, T>({
    responseSignature,
    args,
  }: {
    args: unknown;
    responseSignature: WidgetApiMessageType;
  }): void => {
    const action = bridgeAPIActionsRegistry.get(responseSignature);
    action(args as A, {
      onSuccess: (data: T) => {
        WidgetUtils.sendBridgeResponse(responseSignature, { data });
      },
      onError: (error: Error) => {
        WidgetUtils.sendBridgeResponse(responseSignature, {
          error: error ?? new Error('Unknown error'),
        });
      },
    });
  };

  sendAuthenticationResponse = () => {
    const { authenticated, username } = this.props.auth;
    WidgetUtils.DEPRECATEDauthenticatedStatus(authenticated, username);
    WidgetUtils.sendBridgeResponse(
      WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS,
      {
        authenticated,
        username,
      },
    );
  };

  fetchRegisteredOfferIds = () => {
    if (this.props.auth.authenticated) {
      this.props.fetchOfferRegisteredIds({
        onSuccess: (offer_ids: Array<number>) =>
          WidgetUtils.sendBridgeResponse(
            WidgetMessageType.RESPONSE_REGISTERED_OFFER_IDS,
            {
              offer_ids,
            },
          ),
      });
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.auth.authenticated !== this.props.auth.authenticated) {
      this.sendAuthenticationResponse();
    }
  }

  fetchAccessLevel = (token: string) => {
    if (token && token !== 'null') {
      this.props.fetchAccessLevel(token);
    } else {
      this.props.disconnect();
    }
  };

  sendBookingCount = () => {
    this.props.fetchBookingsAndPrivateBookings({
      page: 1,
      date_start: DateTime.now().toISODate(),
      member: this.props.membership.id,
      options: {
        onSuccess: (payload) => {
          // @ts-expect-error
          const { count } = payload;
          WidgetUtils.DEPRECATEDbookingsCount(count);
          WidgetUtils.sendBridgeResponse(
            WidgetMessageType.RESPONSE_BOOKINGS_COUNT,
            { count },
          );
        },
      },
    });
  };

  fetchMemberTagList = () => {
    if (this.props.auth.authenticated) {
      this.props.fetchMemberTagList(this.props.companyId, {
        onSuccess: (payload: Array<Tag>) => {
          WidgetUtils.sendBridgeResponse(WidgetMessageType.REQUEST_MEMBER_TAG, {
            data: payload,
          });
        },
      });
    }
  };

  fetchPlaybackUrl = (videoId: number) => {
    this.props.getPlaybackUrl(videoId, {
      // @ts-expect-error
      onAccessDenied: (payload: number) => {
        WidgetUtils.sendBridgeResponse(
          WidgetMessageType.RESPONSE_PLAYBACK_URL_ACCESS_DENIED,
          {
            data: { videoId, playbackUrl: '', accessDenied: payload },
          },
        );
      },
      // @ts-expect-error
      onSuccess: (payload: string) => {
        WidgetUtils.sendBridgeResponse(
          WidgetMessageType.RESPONSE_PLAYBACK_URL_SUCCESS,
          {
            data: { videoId, playbackUrl: payload, accessDenied: false },
          },
        );
      },
      onError: () => {
        WidgetUtils.sendBridgeResponse(
          WidgetMessageType.RESPONSE_PLAYBACK_URL_ERROR,
          {
            data: { videoId, playbackUrl: '', error: 'error' },
          },
        );
      },
    });
  };

  sendBasketCount = () => {
    this.props.fetchCurrentBasket(this.props.companyId, {
      onSuccess: (basket: Basket) => {
        if (basket && basket.checkout_items) {
          const count = basket.checkout_items.reduce(
            (s: number, a: CheckoutItem) => s + a.quantity,
            0,
          );
          WidgetUtils.DEPRECATEDbasketCount(count);
          WidgetUtils.sendBridgeResponse(
            WidgetMessageType.RESPONSE_BASKET_COUNT,
            { count },
          );
        }
      },
    });
  };

  handleMessages = (event: WidgetMessageEvent) => {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case WidgetMessageType.REQUEST_AUTHENTICATED_STATUS:
        case WidgetMessageType.GET_AUTHENTICATED_STATUS: {
          this.sendAuthenticationResponse();
          break;
        }

        case WidgetMessageType.REQUEST_REGISTERED_OFFER_IDS: {
          this.fetchRegisteredOfferIds();
          break;
        }

        case WidgetMessageType.REQUEST_BASKET_COUNT: {
          this.sendBasketCount();
          break;
        }
        case WidgetMessageType.REQUEST_BOOKING_COUNT:
          this.sendBookingCount();
          break;

        case WidgetMessageType.REQUEST_LOGOUT:
          if (!this.props.auth.authenticated) {
            this.sendAuthenticationResponse();
          } else {
            this.props.disconnect();
          }
          break;
        case WidgetMessageType.REQUEST_MEMBER_TAG:
          this.fetchMemberTagList();
          break;
        case WidgetMessageType.REQUEST_PLAYBACK_URL:
          if (event.data?.data?.videoId) {
            // @ts-expect-error
            this.fetchPlaybackUrl(event.data.data.videoId);
          }
          break;

        default:
          // @ts-expect-error
          if (widgetApiMessageTypes.includes(event.data.type)) {
            this.handleBridgeApiCallRequest<unknown, unknown>({
              // @ts-expect-error
              args: event.data.args,
              // @ts-expect-error
              responseSignature: event.data.type,
            });
          }
          break;
      }
    }
  };

  render() {
    return <div style={{ height: 1, width: 1, backgroundColor: 'green' }} />;
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  auth: state.auth,
  // eslint-disable-next-line react/no-unused-prop-types
  basket: getCurrentBasket(state),
  membership: getMembership(state, ownProps.companyId),
});

const mapDispatchToProps = {
  fetchAccessLevel,
  fetchCurrentBasket,
  fetchMembership,
  fetchMember,
  fetchBookingsAndPrivateBookings,
  disconnect,
  fetchMemberTagList,
  getPlaybackUrl,
  fetchOfferRegisteredIds,
  retrieveReferralProgramForCompany: retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus: retrieveReferralMemberStatusAction,
  retrieveMember: fetchMember,
  fetchMembershipByCompany,
  fetchMyPastBookingAsMember: fetchMyPastBookingAsMemberAction,
  fetchMyFutureBookingAsMember: fetchMyFutureBookingAsMemberAction,
  fetchMyBookingOptionAsMember: fetchMyBookingOptionAsMemberAction,
  fetchMyBookingOptionWorkshopAsMember:
    fetchMyBookingOptionWorkshopAsMemberAction,
  fetchMyPastPrivateBookingAsMember: fetchMyPastPrivateBookingAsMemberAction,
  fetchMyFuturePrivateBookingAsMember:
    fetchMyFuturePrivateBookingAsMemberAction,
  fetchMyPastBookingWorkshopAsMember: fetchMyPastBookingWorkshopAsMemberAction,
  fetchMyFutureBookingWorkshopAsMember:
    fetchMyFutureBookingWorkshopAsMemberAction,
  fetchCoachBulk: fetchCoachBulkAction,
  fetchGroupOffer: fetchGroupOfferAction,
  fetchLevelList: fetchLevelListAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkWidget,
  fetchOfferBulk: fetchOfferBulkAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
  fetchPaymentPackBulk: fetchPaymentPackBulkWidget,
  fetchRoomBlueprints: fetchRoomBlueprintsWidget,
  fetchSpotForBlueprint: fetchSpotForBlueprintWidget,
  fetchAssetForBlueprint: fetchAssetForBlueprintWidget,
  fetchPrivateConsumerPassBulk: fetchPrivateConsumerPassBulkAction,
  fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk: fetchPrivateServiceBulkAction,
  cancelBookingAsMember: cancelBookingAsMemberAction,
  cancelPrivateBookingAsMember: cancelPrivateBookingAsMemberAction,
  cancelBookingOptionAsMember: cancelBookingOptionAsMemberAction,
  fetchConsumerPassesTabDisplay: fetchConsumerPassesTabDisplayAction,
  fetchMyActiveConsumerPaymentPacksAsMember:
    fetchMyActiveConsumerPaymentPacksAsMemberAction,
  fetchMyActivePrivateConsumerPassesAsMember:
    fetchMyActivePrivateConsumerPassesAsMemberAction,
  fetchMyActiveUniversalPassesAsMember:
    fetchMyActiveUniversalPassesAsMemberAction,
  fetchMyExpiredConsumerPaymentPacksAsMember:
    fetchMyExpiredConsumerPaymentPacksAsMemberAction,
  fetchMyExpiredPrivateConsumerPassesAsMember:
    fetchMyExpiredPrivateConsumerPassesAsMemberAction,
  fetchMyExpiredUniversalPassesAsMember:
    fetchMyExpiredUniversalPassesAsMemberAction,
  fetchMyFutureConsumerPaymentPacksAsMember:
    fetchMyFutureConsumerPaymentPacksAsMemberAction,
  fetchMyFuturePrivateConsumerPassesAsMember:
    fetchMyFuturePrivateConsumerPassesAsMemberAction,
  fetchMyFutureUniversalPassesAsMember:
    fetchMyFutureUniversalPassesAsMemberAction,
  fetchRelatedMembersNamesByConsumerPaymentPackLinks,
  fetchRelatedMembersNamesByPrivateConsumerPassLinks,
  fetchPrivatePassBulk,
  fetchPrivateServiceCompatiblePassList,
  fetchCompanyWaitlistConfiguration: fetchCompanyConfigurationAction,
  fetchConsumerGuestNumberEligibleLeftByOfferBulk:
    fetchConsumerGuestNumberEligibleLeftByOfferBulkAction,
  fetchMyBookingOptionsPositionAsMemberByOfferIds:
    fetchMyBookingOptionsPositionAsMemberByOfferIdsAction,
  fetchConsumerInvoicesComplementary: fetchConsumerInvoicesComplementaryAction,
  resetConsumerState: resetConsumerStateAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  detachPaymentMethod: detachPaymentMethodAction,
  fetchConsumerPaidInvoices: fetchConsumerPaidInvoicesAction,
  fetchConsumerRefundedInvoices: fetchConsumerRefundedInvoicesAction,
  fetchConsumerUnpaidInvoices: fetchConsumerUnpaidInvoicesAction,
  fetchInvoiceList: fetchInvoiceListAction,
  fetchSpecificInvoice: fetchSpecificInvoiceAction,
  applyBalanceToInvoice: applyBalanceToInvoiceAction,
  fetchMyUserProfile: fetchMyUserProfileAction,
  fetchCompanyCustomMemberForm: fetchCompanyCustomMemberFormAction,
  submitCustomForm: submitCustomFormAction,
  fetchMyFutureSubscriptionsAsMember: fetchMyFutureSubscriptionsAsMemberAction,
  fetchMyExpiredSubscriptionsAsMember:
    fetchMyExpiredSubscriptionsAsMemberAction,
  fetchMyActiveSubscriptionsAsMember: fetchMyActiveSubscriptionsAsMemberAction,
  fetchConsumerSubscriptionInvoicesDetails:
    fetchConsumerSubscriptionInvoicesDetailsAction,
  fetchInvoiceConfigurationAsMember: fetchInvoiceConfigurationAsMemberAction,
  downloadPDFContractTermsForBillingPlan:
    downloadPDFContractTermsForBillingPlanAction,
  switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
  fetchMySubscriptionAsMember: fetchMySubscriptionAsMemberAction,
  fetchPaymentGroupStatus: fetchPaymentGroupStatusAction,
  setPaymentStatus: setPaymentStatusAction,
  setBackendProcessingAfterPayment: setBackendProcessingAfterPaymentAction,
  getReceiptUrl: getInvoiceReceiptUrlAction,
  requestSetupIntentSecret: requestSetupIntentSecretAction,
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    // @ts-expect-error
    companyName: 'companyName',
  }),
  withQueryParamsToProps([
    'isBackofficePreview',
    'isBackofficePreview',
    'boolean',
  ]),
  connect(mapStateToProps, mapDispatchToProps),
)(BridgeWidgetPage);
