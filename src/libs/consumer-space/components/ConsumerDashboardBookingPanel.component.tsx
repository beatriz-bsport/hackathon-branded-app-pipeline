import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme } from '@material-ui/core';

// @ts-ignore
import BookingConsumerItem from '../../booking/components/BookingConsumerItem.component';
// @ts-ignore
import PrivateBookingConsumerItem from '../../private-service/components/booking/PrivateBookingConsumerItem.component';

import type { Booking } from '../../booking/types';
import type { Membership } from '../../membership/types';
import { urlToMarketplace } from '../../marketplace/utils';
import { BookingOrPrivateBooking } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type Props = {
  classes: Object;
  showMoreBooking: (page?: number) => void;
  membership: Membership;
  goToBroadcast: (id: number) => void;

  goToCalendar: (params: any) => void;
  push: (path: string) => void;

  onDiscardBooking: (booking?: Booking) => void;
  onDiscardPrivateBooking: (id: number) => void;
  timezone: string;
  bookingsAndPrivateBookings: BookingOrPrivateBooking[];
  loading: boolean;
  hasMore: boolean;
} & WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const BookingFooter = (props: {
  loading: boolean;
  hasMore: boolean;
  classes: any;
  onShowMore: () => void;
  t: TFunction;
}) => {
  if (props.loading) {
    return (
      <div className={props.classes.footerButton}>
        <CircularProgress />
      </div>
    );
  }
  if (props.hasMore) {
    return (
      <div className={props.classes.footerButton}>
        <Button onClick={() => props.onShowMore()} variant="outlined">
          {props.t('dashboard.showMore')}
        </Button>
      </div>
    );
  }
  return null;
};

export class ConsumerDashboardBookingPanel extends React.PureComponent<Props> {
  renderBookingOrPrivateBooking = (
    bookingOrPrivateBooking: BookingOrPrivateBooking,
  ) => {
    if (
      bookingOrPrivateBooking.type === 'booking' &&
      bookingOrPrivateBooking.booking
    ) {
      const { booking } = bookingOrPrivateBooking;

      const calendarFilters = {
        f_metaActivities: `[]`,
        f_establishments: `[]`,
        f_coaches: `[]`,
      };

      if (booking.offer) {
        // @ts-ignore
        calendarFilters.f_metaActivities = `[${booking.offer.meta_activity.id}]`;
        // @ts-ignore
        calendarFilters.f_establishments = `[${booking.offer.establishment.id}]`;
        // @ts-ignore
        calendarFilters.f_coaches = `[${booking.offer.coach.id}]`;
      }

      return (
        <div className={this.props.classes.marginTop}>
          <BookingConsumerItem
            key={`booking-${booking.id}`}
            timezone={this.props.timezone}
            booking={booking}
            goToBroadcast={() => this.props.goToBroadcast(booking.id)}
            onDiscard={() => this.props.onDiscardBooking(booking)}
            goToCalendar={() => this.props.goToCalendar(calendarFilters)}
          />
        </div>
      );
    }

    if (
      bookingOrPrivateBooking.type === 'privateBooking' &&
      bookingOrPrivateBooking.privateBooking
    ) {
      const { privateBooking } = bookingOrPrivateBooking;
      return (
        <div className={this.props.classes.marginTop}>
          <PrivateBookingConsumerItem
            key={`private-${privateBooking.id}`}
            onDiscard={this.props.onDiscardPrivateBooking}
            goToCalendar={() =>
              this.props.push(
                `${urlToMarketplace(
                  this.props.membership.company_name,
                  this.props.membership.company.toString(),
                )}/private-service/`,
              )
            }
            private_booking={privateBooking}
            timezone={this.props.timezone}
          />
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <Typography
          variant="h4"
          component="h3"
          className={this.props.classes.sectionTitle}
          color="textSecondary"
        >
          {this.props.t('dashboard.nextBookingTitle')}
        </Typography>
        {this.props.bookingsAndPrivateBookings.length === 0 &&
        !this.props.loading ? (
          <Typography variant="caption" color="textSecondary">
            {this.props.t('dashboard.noBooking')}
          </Typography>
        ) : null}

        {this.props.bookingsAndPrivateBookings.map(
          this.renderBookingOrPrivateBooking,
        )}

        <BookingFooter
          t={this.props.t}
          classes={this.props.classes}
          hasMore={this.props.hasMore}
          loading={this.props.loading}
          onShowMore={this.props.showMoreBooking}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  footerButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
});

export default compose<any, Props>(
  withTranslation(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardBookingPanel);
