// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchBookingBulk,
  fetchBookingBroadcastRoom,
} from '../../libs/booking/actions';

import BroadcastRoom from '../../libs/video/components/BroadcastRoom.component';

type Props = {
  t: TFunction,
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
          />
        ) : (
          <LinearProgress />
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
});

export default compose(
  withNamespaces(),
  withStyles(styles),
  routerParamsToProps({
    companyId: 'companyId:number',
    bookingId: 'bookingId:number',
  }),
  connect(
    (state, { bookingId }) => ({
      booking: state.booking.byId[bookingId],
      broadcast_info: state.booking.broadcast.byId[bookingId],
    }),
    {
      fetchBookingBroadcastRoom,
      fetchBookingBulk,
    },
  ),
)(ConsumerBookingBroadcast);
