// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TodayIcon from '@material-ui/icons/Today';
import moment from 'moment-timezone';

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

  setBookingToCancel: (?Booking) => void,
  bookingToCancel: ?Booking,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingsLoading: boolean,
  bookingCurrentPage: number,
  fetchBookingList: (member: number, page: number, page_size: number) => void,
  cancelBooking: (number, OptionCallback) => void,

  privateBookingsLoading: boolean,
  private_booking_list: Array<PrivateBooking>,
  goToCalendar: (string, number) => void,
  timezone: string,
};

export const ConsumerBookingPage = (props: Props) => (
  <div>
    {!WidgetUtils.isWidget() && (
      <div className={props.classes.header}>
        <Button
          onClick={() =>
            props.goToCalendar(
              props.membership.company_name,
              props.membership.company,
            )
          }
          color="primary"
          variant="contained"
        >
          <TodayIcon className={props.classes.iconLeft} />
          {props.t('actions.goToCalendar')}
        </Button>
      </div>
    )}
    <Grid container direction="row" spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" component="h3">
          {props.t('booking.titleBooking')}
        </Typography>
        <Divider className={props.classes.sectionDivider} />
        <Paper>
          <PaginatedListBase
            itemPerPage={BOOKING_PAGE_SIZE}
            loading={props.bookingsLoading}
            listProps={{ disablePadding: true }}
            items={props.bookings}
            nbItems={props.bookingCount}
            page={props.bookingCurrentPage}
            onPageRequested={(page, page_size) =>
              props.fetchBookingList(props.membership.id, page, page_size)
            }
            renderItem={(b) => (
              <BookingItemForManagerV2
                showRevertBookingButton={
                  b.booking_status_code === BOOKING_STATUS_OK.id &&
                  moment(b.offer_date_start).isAfter(moment())
                }
                disabled={b.booking_status_code !== BOOKING_STATUS_OK.id}
                key={b.id}
                booking={b}
                timezone={props.timezone}
                heading="date_start"
                member={props.membership.id}
                handleRevert={() => props.setBookingToCancel(b)}
              />
            )}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" component="h3">
          {props.t('booking.titlePrivateBooking')}
        </Typography>
        <Divider className={props.classes.sectionDivider} />
        <Paper>
          <PaginatedListStateful
            itemPerPage={5}
            loading={props.privateBookingsLoading}
            listProps={{ disablePadding: true }}
            items={props.private_booking_list}
            renderItem={(b) => (
              <PrivateBookingListItem
                timezone={props.timezone}
                divider
                key={b.id}
                private_booking={b}
              />
            )}
          />
        </Paper>
      </Grid>
      <BookingCancellationDialog
        open={props.bookingToCancel}
        booking={props.bookingToCancel}
        onCancel={() => props.setBookingToCancel(null)}
        onSubmit={(options) =>
          props.cancelBooking(props.bookingToCancel.id, options)
        }
      />
    </Grid>
  </div>
);

const styles = (theme) => ({
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
    cancelBooking: ({ cancelBooking, setBookingToCancel }) => (id, options) => {
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
