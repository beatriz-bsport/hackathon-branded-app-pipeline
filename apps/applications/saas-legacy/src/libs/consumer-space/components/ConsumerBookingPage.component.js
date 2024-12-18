// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TodayIcon from '@material-ui/icons/Today';
import { DateTime } from 'luxon';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import { WidgetUtils } from '../../widget/WidgetUtils';

import BookingCancellationDialog from '../../booking/components/BookingCancellationDialog.component';
import BookingItemForManagerV2 from '../../booking/components/BookingItemForManagerV2.component';

import PrivateBookingListItem from '../../private-service/components/booking/PrivateBookingListItem.component';

import PaginatedListStateful from '../../../components/PaginatedListStateful.component';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import type { Membership } from '../../membership/types';
import type { Booking } from '../../booking/types';
import type { PrivateBooking } from '../../private-service/types';

const BOOKING_PAGE_SIZE = 10;

type Props = {
  t: TFunction,
  classes: Object,
  membership: Membership,

  setBookingToCancel: (booking: ?Booking) => void,
  bookingToCancel: ?Booking,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingsLoading: boolean,
  isMetaActivityLoading?: boolean,
  bookingCurrentPage: number,
  fetchBookingList: (member: number, page: number, page_size: number) => void,
  cancelBooking: (number, OptionCallback) => void,

  privateBookingsLoading: boolean,
  private_booking_list: Array<PrivateBooking>,
  goToCalendar: (string, number) => void,
  timezone: string,
  showVaccinationStatus: boolean,

  fetchSimilarFuturBookingInGroup: (
    bookingId: number,
    options: OptionCallback,
  ) => void,
  similarBookings: Booking[],
  fetchOfferBulk: (ids: number) => void,
  fetchCoachBulk: (ids: number) => void,
  resetGroupOffer: () => void,
  fetchGroupOffer: (id: number) => void,
  fetchMetaActivityBulk: (ids: number[]) => void,
  group: OffersGroup,
};

export const ConsumerBookingPage = (props: Props) => {
  const handleCancelBooking = (booking: Booking) => () => {
    if (booking?.offer?.group) {
      props.resetGroupOffer();
      props.fetchMetaActivityBulk([booking.meta_activity]);
      props.fetchGroupOffer(booking.offer.group);
      props.fetchSimilarFuturBookingInGroup(booking.id, {
        onSuccess: (data) => {
          props.fetchOfferBulk(Array.from(new Set(data?.map((b) => b.offer))));
          props.fetchCoachBulk(Array.from(new Set(data?.map((b) => b.coach))));
        },
      });
    }

    props.setBookingToCancel(booking);
  };

  return (
    <div>
      {!WidgetUtils.isWidget() && (
        <div className={props.classes.header}>
          <Button
            color="primary"
            onClick={() =>
              props.goToCalendar(
                props.membership.company_name,
                props.membership.company,
              )
            }
            variant="contained"
          >
            <TodayIcon className={props.classes.iconLeft} />
            {props.t('actions.goToCalendar')}
          </Button>
        </div>
      )}
      <Grid container direction="row" spacing={2}>
        <Grid item md={6} xs={12}>
          <Typography
            className={props.classes.title}
            component="h3"
            variant="h4"
          >
            {props.t('booking.titleBooking')}
          </Typography>
          <Divider className={props.classes.sectionDivider} />
          <Paper>
            <PaginatedListBase
              itemPerPage={BOOKING_PAGE_SIZE}
              items={props.bookings}
              listProps={{ disablePadding: true }}
              loading={props.bookingsLoading}
              nbItems={props.bookingCount}
              onPageRequested={(page, page_size) =>
                props.fetchBookingList(props.membership.id, page, page_size)
              }
              page={props.bookingCurrentPage}
              renderItem={(b) => (
                <BookingItemForManagerV2
                  key={b.id}
                  displayNoShowChip
                  booking={b}
                  disabled={b.booking_status_code !== BOOKING_STATUS_OK.id}
                  handleRevert={handleCancelBooking(b)}
                  heading="date_start"
                  isLoading={props.isMetaActivityLoading}
                  member={props.membership.id}
                  noShowChipMessage={props.t('booking.noShow')}
                  showRevertBookingButton={
                    b.booking_status_code === BOOKING_STATUS_OK.id &&
                    DateTime.fromISO(b.offer_date_start) > DateTime.now()
                  }
                  showVaccinationStatus={props.showVaccinationStatus}
                  timezone={props.timezone}
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography
            className={props.classes.title}
            component="h3"
            variant="h4"
          >
            {props.t('booking.titlePrivateBooking')}
          </Typography>
          <Divider className={props.classes.sectionDivider} />
          <Paper>
            <PaginatedListStateful
              itemPerPage={5}
              items={props.private_booking_list}
              listProps={{ disablePadding: true }}
              loading={props.privateBookingsLoading}
              renderItem={(b) => (
                <PrivateBookingListItem
                  key={b.id}
                  divider
                  private_booking={b}
                  timezone={props.timezone}
                />
              )}
            />
          </Paper>
        </Grid>
        <BookingCancellationDialog
          booking={props.bookingToCancel}
          group={props.group}
          onCancel={() => props.setBookingToCancel(null)}
          onSubmit={(options) =>
            props.cancelBooking(props.bookingToCancel.id, options)
          }
          open={props.bookingToCancel}
          similarBookings={props.similarBookings}
        />
      </Grid>
    </div>
  );
};

const styles = (theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  sectionDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    padding: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
  withState('bookingToCancel', 'setBookingToCancel', null),
  withHandlers({
    cancelBooking:
      ({ cancelBooking, setBookingToCancel }) =>
      (id, options) => {
        cancelBooking(id, null, {
          onSuccess: () => {
            setBookingToCancel(null);
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
  }),
)(ConsumerBookingPage);
