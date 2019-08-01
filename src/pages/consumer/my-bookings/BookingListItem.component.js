// @flow
import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CancelIcon from '@material-ui/icons/Cancel';
import type { TFunction } from 'react-i18next';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import { formatMinutes, formatAsDatetime } from '../../../datetime';
import type { Booking } from '../../../api/types';
import { getBookingStatusCode } from '../../../libs/booking/utils';
import CoachAvatar from '../../../libs/associated-coach/components/CoachAvatar.component';

type Props = {
  booking: Booking,
  overrideClickAction: () => void,
  onDiscard: () => void,
  t: TFunction,
};

export class BookingListItem extends Component<Props> {
  getFullStatus = () => {
    const { t, booking } = this.props;
    const { offer } = booking;

    const formattedDate = `${formatAsDatetime(
      offer.date_start,
    )} - ${formatMinutes(offer.duration_minute, t)}`;
    const bookingStatusCode = getBookingStatusCode(t, booking);
    const bookingRefund = booking.was_refunded
      ? `${t('booking:customerView.wasRefunded')}: `
      : '';
    const offerAvailable = booking.offer.available
      ? ''
      : `${t('booking:customerView.cancelled')}: `;

    return `${offerAvailable}${formattedDate} ${bookingRefund} ${bookingStatusCode}`;
  };

  render() {
    const { booking, overrideClickAction, onDiscard } = this.props;
    const { offer } = booking;
    const { activity } = offer;
    return (
      <ListItem
        key={booking.id}
        dense
        button
        divider
        onClick={overrideClickAction || (() => {})}
        disabled={booking.booking_status_code !== BOOKING_STATUS_OK.id}
      >
        <CoachAvatar
          coach={offer.activity.coach}
          coach_override={offer.coach_override}
        />
        <ListItemText
          primary={activity.name}
          secondary={this.getFullStatus()}
          secondaryTypographyProps={offer.available ? {} : { color: 'error' }}
        />
        {onDiscard &&
        !booking.was_refunded &&
        booking.booking_status_code === BOOKING_STATUS_OK.id ? (
          <ListItemSecondaryAction>
            <IconButton onClick={onDiscard} id={`booking-cancel-${booking.id}`}>
              <CancelIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    );
  }
}

export default withNamespaces(['booking', 'datetime'])(BookingListItem);
