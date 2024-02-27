// @ts-nocheck very few errors, can be removed soon (some function calls make no sense, reflected by type errors. Otherwise all good)
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment-timezone';

import type { OptionCallback, ThunkAction } from 'src/state/types';
import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../../constants';

import withQueryParamsToProps from '#hocs/query-params-to-props.hoc';
import { RootState } from '../../reducers';
import { fetchCurrentBasket } from '#libs/checkout/actions';
import { getCurrentBasket } from '#libs/checkout/selectors';
// @ts-expect-error
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
// @ts-expect-error
import { disconnect, fetchAccessLevel } from '../../actions/auth.actions';
import { fetchBookingsAndPrivateBookings } from '../../libs/consumer-space/actions';
import {
  fetchMembership,
  fetchMembershipByCompany,
} from '#libs/membership/actions';
import { getMembership } from '#libs/membership/selectors';
import WidgetUtils from '#libs/widget/WidgetUtils';
import { WidgetApiMessageType, WidgetMessageType } from '#libs/widget/types';
import type { CheckoutItem, Basket } from '#libs/checkout/types';
import { getAuthToken } from '../../http';
import { fetchMemberTagList } from '#libs/tag/actions';
import { getPlaybackUrl } from '#libs/video/actions';
import { fetchOfferRegisteredIds } from '#libs/offer/actions';
import {
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#libs/referral/actions';
import { fetchMember } from '#libs/member/actions';
import type { Membership } from '#libs/membership/types';
import type {
  ReferralMemberStatus,
  ReferralProgram,
} from '#libs/referral/types';
import type { Member } from '#libs/member/types';
import type { Tag } from '#libs/tag/types';

type OwnProps = {
  companyId: number;
  companyName: string;
  isBackofficePreview?: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type WidgetMessageEvent =
  | {
      data: { type: WidgetMessageType; data: Record<string, unknown> };
    }
  | {
      data: { type: WidgetApiMessageType; args: unknown };
    };

class BridgeWidgetPage extends React.PureComponent<Props> {
  token: string = '';

  componentWillMount() {
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
    this.sendAuthenticationResponse();
    if (!this.props.isBackofficePreview) {
      window?.sessionStorage?.setItem(
        BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
        BsportRequestFromHeaderValue.BRIDGE,
      );
    }
  }

  handleBridgeApiCallRequest = <A, T>({
    apiCallAction,
    args,
    responseSignature,
  }: {
    args: unknown;
    apiCallAction: (
      args: A,
      options?: OptionCallback<T>,
    ) => ((dispatch: any) => Promise<void>) | ThunkAction;
    responseSignature: WidgetApiMessageType;
  }): void => {
    apiCallAction(args as A, {
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
      date_start: moment().format('YYYY-MM-DD'),
      member: this.props.membership.id,
      options: {
        onSuccess: (payload) => {
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
      onAccessDenied: (payload: number) => {
        WidgetUtils.sendBridgeResponse(
          WidgetMessageType.RESPONSE_PLAYBACK_URL_ACCESS_DENIED,
          {
            data: { videoId, playbackUrl: '', accessDenied: payload },
          },
        );
      },
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
            this.fetchPlaybackUrl(event.data.data.videoId);
          }
          break;

        case WidgetApiMessageType.MEMBERSHIP_BY_COMPANY:
          this.handleBridgeApiCallRequest<number, Membership>({
            args: event.data.args,
            responseSignature: WidgetApiMessageType.MEMBERSHIP_BY_COMPANY,
            apiCallAction: this.props.fetchMembershipByCompany,
          });
          break;

        case WidgetApiMessageType.FETCH_MEMBER_BY_ID:
          this.handleBridgeApiCallRequest<number, Member>({
            args: event.data.args,
            responseSignature: WidgetApiMessageType.FETCH_MEMBER_BY_ID,
            apiCallAction: this.props.fetchMember,
          });
          break;

        case WidgetApiMessageType.FETCH_REFERRAL_PROGRAM_MEMBER_STATUS:
          this.handleBridgeApiCallRequest<number, ReferralMemberStatus>({
            apiCallAction: this.props.retrieveReferralMemberStatus,
            args: event.data.args,
            responseSignature:
              WidgetApiMessageType.FETCH_REFERRAL_PROGRAM_MEMBER_STATUS,
          });
          break;

        case WidgetApiMessageType.FETCH_REFERRAL_PROGRAM_BY_COMPANY:
          this.handleBridgeApiCallRequest<number, ReferralProgram>({
            apiCallAction: this.props.retrieveReferralProgramForCompany,
            args: event.data.args,
            responseSignature:
              WidgetApiMessageType.FETCH_REFERRAL_PROGRAM_BY_COMPANY,
          });
          break;

        default:
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
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  withQueryParamsToProps([
    'isBackofficePreview',
    'isBackofficePreview',
    'boolean',
  ]),
  connect(mapStateToProps, mapDispatchToProps),
)(BridgeWidgetPage);
