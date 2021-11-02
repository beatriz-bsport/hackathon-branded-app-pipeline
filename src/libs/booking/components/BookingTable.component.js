// @flow

import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Booking } from '../types';
// eslint-disable-next-line
import type { PaymentPack } from '../../../libs/payment-packs/types';

import BookingItemForManagerV2 from './BookingItemForManagerV2.component';
import { Member } from '../../member/types';
import { Tag, TagGroup } from '../../tag/types';

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

  bookings: Array<Object>,
  members: Array<Member<Tag<TagGroup>>>,

  onQuickInvoiceClick: (member: Member) => void,
  handleRevert: (booking: Booking) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  spotSchedulingEnabled?: boolean,
  onClickChangeSpot: (booking: Booking) => void,
  showVaccinationStatus: boolean,
};

export class BookingTable extends PureComponent<Props> {
  render() {
    const {
      t,
      classes,
      loading,
      heading,
      confirmBookingAttendance,
      discardBookingAttendance,
      showQuickInvoiceButton,
      redirectToMember,
      redirectToOffer,
      newTab,
      showRevertBookingButton,
      handleRevert,
      onQuickInvoiceClick,
      bookings,
      onClickChangeSpot,
    } = this.props;

    if (loading || !bookings) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress className={classes.contentWithMargin} />
        </div>
      );
    }

    // prettier-ignore
    if (
      bookings.length === 0 && !loading
    ) {
      return (
        <Typography variant="caption" className={classes.contentWithMargin}>
          {t('booking.noBookingOnThisOffer')}
        </Typography>
      );
    }
    return (
      <List disablePadding dense>
        {[
          ...bookings.filter((b) => b.booking_status_code === 0),
          ...bookings.filter((b) => b.booking_status_code !== 0),
        ].map((b) => (
          <BookingItemForManagerV2
            member={this.props.members.find((m) => m.id === b.member)}
            redirectToMember={redirectToMember}
            redirectToOffer={redirectToOffer}
            newTab={newTab}
            showQuickInvoiceButton={showQuickInvoiceButton}
            onQuickInvoiceClick={() => onQuickInvoiceClick(b.member)}
            key={b.id}
            heading={heading}
            booking={b}
            showRevertBookingButton={showRevertBookingButton}
            handleRevert={() => handleRevert(b)}
            discardBookingAttendance={() => discardBookingAttendance(b.id)}
            confirmBookingAttendance={() => confirmBookingAttendance(b.id)}
            spotSchedulingEnabled={this.props.spotSchedulingEnabled}
            onClickChangeSpot={onClickChangeSpot}
            showVaccinationStatus={this.props.showVaccinationStatus}
          />
        ))}
      </List>
    );
  }
}

const styles = (theme) => ({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentWithMargin: {
    margin: theme.spacing(3),
  },
});

export default withStyles(styles)(withTranslation()(BookingTable));
