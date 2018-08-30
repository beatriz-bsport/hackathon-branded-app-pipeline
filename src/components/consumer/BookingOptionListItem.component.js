import React, { Component } from 'react';

import {
Paper,
  Typography,
  Divider,
  Grid,
  Button,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';

const styles = (theme) => ({
  container: {},
  disabled: {
    backgroundColor: '#F5F5F5',
  },
});

type Props = {};

export class BookingOptionListItem extends Component<Props> {
  confirmOption = () => {};

  cancelOption = () => {};

  renderConfirmButton = () => {
    const { t } = this.props;
    return (
      <Button
        color="primary"
        onClick={this.confirmOption}
        disabled={!this.props.bookingOption.is_convertible}
      >
        {this.props.bookingOption.is_convertible
          ? t('booking.confirmBooking')
          : t('booking.waitingSlot')}
      </Button>
    );
  };

  renderCancelButton = () => {
    const { t } = this.props;
    return (
      <Button color="error" onClick={this.cancelOption}>
        <Typography color="error">{t('booking.cancelOption')}</Typography>
      </Button>
    );
  };

  render() {
    const { bookingOption, t, classes } = this.props;
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
          <Grid container direction="row" justify="space-around">
            <Grid item>{this.renderConfirmButton()}</Grid>
            <Grid item>{this.renderCancelButton()}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    );
  }
}

export default withStyles(styles)(translate()(BookingOptionListItem));
