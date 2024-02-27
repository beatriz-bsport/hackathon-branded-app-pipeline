import {
  WidgetApiMessageType,
  WidgetMessageType,
} from 'bsport-saas/src/libs/widget/types';

import { snackbarSuccess } from 'bsport-saas/src/actions/snackbar.actions';
import { ActionFunctionAny, createAction } from 'redux-actions';

import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import type { OptionCallback } from 'bsport-saas/src/state/types';
import type { Company } from 'bsport-saas/src/libs/company/types';
import type { Dispatch } from 'react';
import { closeUserInteractionPortal } from '../modal/actions';

import { RootState } from '../../reducers';

// First part: how to send message
// ---------------------------------

const apiCallbackRegistry: Record<WidgetApiMessageType, OptionCallback<any>> = {
  MEMBERSHIP_BY_COMPANY: {},
  FETCH_MEMBER_BY_ID: {},
  FETCH_REFERRAL_PROGRAM_MEMBER_STATUS: {},
  FETCH_REFERRAL_PROGRAM_BY_COMPANY: {},
};

const sendBridgeMessage = (type: WidgetMessageType, data?: any) => {
  const iframe = document.getElementById('@bsport-bridge-iframe');

  // @ts-ignore
  if (iframe && iframe.contentWindow) {
    try {
      // @ts-ignore
      iframe.contentWindow.postMessage({ type, data }, '*');
    } catch (err) {
      console.error(err);
    }
  }
};

const bridgeSendApiCallRequest = <A, T>({
  action,
  dispatch,
  payload,
  type,
}: {
  type: WidgetApiMessageType,
  dispatch: Dispatch<any>,
  action: Record<
    'success' | 'isLoading' | 'error',
    // @ts-expect-error due to eslint trailing comma
    ActionFunctionAny<Action<any>>,
  >,
  payload: { args: A, options?: OptionCallback<T> },
}) => {
  const iframe = document.getElementById('@bsport-bridge-iframe');

  if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
    return;
  }

  if (payload.options?.onSuccess) {
    apiCallbackRegistry[type].onSuccess = payload.options?.onSuccess;
  }

  if (payload.options?.onError) {
    apiCallbackRegistry[type].onError = payload.options?.onError;
  }

  try {
    dispatch(action.isLoading(true));
    dispatch(action.error(null));
    iframe.contentWindow.postMessage({ type, args: payload.args }, '*');
  } catch (err) {
    console.error(err);
  }
};

const bridgeHandleApiResponse = ({
  actions,
  dispatch,
  response,
  type,
}: {
  type: WidgetApiMessageType,
  response: { data: unknown, error?: Error },
  dispatch: any,
  actions: {
    success: ActionFunctionAny<Action<any>>,
    isLoading: ActionFunctionAny<Action<any>>,
    error: ActionFunctionAny<Action<any>>,
  },
}) => {
  if (response.error) {
    if (apiCallbackRegistry[type].onError) {
      apiCallbackRegistry[type].onError(response.error);
    }
    dispatch(actions.error(response.error));
    dispatch(actions.isLoading(false));
    return;
  }
  if (apiCallbackRegistry[type].onSuccess) {
    apiCallbackRegistry[type].onSuccess(response.data);
  }
  dispatch(actions.success(response.data));
  dispatch(actions.isLoading(false));
};

export function bridgeRequestAuthenticationStatus() {
  return async (dispatch: any, getState: () => RootState) => {
    if (getState().bridge.authentication.hasBeenReceived) return;
    dispatch(authenticationStatusActions.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_AUTHENTICATED_STATUS);
  };
}

export function bridgeRequestRegisteredOfferIdList() {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.authenticated) return;
    dispatch(listRegisteredIds.isLoading(true));
    dispatch(listRegisteredIds.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_REGISTERED_OFFER_IDS);
  };
}

export function bridgeRequestBasketCount() {
  return async (dispatch: any, getState: () => RootState) => {
    if (getState().bridge.basket.loading) return;
    dispatch(basketCountActions.isLoading(true));
    dispatch(basketCountActions.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_BASKET_COUNT);
  };
}

