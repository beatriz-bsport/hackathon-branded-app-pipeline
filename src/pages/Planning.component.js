// @flow

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { withStyles, Paper, Grid, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';

import { OfferCard, TimeTable, Calendar } from '../components';
import { booking as bookingActions } from '../actions';
import { Moment } from '../i18n';
import { Offer } from '../api/types';

const styles = (theme) => ({
  calendarContainer: {
    padding: theme.spacing.unit * 2,
  },
  emptyOffer: {
    margin: theme.spacing.unit * 3,
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
  discardOption: (id: number) => void,
  discardBooking: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBooking: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  fetchBookings: (id: number) => void,
  offers: Array<Offer>,
  bookingLoading: boolean,
  validatedBookings: Array<Object>,
  pendingBookings: Array<Object>,
  bookingOptions: Array<Object>,
  timetableLoading: boolean,
  activities: Array<Object>,
};

type State = {
  selectedOffer: ?number,
  date: Object,
};

export class Planning extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedOffer: null,
      date: Moment()
        .set('hours', 0)
        .set('minutes', 0)
        .set('milliseconds', 0),
    };
  }

  onDateClick = (date: Object) => {
    this.setState({ date });
    this.setState({ selectedOffer: null });
  };

  onOfferSelected = (offer: Offer) => {
    this.setState({ selectedOffer: offer });
    this.props.fetchBookings(offer.id);
  };

  renderNoOfferSelected = () => {
    const { t, classes } = this.props;
    return (
      <Typography variant="caption" className={classes.emptyOffer}>
        {t('calendar.pleaseSelectOffer')}
      </Typography>
    );
  };

  render() {
    const {
      offers,
      classes,
      pendingBookings,
      validatedBookings,
      bookingOptions,
      bookingLoading,
      discardOption,
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
      activities,
      timetableLoading,
    } = this.props;
    const { date, selectedOffer } = this.state;

    const events = {};
    offers.forEach((o) => {
      const midnight = Moment(o.date_start).startOf('day');
      if (!events[midnight]) {
        events[midnight] = [];
      }
      events[midnight].push(o);
    });

    const bookingUpdaters = {
      discardBooking,
      confirmBooking,
      discardBookingAttendance,
      confirmBookingAttendance,
    };

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <Grid container>
              <Grid item xs={12}>
                <div className={classes.calendarContainer}>
                  <Calendar events={events} onDateClick={this.onDateClick} />
                </div>
              </Grid>
              <Grid item xs={12}>
                <TimeTable
                  date={date}
                  onOfferSelected={this.onOfferSelected}
                  offers={offers}
                  activities={activities}
                  laoding={timetableLoading}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {selectedOffer ? (
          <Grid item xs={12} lg={6}>
            <OfferCard
              offer={selectedOffer}
              pendingBookings={pendingBookings}
              validatedBookings={validatedBookings}
              bookingOptions={bookingOptions}
              bookingLoading={bookingLoading}
              bookingUpdaters={bookingUpdaters}
              discardOption={discardOption}
            />
          </Grid>
        ) : (
          this.renderNoOfferSelected()
        )}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.calendar,
    timetableLoading: state.activity.loading,
    activities: state.activity.all,
    bookingLoading: state.booking.loading,
    validatedBookings: state.booking.validated,
    pendingBookings: state.booking.pending,
    bookingOptions: state.booking.options,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBookings(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
    },
    confirmBookingAttendance(bookingId) {
      dispatch(bookingActions.confirmBookingAttendance(bookingId));
    },
    discardBookingAttendance(bookingId) {
      dispatch(bookingActions.discardBookingAttendance(bookingId));
    },
    confirmBooking(bookingId) {
      dispatch(bookingActions.confirmBooking(bookingId));
    },
    discardBooking(bookingId) {
      dispatch(bookingActions.discardBooking(bookingId));
    },
    discardOption(optionId) {
      dispatch(bookingActions.discardBookingOption(optionId));
    },
  };
}

export default translate()(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(withStyles(styles)(Planning)),
  ),
);
