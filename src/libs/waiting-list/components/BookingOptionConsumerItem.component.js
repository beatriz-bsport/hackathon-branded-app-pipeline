// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';

import ActivityMinimalSummary from '../../../components/activity/ActivityMinimalSummary.component';
import RedButton from '../../../components/button/RedButton.component';
import { formatAsDatetime } from '../../../utils/datetime';
import type { BookingOption } from '../../../api/types';

type Props = {
  confirmBookingOption: () => void,
  cancelBookingOption: () => void,
  bookingOption: BookingOption,
  loading: boolean,
  classes: Object,
  t: (x: string) => string,
};

export class BookingOptionConsumerItem extends Component<Props> {
  renderButtons = () => {
    if (this.props.loading) {
      return (
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          spacing={2}
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
        alignItems="center"
        direction="row"
        justify="space-around"
      >
        <Grid item>
          <Grid container item alignItems="center" justify="center">
            <Button
              color="primary"
              disabled={!this.props.bookingOption.is_convertible}
              onClick={this.props.confirmBookingOption}
            >
              {this.props.bookingOption.is_convertible
                ? this.props.t('consumer.booking.confirmBooking')
                : this.props.t('consumer.booking.waitingSlot')}
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container item alignItems="center" justify="center">
            <RedButton onClick={this.props.cancelBookingOption}>
              {this.props.t('consumer.booking.cancelOption')}
            </RedButton>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { bookingOption, classes } = this.props;
    const { offer, is_convertible } = bookingOption;
    const { activity } = offer;
    return (
      <Paper>
        <Grid
          container
          alignItems="stretch"
          className={is_convertible ? null : classes.disabled}
          direction="column"
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

export default withStyles(styles)(withTranslation()(BookingOptionConsumerItem));