export function bridgeRequestBookingCount() {
  return async (dispatch: any, getState: () => RootState) => {
    if (getState().bridge.booking.loading) return;
    dispatch(bookingCountActions.isLoading(true));
    dispatch(bookingCountActions.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_BOOKINGS_COUNT);
  };
}

export function bridgeRequestLogout() {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    sendBridgeMessage(WidgetMessageType.REQUEST_LOGOUT);
  };
}

export function bridgeRequestMemberTag() {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    dispatch(memberTagActions.isLoading(true));
    dispatch(memberTagActions.error(null));
    setTimeout(
      () => sendBridgeMessage(WidgetMessageType.REQUEST_MEMBER_TAG),
      3000,
    );
  };
}

export function bridgeRequestVideoPlaybackUrl(videoId) {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    dispatch(getVideoPlaybackUrlActions.isLoading(true));
    dispatch(getVideoPlaybackUrlActions.error(null));
    dispatch(getVideoPlaybackUrlActions.accessDenied(false));
    sendBridgeMessage(WidgetMessageType.REQUEST_PLAYBACK_URL, { videoId });
  };
}

// ----- Referral -----

export function bridgeRetrieveReferralProgramForCompany(companyId: number) {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, Action<unknown>>,
  ) => {
    dispatch(retrieveReferralProgramForCompanyActions.isLoading(true));
    dispatch(retrieveReferralProgramForCompanyActions.error(null));

    sendBridgeMessage(WidgetMessageType.REQUEST_REFERRAL_PROGRAM_FOR_COMPANY, {
      companyId,
    });
  };
}

export function bridgeRetrieveReferralMemberStatus(memberId: number) {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, Action<unknown>>,
    getState: () => RootState,
  ) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    dispatch(retrieveReferralMemberStatusActions.isLoading(true));
    dispatch(retrieveReferralMemberStatusActions.error(null));
    sendBridgeMessage(
      WidgetMessageType.REQUEST_REFERRAL_PROGRAM_MEMBER_STATUS,
      {
        memberId,
      },
    );
  };
}

export function bridgeRetrieveMember(memberId: number) {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, Action<unknown>>,
    getState: () => RootState,
  ) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    dispatch(retrieveMemberAction.isLoading(true));
    dispatch(retrieveMemberAction.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_MEMBER, {
      memberId,
    });
  };
}

export function bridgeRetrieveMembershipByCompany(companyId: number) {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, Action<unknown>>,
    getState: () => RootState,
  ) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    dispatch(retrieveMembershipByCompanyAction.isLoading(true));
    dispatch(retrieveMembershipByCompanyAction.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_MEMBERSHIP_BY_COMPANY, {
      companyId,
    });
  };
}
// Internal Actions to mutate the reducer
// --------------------------------------
export const authenticationStatusActions = {
  success: createAction('BRIDGE/AUTHENTICATION/SUCCESS'),
  hasBeenReceived: createAction('BRIDGE/AUTHENTICATION/RECEIVED'),
  error: createAction('BRIDGE/AUTHENTICATION/ERROR'),
};

export const listRegisteredIds = {
  success: createAction('BRIDGE/LIST_REGISTERED/SUCCESS'),
  error: createAction('BRIDGE/LIST_REGISTERED/ERROR'),
  isLoading: createAction('BRIDGE/LIST_REGISTERED/IS_LOADING'),
};

export const bookingCountActions = {
  success: createAction('BRIDGE/BOOKING_COUNT/SUCCESS'),
  isLoading: createAction('BRIDGE/BOOKING_COUNT/LOADING'),
  error: createAction('BRIDGE/BOOKING_COUNT/ERROR'),
};

export const basketCountActions = {
  success: createAction('BRIDGE/BASKET_COUNT/SUCCESS'),
  isLoading: createAction('BRIDGE/BASKET_COUNT/LOADING'),
  error: createAction('BRIDGE/BASKET_COUNT/ERROR'),
};

