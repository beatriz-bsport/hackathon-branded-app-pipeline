// @flow

import React, { Component } from 'react';

import {
  Typography,
  withStyles,
  List,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import type { Member, Booking, PaymentPack, Invoice } from '../../api/types';

import BookingItemForManager from './BookingItemForManager.component';
import BookingOptionForManager from './BookingOptionForManager.component';

type Props = {
  classes: Object,
  t: (x: string) => string,

  loading: boolean,
  redirectToMember: ?boolean,
  showRevertBookingButton: boolean,
  showQuickInvoiceButton: boolean,
  heading: ?string,

  sortedBy: ?string,
  bookings: Array<Object>,
  bookingOptions: Array<Object>,
  invoices: Array<Invoice>,
  paymentPacks: Array<PaymentPack>,

  discardOption: (id: number) => void,
  onQuickInvoiceClick: (member: Member) => void,
  handleRevert: (booking: Booking) => void,
  requestRefreshPaymentPack: () => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
};

export class BookingTable extends Component<Props> {
  sortBookings = () => {
    const { sortedBy, bookings } = this.props;

    if (sortedBy === 'name') {
      // i hate js so much
      const s = bookings.asMutable();
      return s.sort((a, b) => (a.user.name > b.user.name ? 1 : -1));
    }
    return bookings;
  };

  render() {
    const {
      t,
      classes,
      loading,
      heading,
      bookingOptions,
      bookings,
      discardOption,
      confirmBookingAttendance,
      discardBookingAttendance,
      showQuickInvoiceButton,
      redirectToMember,
      showRevertBookingButton,
      handleRevert,
      onQuickInvoiceClick,
      requestRefreshPaymentPack,
    } = this.props;

    if (loading || !bookings) {
      return <CircularProgress className={classes.contentWithMargin} />;
    }

    // prettier-ignore
    if (
      bookings.length === 0
      && bookingOptions.length === 0
    ) {
      return (
        <Typography variant="caption" className={classes.contentWithMargin}>
          {t('booking.noBookingOnThisOffer')}
        </Typography>
      );
      }

    const sortedBookings = this.sortBookings();

    return (
      <List disablePadding dense>
        {sortedBookings.map((b) => (
          <BookingItemForManager
            redirectToMember={redirectToMember}
            showQuickInvoiceButton={showQuickInvoiceButton}
            onQuickInvoiceClick={() => onQuickInvoiceClick(b.member)}
            requestRefreshPaymentPack={requestRefreshPaymentPack}
            key={b.id}
            heading={heading}
            booking={b}
            invoices={this.props.invoices}
            paymentPacks={this.props.paymentPacks}
            showRevertBookingButton={showRevertBookingButton}
            handleRevert={() => handleRevert(b)}
            discardBookingAttendance={() => discardBookingAttendance(b.id)}
            confirmBookingAttendance={() => confirmBookingAttendance(b.id)}
          />
        ))}
        {bookingOptions.map((bo) => (
          <BookingOptionForManager
            heading={heading}
            option={bo}
            key={bo.id}
            discardOption={() => discardOption(bo.id)}
          />
        ))}
      </List>
    );
  }
}
const styles = (theme) => ({
  contentWithMargin: {
    margin: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(translate()(BookingTable));
