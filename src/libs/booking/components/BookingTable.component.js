// @flow
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, TFunction } from 'react-i18next';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import type { Booking } from '#src/libs/booking/types';

import BookingItemForManagerV2 from '#src/libs/booking/components/BookingItemForManagerV2.component';
import { Member } from '#src/libs/member/types';
import { Tag, TagGroup } from '#src/libs/tag/types';
import type { PerformanceTrackingProgram } from '#src/libs/performance-tracking/types';
import ObjectLevelPermissionProvider from '../../role/permission-utils/ObjectLevelPermissionProvider.component';

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
  programList: Array<PerformanceTrackingProgram>,
  refresh: () => void,
  onProgramDetailsClick: (member?: Member, booking?: Booking) => void,
  dateRollCallLastModified?: string,
  onClickWarningIcon: () => void,
  onClickNoShowChip: () => void,
  isRollCallMandatory: boolean,
  getBookingOffer?: (offerId: number) => Offer,
  getOfferMetaActivity: (metaActivityId: number) => MetaActivity,
  handleOpenRefundBookingDialog?: (id: number) => void,
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
      members,
      onClickChangeSpot,
      onProgramDetailsClick,
      getBookingOffer,
      getOfferMetaActivity,
      handleOpenRefundBookingDialog,
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
        <Typography className={classes.contentWithMargin} variant="caption">
          {t('booking.noBookingOnThisOffer')}
        </Typography>
      );
    }
    const membersWithStatusOk = bookings
      .filter((b) => b.booking_status_code === BOOKING_STATUS_OK.id)
      .map((b) => members.find((m) => m.id === b.member));

    return (
      <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.createInvoice">
        {(hasCreateInvoicePermission) => (
          <List dense disablePadding>
            {[
              ...bookings.filter((b) => b.booking_status_code === 0),
              ...bookings.filter((b) => b.booking_status_code !== 0),
            ].map((b) => (
              <BookingItemForManagerV2
                key={b.id}
                displayNoShowChip
                booking={b}
                bookings={bookings}
                confirmBookingAttendance={() => confirmBookingAttendance(b.id)}
                dateRollCallLastModified={this.props.dateRollCallLastModified}
                discardBookingAttendance={() => discardBookingAttendance(b.id)}
                getBookingOffer={getBookingOffer}
                getOfferMetaActivity={getOfferMetaActivity}
                handleOpenRefundBookingDialog={
                  this.props.handleOpenRefundBookingDialog
                }
                handleRevert={() => {
                  handleRevert(b);
                  this.props.refresh();
                }}
                heading={heading}
                isRollCallMandatory={this.props.isRollCallMandatory}
                member={this.props.members.find((m) => m.id === b.member)}
                membersWithStatusOk={membersWithStatusOk}
                newTab={newTab}
                noShowChipMessage={this.props.t('booking:noShowChip.message')}
                onClickChangeSpot={onClickChangeSpot}
                onClickNoShowChip={this.props.onClickNoShowChip}
                onClickWarningIcon={this.props.onClickWarningIcon}
                onProgramDetailsClick={onProgramDetailsClick}
                onQuickInvoiceClick={
                  hasCreateInvoicePermission &&
                  (() => onQuickInvoiceClick(b.member))
                }
                programList={this.props.programList}
                redirectToMember={redirectToMember}
                redirectToOffer={redirectToOffer}
                showQuickInvoiceButton={
                  hasCreateInvoicePermission && showQuickInvoiceButton
                }
                showRevertBookingButton={showRevertBookingButton}
                showVaccinationStatus={this.props.showVaccinationStatus}
                spotSchedulingEnabled={this.props.spotSchedulingEnabled}
              />
            ))}
          </List>
        )}
      </ObjectLevelPermissionProvider>
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