export const memberTagActions = {
  success: createAction('MEMBER_TAG/GET/SUCCESS'),
  isLoading: createAction('MEMBER_TAG/GET/LOADING'),
  error: createAction('MEMBER_TAG/GET/ERROR'),
};
export const getVideoPlaybackUrlActions = {
  success: createAction('VIDEO/PLAYBACK_URL/SUCCESS'),
  isLoading: createAction('VIDEO/PLAYBACK_URL/LOADING'),
  error: createAction('VIDEO/PLAYBACK_URL/ERROR'),
  accessDenied: createAction('VIDEO/PLAYBACK_URL/ACCESS_DENIED'),
};

export const retrieveReferralProgramForCompanyActions = {
  success: createAction('REFERRAL/BRIDGE/PROGRAM_FOR_COMPANY/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/PROGRAM_FOR_COMPANY/LOADING'),
  error: createAction('REFERRAL/BRIDGE/PROGRAM_FOR_COMPANY/ERROR'),
};

export const retrieveReferralMemberStatusActions = {
  success: createAction('REFERRAL/BRIDGE/MEMBER_STATUS/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/MEMBER_STATUS/LOADING'),
  error: createAction('REFERRAL/BRIDGE/MEMBER_STATUS/ERROR'),
};

export const retrieveMemberAction = {
  success: createAction('REFERRAL/BRIDGE/MEMBER/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/MEMBER/LOADING'),
  error: createAction('REFERRAL/BRIDGE/MEMBER/ERROR'),
};
export const retrieveMembershipByCompanyAction = {
  success: createAction('REFERRAL/BRIDGE/MEMBERSHIP_BY_COMPANY/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/MEMBERSHIP_BY_COMPANY/LOADING'),
  error: createAction('REFERRAL/BRIDGE/MEMBERSHIP_BY_COMPANY/ERROR'),
};

export const fetchMyUserProfileActions = {
  success: createAction('BRIDGE/MY_USER_PROFILE/SUCCESS'),
  isLoading: createAction('BRIDGE/MY_USER_PROFILE/LOADING'),
  error: createAction('BRIDGE/MY_USER_PROFILE/ERROR'),
};
// Second part: how to handle messages
// -----------------------------------

