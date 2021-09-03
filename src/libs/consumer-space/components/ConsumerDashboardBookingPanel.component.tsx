import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Divider from '@material-ui/core/Divider';

// @ts-ignore
import BookingConsumerItem from '../../booking/components/BookingConsumerItem.component';
// @ts-ignore
import PrivateBookingConsumerItem from '../../private-service/components/booking/PrivateBookingConsumerItem.component';

import type { Booking } from '../../booking/types';
import type { Membership } from '../../membership/types';
import { BookingOrPrivateBooking } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { PrivateBooking } from '../../private-service/types';
import { Offer } from '../../offer/types';
import { Coach } from '../../associated-coach/types';
import { Establishment } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';

type OwnProps = {
  showMoreBooking: () => void;
  membership: Membership;
  goToBroadcast?: (id: number) => void;
  goToCalendar?: (
    params: {
      f_metaActivities: string;
      f_establishments: string;
      f_coaches: string;
    },
    metaActivityId: number,
  ) => void;
  goToPrivateService?: () => void;
  onDiscardBooking: (booking: Booking) => void;
  onDiscardPrivateBooking: (privateBooking: PrivateBooking) => void;
  timezone: string;
  bookingsAndPrivateBookings: BookingOrPrivateBooking[];
  loading: boolean;
  hasMore: boolean;
  hideCoach: boolean;
  fullWidth?: boolean;
  hideTitle?: boolean;
  onClickBlueprintPreview?: (
    booking: Booking<Offer<Coach, Establishment, MetaActivity>>,
  ) => void;
};

type Props = OwnProps &
  WithTranslation &
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
  goToCalendar = (booking: Booking) => {
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
      if (!this.props.hideCoach) {
        calendarFilters.f_coaches = `[${booking.offer.coach.id}]`;
      }
    }

    this.props.goToCalendar(calendarFilters, booking.meta_activity);
  };

  renderBookingOrPrivateBooking = (
    bookingOrPrivateBooking: BookingOrPrivateBooking,
  ) => {
    if (
      bookingOrPrivateBooking.type === 'booking' &&
      bookingOrPrivateBooking.booking
    ) {
      const { booking } = bookingOrPrivateBooking;
      return (
        <div className={this.props.classes.marginTop}>
          <BookingConsumerItem
            key={`booking-${booking.id}`}
            timezone={this.props.timezone}
            booking={booking}
            hideCoach={this.props.hideCoach}
            onDiscard={this.props.onDiscardBooking}
            goToBroadcast={this.props.goToBroadcast}
            goToCalendar={this.props.goToCalendar ? this.goToCalendar : null}
            onClickBlueprintPreview={this.props.onClickBlueprintPreview}
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
            goToCalendar={this.props.goToPrivateService}
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
      <div className={this.props.classes.container}>
        {this.props.hideTitle !== true && (
          <>
            <Typography
              variant="h4"
              component="h3"
              className={this.props.classes.sectionTitle}
              color="textSecondary"
            >
              {this.props.t('dashboard.nextBookingTitle')}
            </Typography>
            <Divider className={this.props.classes.divider} />
          </>
        )}
        {!this.props.bookingsAndPrivateBookings.length &&
        !this.props.loading ? (
          <div className={this.props.classes.noBookingsContainer}>
            <InfoOutlinedIcon fontSize="large" />
            <Typography color="textSecondary">
              {this.props.isPast
                ? this.props.t('widget.noBookingPast')
                : this.props.t('widget.noBookingFuture')}
            </Typography>
          </div>
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
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  fullWidth: {
    width: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
  },
  noBookingsContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    '&>*': {
      margin: theme.spacing(1),
    },
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardBookingPanel);
