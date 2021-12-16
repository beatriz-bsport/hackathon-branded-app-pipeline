import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment';

import { RootState } from '../../reducers';
import { fetchCurrentBasket } from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { disconnect, fetchAccessLevel } from '../../actions/auth.actions';
import { fetchBookingsAndPrivateBookings } from '../../libs/consumer-space/actions';
import { fetchMembership } from '../../libs/membership/actions';
import { getMembership } from '../../libs/membership/selectors';
import WidgetUtils from '../../libs/widget/WidgetUtils';
import { WidgetMessageType } from '../../libs/widget/types';
import { CheckoutItem, Basket } from '../../libs/checkout/types';
import { getAuthToken } from '../../http';
import { fetchMemberTagList } from '../../libs/tag/actions';
import { getPlaybackUrl } from '../../libs/video/actions';
import { fetchOfferRegisteredIds } from '../../libs/offer/actions';

type OwnProps = {
  companyId: number;
  companyName: string;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

class BridgeWidgetPage extends React.PureComponent<Props> {
  token: string = '';

  componentWillMount() {
    window.addEventListener('message', this.handleMessages, false);
    window.addEventListener('storage', this.onStorageChange);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessages);
    window.removeEventListener('storage', this.onStorageChange);
  }

  onStorageChange = () => {
    const token = getAuthToken();
    if (token !== this.token) {
      this.token = token;
      this.fetchAccessLevel(token);
    }
  };

  componentDidMount() {
    this.sendAuthenticationResponse();
  }

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
      onSuccess: (payload: Array<number>) => {
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

  handleMessages = (event: any) => {
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
  fetchBookingsAndPrivateBookings,
  disconnect,
  fetchMemberTagList,
  getPlaybackUrl,
  fetchOfferRegisteredIds,
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(BridgeWidgetPage);
