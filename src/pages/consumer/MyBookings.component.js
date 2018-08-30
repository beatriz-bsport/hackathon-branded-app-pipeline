import React, { Component } from 'react';

import {
  Divider,
  Paper,
  Grid,
  List,
  Typography,
  CircularProgress,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { BookingListItem, BookingOptionListItem } from '../../components';

const styles = (theme) => ({
  container: {},
  title: {
    margin: theme.spacing.unit * 2,
  },
  emptyMsg: {
    padding: theme.spacing.unit * 2,
  },
  loadingContainer: {
    margin: theme.spacing.unit * 3,
  },
  bookingOptionElement: {
    marginBottom: theme.spacing.unit,
  },
});

type Props = {
  futureBookings: Array,
  pastBookings: Array,
  bookingOptions: Array,
};

export class MyBookings extends Component<Props> {
  renderLoading = () => {
    const { classes } = this.props;
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        className={classes.loadingContainer}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  };

  renderFutureBookings = () => {
    const { t, classes, futureBookings, loadingBooking } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="title">
          {t('booking.myFutureBookings')}
        </Typography>
        <Paper>
          {futureBookings.length ? (
            <List>
              {futureBookings.map((b) => <BookingListItem booking={b} />)}
            </List>
          ) : (
            <Typography variant="caption" className={classes.emptyMsg}>
              {t('booking.noBookingOptions')}
            </Typography>
          )}
        </Paper>
      </div>
    );
  };

  renderBookingOptions = () => {
    const { t, classes, loadingOption, bookingOptions } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="title">
          {t('booking.myOptions')}
        </Typography>
        {bookingOptions.length ? (
          <List>
            {bookingOptions.map((o) => (
              <div className={classes.bookingOptionElement}>
                <BookingOptionListItem bookingOption={o} />
                <Divider />
              </div>
            ))}
          </List>
        ) : (
          <Typography variant="caption" className={classes.emptyMsg}>
            {t('booking.noBookingOptions')}
          </Typography>
        )}
      </div>
    );
  };

  renderPastBookings = () => {
    const { t, classes, loadingBooking, pastBookings } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="title">
          {t('booking.myPastBookings')}
        </Typography>
        <Paper>
          {pastBookings.length ? (
            <List>
              {pastBookings.map((b) => <BookingListItem booking={b} />)}
            </List>
          ) : (
            <Typography variant="caption" className={classes.emptyMsg}>
              {t('booking.noPastBookings')}
            </Typography>
          )}
        </Paper>
      </div>
    );
  };

  render() {
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12} lg={6}>
          {this.renderFutureBookings()}
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.renderBookingOptions()}
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.renderPastBookings()}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    bookingOptions: state.consumer.bookingOptions,
    futureBookings: state.consumer.futureBookings,
    pastBookings: state.consumer.pastBookings,
    loadingBooking: state.consumer.bookingsLoading,
    loadingOption: state.consumer.optionsLoading,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(MyBookings)),
);