export const handleBridgeMessage = (eventData: any) => (dispatch: any) => {
  switch (eventData.type) {
    case WidgetMessageType.RESPONSE_LOGIN_SUCCESS:
      dispatch(closeUserInteractionPortal());
      break;

    case WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS:
      dispatch(
        authenticationStatusActions.success({
          authenticated: eventData.authenticated,
          username: eventData && eventData.username,
        }),
      );

      dispatch(authenticationStatusActions.hasBeenReceived(true));

      if (!eventData.authenticated) {
        dispatch(basketCountActions.success(null));
        dispatch(bookingCountActions.success(null));
        dispatch(closeUserInteractionPortal());
      }
      break;

    case WidgetMessageType.RESPONSE_BASKET_COUNT:
      dispatch(basketCountActions.success(eventData.count));
      dispatch(basketCountActions.isLoading(false));
      dispatch(basketCountActions.error(null));
      break;

    case WidgetMessageType.RESPONSE_REGISTERED_OFFER_IDS:
      dispatch(listRegisteredIds.success(eventData.offer_ids));
      dispatch(listRegisteredIds.isLoading(false));
      dispatch(listRegisteredIds.error(null));
      break;

    case WidgetMessageType.RESPONSE_BOOKINGS_COUNT:
      dispatch(bookingCountActions.success(eventData.count));
      dispatch(bookingCountActions.isLoading(false));
      dispatch(bookingCountActions.error(null));
      break;

    case WidgetMessageType.RESPONSE_PAYMENT_SUCCESS:
    case WidgetMessageType.PAYMENT_SUCCESS:
      dispatch(closeUserInteractionPortal());
      dispatch(snackbarSuccess('snackbar:consumerPass.success'));
      dispatch(bridgeRequestRegisteredOfferIdList());
      break;

    case WidgetMessageType.REQUEST_MEMBER_TAG:
      dispatch(memberTagActions.success(eventData));
      dispatch(memberTagActions.isLoading(false));
      dispatch(memberTagActions.error(null));
      break;

    case WidgetMessageType.VIDEO_REGISTERED:
      dispatch(closeUserInteractionPortal());
      dispatch(bridgeRequestVideoPlaybackUrl(eventData.videoId));
      break;
    case WidgetMessageType.RESPONSE_PLAYBACK_URL_ACCESS_DENIED:
      if (
        eventData.data?.accessDenied === false ||
        eventData.data?.accessDenied === true
      ) {
        dispatch(
          getVideoPlaybackUrlActions.accessDenied(eventData.data.accessDenied),
        );
      }
      break;
    case WidgetMessageType.RESPONSE_PLAYBACK_URL_ERROR:
      dispatch(
        getVideoPlaybackUrlActions.success({
          videoId: eventData.data.videoId,
          playbackUrl: '',
        }),
      );
      dispatch(getVideoPlaybackUrlActions.isLoading(false));
      dispatch(getVideoPlaybackUrlActions.error(null));
      break;

    case WidgetMessageType.RESPONSE_PLAYBACK_URL_SUCCESS:
      if (eventData.data?.playbackUrl) {
        dispatch(
          getVideoPlaybackUrlActions.success({
            videoId: eventData.data.videoId,
            playbackUrl: eventData.data.playbackUrl,
          }),
        );
        dispatch(closeUserInteractionPortal());
      }
      dispatch(getVideoPlaybackUrlActions.isLoading(false));
      dispatch(getVideoPlaybackUrlActions.error(null));
      break;

    case WidgetMessageType.RESPONSE_CLOSE_SUBSCRIPTION_MODAL_ON_ERROR:
      dispatch(closeUserInteractionPortal());
      break;

    case WidgetMessageType.CLOSE_MODAL:
      dispatch(closeUserInteractionPortal());
      break;

    case WidgetMessageType.RESPONSE_RETRIEVE_REFERRAL_PROGRAM_FOR_COMPANY:
      dispatch(
        retrieveReferralProgramForCompanyActions.success(eventData.data),
      );
      dispatch(retrieveReferralProgramForCompanyActions.isLoading(false));
      dispatch(retrieveReferralProgramForCompanyActions.error(null));
      break;

    case WidgetMessageType.ERROR_RETRIEVING_REFERRAL_PROGRAM_FOR_COMPANY:
      dispatch(retrieveReferralProgramForCompanyActions.error(eventData.error));
      dispatch(retrieveReferralProgramForCompanyActions.isLoading(false));
      break;

    case WidgetMessageType.RESPONSE_RETRIEVE_REFERRAL_MEMBER_STATUS:
      dispatch(retrieveReferralMemberStatusActions.success(eventData.data));
      dispatch(retrieveReferralMemberStatusActions.isLoading(false));
      dispatch(retrieveReferralMemberStatusActions.error(null));
      break;

    case WidgetMessageType.ERROR_RETRIEVING_REFERRAL_MEMBER_STATUS:
      dispatch(retrieveReferralMemberStatusActions.error(eventData.error));
      dispatch(retrieveReferralMemberStatusActions.isLoading(false));
      break;

    case WidgetMessageType.RESPONSE_RETRIEVE_MEMBER:
      dispatch(retrieveMemberAction.success(eventData.data));
      dispatch(retrieveMemberAction.isLoading(false));
      dispatch(retrieveMemberAction.error(null));
      break;

    case WidgetMessageType.ERROR_RETRIEVING_MEMBER:
      dispatch(retrieveMemberAction.error(eventData.error));
      dispatch(retrieveMemberAction.isLoading(false));
      break;

    case WidgetMessageType.RESPONSE_RETRIEVE_MEMBERSHIP_BY_COMPANY:
      dispatch(retrieveMembershipByCompanyAction.success(eventData.data));
      dispatch(retrieveMembershipByCompanyAction.isLoading(false));
      dispatch(retrieveMembershipByCompanyAction.error(null));
      break;

    case WidgetMessageType.ERROR_RETRIEVING_MEMBERSHIP_BY_COMPANY:
      dispatch(retrieveMembershipByCompanyAction.error(eventData.error));
      dispatch(retrieveMembershipByCompanyAction.isLoading(false));
      break;

    default:
      break;
  }
};
