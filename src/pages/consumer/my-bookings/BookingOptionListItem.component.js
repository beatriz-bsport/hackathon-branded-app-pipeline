// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';

import ActivityMinimalSummary from '../../../components/activity/ActivityMinimalSummary.component';
import RedButton from '../../../components/button/RedButton.component';
import { formatAsDatetime } from '../../../datetime';
import type { BookingOption } from '../../../api/types';

type Props = {
  confirmBookingOption: () => void,
  cancelBookingOption: () => void,
  bookingOption: BookingOption,
  loading: boolean,
  classes: Object,
  t: (x: string) => string,
};

export class BookingOptionListItem extends Component<Props> {
  renderConfirmButton = () => {
    const { t, confirmBookingOption } = this.props;
    return (
      <Button
        color="primary"
        onClick={confirmBookingOption}
        disabled={!this.props.bookingOption.is_convertible}
      >
        {this.props.bookingOption.is_convertible
          ? t('consumer.booking.confirmBooking')
          : t('consumer.booking.waitingSlot')}
      </Button>
    );
  };

  renderCancelButton = () => {
    const { t, cancelBookingOption } = this.props;
    return (
      <RedButton onClick={cancelBookingOption}>
        {t('consumer.booking.cancelOption')}
      </RedButton>
    );
  };

  renderButtons = () => {
    const { loading } = this.props;

    if (loading) {
      return (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={16}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-around"
      >
        <Grid item>
          <Grid container item alignItems="center" justify="center">
            {this.renderConfirmButton()}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container item alignItems="center" justify="center">
            {this.renderCancelButton()}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { bookingOption, classes } = this.props;
    const { offer, is_convertible } = bookingOption;
    const { activity } = offer;
    console.log('option:');
    console.log(bookingOption);
    return (
      <Paper>
        <Grid
          container
          alignItems="stretch"
          direction="column"
          className={is_convertible ? null : classes.disabled}
        >
          <Grid item xs={12}>
            {activity ? (
              <ActivityMinimalSummary
                noDivider
                activity={activity}
                date={formatAsDatetime(
                  offer.date_start,
                  offer && offer.activity && offer.activity.establishment
                    ? offer.activity.establishment.tzname
                    : 'Europe/Paris',
                )}
              />
            ) : (
              <CircularProgress />
            )}
          </Grid>
          <Divider />
          <Grid item xs={12}>
            {this.renderButtons()}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const styles = () => ({
  disabled: {
    backgroundColor: '#F5F5F5',
  },
});

export default withStyles(styles)(withNamespaces()(BookingOptionListItem));
