// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchBookingBulk,
  fetchBookingBroadcastRoom,
} from '../../libs/booking/actions';
import themeSelectors from '../../libs/theme/selectors.ts';

import BroadcastRoom from '../../libs/video/components/BroadcastRoom.component';

type Props = {
  fetchBookingBroadcastRoom: (bookingId: number) => void,
  fetchBookingBulk: (bookingId: number) => void,
  membership: Membership,
  broadcast_info: BroadcastInfo,
  booking: Booking,
  bookingId: number,
  theme: CompanyTheme,
};

export class ConsumerBookingBroadcast extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchBookingBroadcastRoom(this.props.bookingId);
  }

  componentDidMount() {
    this.props.fetchBookingBulk(this.props.bookingId);
  }

  render() {
    return (
      <div>
        {this.props.booking &&
        this.props.booking.offer &&
        this.props.broadcast_info ? (
          <BroadcastRoom
            userType="consumer"
            username={this.props.membership.name}
            offer={this.props.booking.offer}
            broadcast_info={this.props.broadcast_info}
            date_start={this.props.booking.offer_date_start}
            theme={this.props.theme}
            duration_minute={this.props.booking.offer_duration_minute}
          />
        ) : (
          <LinearProgress />
        )}
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    bookingId: 'bookingId:number',
  }),
  connect(
    (state, { bookingId }) => ({
      booking: state.booking.byId[bookingId],
      broadcast_info: state.booking.broadcast.byId[bookingId],
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchBookingBroadcastRoom,
      fetchBookingBulk,
    },
  ),
)(ConsumerBookingBroadcast);
