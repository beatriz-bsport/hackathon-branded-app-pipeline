// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import BookingConsumerItem from '../../booking/components/BookingConsumerItem.component';
import PrivateBookingConsumerItem from '../../private-service/components/booking/PrivateBookingConsumerItem.component';

import type { Booking } from '../../booking/types';
import type { Membership } from '../../membership/types';
import type { PrivateBooking } from '../../private-service/types';

type Props = {
  t: TFunction,
  classes: Object,
  showMoreBooking: (page: ?number) => void,
  bookingList: Array<Booking>,
  bookingLoading: boolean,
  bookingCount: number,

  membership: Membership,
  goToBroadcast: (id: number) => void,

  privateBookingList: Array<PrivateBooking>,

  goToCalendar: (params: any) => void,
  push: (path: string) => void,

  onDiscardBooking: (?Booking) => void,
  onDiscardPrivateBooking: (id: number) => void,
};

const BookingFooter = (props: {
  count: number,
  loading: boolean,
  displayed: number,
  classes: Object,
  onShowMore: () => void,
  t: TFunction,
}) => {
  const nb = props.count - props.displayed;
  if (props.loading) {
    return (
      <div className={props.classes.footerButton}>
        <CircularProgress />
      </div>
    );
  }
  if (nb) {
    return (
      <div className={props.classes.footerButton}>
        <Button onClick={() => props.onShowMore()} variant="outlined">
          {props.t('dashboard.showMore', { nb })}
        </Button>
      </div>
    );
  }
  return null;
};

export class ConsumerDashboardBookingPanel extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        <Typography
          variant="h4"
          component="h3"
          className={this.props.classes.sectionTitle}
          color="textSecondary"
        >
          {this.props.t('dashboard.nextBookingTitle', {
            nb: this.props.privateBookingList.length + this.props.bookingCount,
          })}
        </Typography>
        {this.props.privateBookingList.length === 0 &&
        this.props.bookingList.length === 0 &&
        !this.props.bookingLoading ? (
          <Typography variant="caption" color="textSecondary">
            {this.props.t('dashboard.noBooking')}
          </Typography>
        ) : null}
        {this.props.privateBookingList.map((b) => (
          <PrivateBookingConsumerItem
            onDiscard={this.props.onDiscardPrivateBooking}
            goToCalendar={() =>
              this.props.push(
                `/m/${this.props.membership.company_name}/${this.props.membership.company}/private-service/`,
              )
            }
            private_booking={b}
            key={b.id}
          />
        ))}
        {this.props.bookingList.map((b) => (
          <BookingConsumerItem
            booking={b}
            key={b.id}
            goToBroadcast={() => this.props.goToBroadcast(b.id)}
            onDiscard={() => this.props.onDiscardBooking(b)}
            goToCalendar={() =>
              this.props.goToCalendar({
                f_metaActivities: `[${b.offer.meta_activity.id}]`,
                f_establishments: `[${b.offer.establishment.id}]`,
                f_coaches: `[${b.offer.coach.id}]`,
              })
            }
          />
        ))}
        <BookingFooter
          t={this.props.t}
          classes={this.props.classes}
          displayed={this.props.bookingList.length}
          count={this.props.bookingCount}
          loading={this.props.bookingLoading}
          onShowMore={this.props.showMoreBooking}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  footerButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
  },
});

export default compose(
  withNamespaces(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardBookingPanel);
