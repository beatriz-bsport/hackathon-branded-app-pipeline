// @flow

import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { goBack as goBackAction } from 'react-router-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CheckInConfirm from '../../libs/check-in/components/CheckInConfirm.component';
import type { OptionCallback } from '../../state/types';

import { getMemberBookingWithConsumerPack } from '../../libs/booking/selectors';
import { retrieveBooking } from '../../libs/booking/actions';
import { retrieveConsumerPackBulk } from '../../libs/consumer-payment-pack/actions';

type Props = {
  classes: Object,
  member: Member,
  booking: any,
  offer: any,
  goBack: () => void,

  bookingId: number,

  retrieveBooking: (id: number, options: OptionCallback) => void,
  retrieveConsumerPackBulk: (Array<number>) => void,
};

export class CheckInConfirmPage extends React.Component<Props> {
  componentDidMount() {
    this.props.retrieveBooking(this.props.bookingId, {
      onSuccess: (booking) =>
        this.props.retrieveConsumerPackBulk([booking.consumer_payment_pack]),
    });
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <CheckInConfirm
          offer={this.props.offer}
          booking={this.props.booking}
          paymentPack={this.props.booking.consumer_payment_pack.paymentPack}
          member={this.props.member}
          goBack={this.props.goBack}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit * 2,
    minHeight: '70vh',
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({
    bookingId: 'bookingId:number',
    offerId: 'offerId:number',
  }),
  connect(
    (state, { bookingId }) => ({
      offer: state.offer.retrieve.data,
      members: state.member.all,
      booking: getMemberBookingWithConsumerPack(state, bookingId),
      bookingLoading: state.booking.loading,
    }),
    {
      goBack: goBackAction,
      retrieveBooking,
      retrieveConsumerPackBulk,
    },
  ),
  withProps(({ members, booking }) => ({
    member: members.find((m) => m.id === booking.member),
  })),
)(CheckInConfirmPage);
