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
import { fetchMembershipListAsConsumer } from '../../libs/membership/actions';
import { getMembership } from '../../libs/membership/selectors';
import WidgetUtils from '../../libs/widget/WidgetUtils';
import { WidgetMessageType } from '../../libs/widget/types';
import { CheckoutItem } from '../../libs/checkout/types';
import { getAuthToken } from '../../http';

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
    WidgetUtils.authenticatedStatusReady();
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.auth !== this.props.auth) {
      WidgetUtils.authenticatedStatusReady();
      this.fetchData();
    }

    if (!prevProps.membership && this.props.membership) {
      this.fetchBookingsAndPrivateBookings();
    }

    if (prevProps.basket !== this.props.basket && this.props.basket) {
      WidgetUtils.basketCountReady();
    }

    if (prevProps.bookingsLoading && !this.props.bookingsLoading) {
      WidgetUtils.bookingsCountReady();
    }
  }

  fetchData = () => {
    if (this.props.auth.authenticated) {
      this.props.fetchMembershipListAsConsumer();

      if (this.props.membership) {
        this.fetchBookingsAndPrivateBookings();
      }
      this.props.fetchCurrentBasket(this.props.companyId);
    }

    if (this.props.basket) {
      WidgetUtils.basketCountReady();
    }
  };

  fetchAccessLevel = (token: string) => {
    if (token && token !== 'null') {
      this.props.fetchAccessLevel(token);
    }
  };

  fetchBookingsAndPrivateBookings = () => {
    this.props.fetchBookingsAndPrivateBookings({
      page: 1,
      date_start: moment().format('YYYY-MM-DD'),
      member: this.props.membership.id,
    });
  };

  handleMessages = (event: any) => {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case WidgetMessageType.GET_AUTHENTICATED_STATUS:
          WidgetUtils.authenticatedStatus(this.props.auth.authenticated);
          break;

        case WidgetMessageType.GET_BASKET_COUNT: {
          let count: number | null = null;

          if (this.props.basket && this.props.basket.checkout_items) {
            count = this.props.basket.checkout_items.reduce(
              (s: number, a: CheckoutItem) => s + a.quantity,
              0,
            );
          }
          WidgetUtils.basketCount(count);
          break;
        }
        case WidgetMessageType.GET_BOOKINGS_COUNT:
          WidgetUtils.bookingsCount(this.props.bookingsCount);
          break;

        case WidgetMessageType.LOGOUT:
          this.props.disconnect();
          break;
        default:
          break;
      }
    }
  };

  render() {
    return null;
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
  fetchMembershipListAsConsumer,
  fetchBookingsAndPrivateBookings,
  disconnect,
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(BridgeWidgetPage);
