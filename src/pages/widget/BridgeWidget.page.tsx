// very few ts errors, (some function calls make no sense, reflected by type errors. Otherwise all good)
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { DateTime } from 'luxon';

import withQueryParamsToProps from '#hocs/query-params-to-props.hoc';
import WidgetUtils from '#libs/widget/WidgetUtils';

// SELECTORS
import { getCurrentBasket } from '#libs/checkout/selectors';
import { getMembership } from '#libs/membership/selectors';

// ACTIONS
import { fetchCurrentBasket } from '#libs/checkout/actions';
// @ts-expect-error
import {
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
} from '#libs/consumer-space/actions';

import {
  fetchOfferRegisteredIds,
  fetchOfferBulk as fetchOfferBulkAction,
} from '#libs/offer/actions';

import {
  fetchMembership,
  fetchMembershipByCompany,
} from '#libs/membership/actions';

import { fetchMemberTagList } from '#libs/tag/actions';
import { getPlaybackUrl } from '#libs/video/actions';
import {
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#libs/referral/actions';
import { fetchMember } from '#libs/member/actions';
import { bridgeAPIActionsRegistry } from '#libs/widget/actionsRegistry';
import { fetchMetaActivityBulkWidget } from '#libs/meta-activity/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#libs/group-offer/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#libs/consumer-payment-pack/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import { fetchPaymentPackBulkWidget } from '#libs/payment-packs/actions';
import {
  fetchAssetForBlueprintWidget,
  fetchRoomBlueprintsWidget,
  fetchSpotForBlueprintWidget,
} from '#libs/spot-scheduling/actions';
import {
  fetchPrivateConsumerPassBulk as fetchPrivateConsumerPassBulkAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
  fetchPrivatePassBulk,
  fetchPrivateServiceCompatiblePassList,
} from '#libs/private-service/actions';

// TYPES
import {
  WidgetApiMessageType,
  WidgetMessageType,
  widgetApiMessageTypes,
} from '#libs/widget/types';
import type { CheckoutItem, Basket } from '#libs/checkout/types';
import type { Tag } from '#libs/tag/types';

// CONSTANTS
import actionsBinder from '#libs/widget/actionsBinder';
import {
  fetchRelatedMembersNamesByConsumerPaymentPackLinks,
  fetchRelatedMembersNamesByPrivateConsumerPassLinks,
} from '#libs/relationship/actions';
import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../../constants';
import { disconnect, fetchAccessLevel } from '../../actions/auth.actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getAuthToken } from '../../http';
import { RootState } from '../../reducers';

type OwnProps = {
  companyId: number;
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
    this.props.fetchMemberTagList(this.props.companyId, {
      onSuccess: (payload: Array<Tag>) => {
        WidgetUtils.sendBridgeResponse(WidgetMessageType.REQUEST_MEMBER_TAG, {
          data: payload,
        });
      },
    });
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
  basket: getCurrentBasket(state),
  bookingsCount: state.consumer.bookingAndPrivateBooking.count,
  bookingsLoading: state.consumer.bookingAndPrivateBooking.loading,
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
