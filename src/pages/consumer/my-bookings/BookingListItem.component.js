// @flow
import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import {
  IconButton,
  Avatar,
  Tooltip,
  ListItem,
  withStyles,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import type { TFunction } from 'react-i18next';
import { humanizeDuration, formatAsDatetime } from '../../../datetime';
import type { Booking } from '../../../api/types';
import { getBookingStatusCode } from '../../../components/booking/Booking.utils';

type Props = {
  booking: Booking,
  overrideClickAction: () => void,
  onDiscard: () => void,
  classes: Object,
  t: TFunction,
};

export class BookingListItem extends Component<Props> {
  getFullStatus = () => {
    const { t, booking } = this.props;
    const { offer } = booking;

    const formattedDate = `${formatAsDatetime(
      offer.date_start,
    )} - ${humanizeDuration(offer.duration_minute * 60000)}`;
    const bookingStatusCode = getBookingStatusCode(t, booking);
    const bookingRefund = booking.was_refunded
      ? `${t('booking.wasRefunded')}: `
      : '';
    const offerAvailable = booking.offer.available
      ? ''
      : `${t('booking.cancelled')}: `;

    return `${offerAvailable}${formattedDate} ${bookingRefund} ${bookingStatusCode}`;
  };

  render() {
    const { booking, overrideClickAction, onDiscard, classes } = this.props;
    const { offer } = booking;
    const { activity } = offer;
    const coach = offer.coach_substitute
      ? offer.coach_substitute
      : offer.activity.coach;
    return (
      <ListItem
        key={booking.id}
        dense
        button
        onClick={overrideClickAction || (() => {})}
        className={classes.listItem}
      >
        {coach.photo ? (
          <Tooltip title={coach.name}>
            <Avatar src={coach.photo} />
          </Tooltip>
        ) : null}
        <ListItemText
          primary={activity.name}
          secondary={this.getFullStatus()}
          secondaryTypographyProps={offer.available ? {} : { color: 'error' }}
        />
        {onDiscard && !booking.was_refunded ? (
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

const styles = () => ({
  listItem: {},
});

export default withStyles(styles)(withNamespaces()(BookingListItem));
