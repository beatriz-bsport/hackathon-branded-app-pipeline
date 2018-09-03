import React, { Component } from 'react';

import {
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  CircularProgress,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';
import RedButton from '../button/RedButton.component';

const styles = () => ({
  container: {},
  disabled: {
    backgroundColor: '#F5F5F5',
  },
});

type Props = {};

export class BookingOptionListItem extends Component<Props> {
  static defaultProps = {
    cancelBookingOption: () => {},
    confirmBookingOption: () => {},
    loading: false,
  };

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
    return (
      <Paper>
        <Grid
          container
          alignItems="stretch"
          direction="column"
          className={is_convertible ? null : classes.disabled}
        >
          <Grid item xs={12}>
            <ActivityMinimalSummary
              noDivider
              activity={activity}
              date={offer.date_start}
            />
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

export default withStyles(styles)(translate()(BookingOptionListItem));
