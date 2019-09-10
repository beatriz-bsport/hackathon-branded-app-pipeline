// @flow

import React, { PureComponent } from 'react';

import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Booking } from '../types';
// eslint-disable-next-line
import type { PaymentPack } from '../../../libs/payment-packs/types';

import BookingItemForManager from './BookingItemForManager.component';

type Props = {
  classes: Object,
  t: TFunction,

  loading: boolean,
  redirectToMember: ?boolean,
  redirectToOffer: ?boolean,
  showRevertBookingButton: boolean,
  showQuickInvoiceButton: boolean,
  heading: ?string,
  newTab: ?boolean, // how to open member

  sortedBy: ?string,
  bookings: Array<Object>,
  members: Array<Member>,
  paymentPacks: Array<PaymentPack>,

  onQuickInvoiceClick: (member: Member) => void,
  handleRevert: (booking: Booking) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
};

export class BookingTable extends PureComponent<Props> {
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
      bookings,
      confirmBookingAttendance,
      discardBookingAttendance,
      showQuickInvoiceButton,
      redirectToMember,
      redirectToOffer,
      newTab,
      showRevertBookingButton,
      handleRevert,
      onQuickInvoiceClick,
    } = this.props;
    if (loading || !bookings) {
      return <CircularProgress className={classes.contentWithMargin} />;
    }

    // prettier-ignore
    if (
      bookings.length === 0
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
            member={this.props.members.find((m) => m.id === b.member)}
            redirectToMember={redirectToMember}
            redirectToOffer={redirectToOffer}
            newTab={newTab}
            showQuickInvoiceButton={showQuickInvoiceButton}
            onQuickInvoiceClick={() => onQuickInvoiceClick(b.member)}
            key={b.id}
            heading={heading}
            booking={b}
            paymentPacks={this.props.paymentPacks}
            showRevertBookingButton={showRevertBookingButton}
            handleRevert={() => handleRevert(b)}
            discardBookingAttendance={() => discardBookingAttendance(b.id)}
            confirmBookingAttendance={() => confirmBookingAttendance(b.id)}
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

export default withStyles(styles)(withNamespaces()(BookingTable));
