// @flow

import React, { Component } from 'react';
import {
  withStyles,
  Avatar,
  Button,
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import { translate } from 'react-i18next';

import RedButton from '../button/RedButton.component';
import { formatAsDatetime } from '../../datetime';

type Props = {
  t: (x: string) => string,
  classes: Object,
  heading: ?string,
  booking: Object,
  bookingUpdaters: {
    confirmBooking: () => void,
    discardBooking: () => void,
    confirmBookingAttendance: () => void,
    discardBookingAttendance: () => void,
  },
};

export class BookingItemForManager extends Component<Props> {
  getStatusStyleProps = (status: ?boolean) => {
    if (status) {
      return { color: 'primary' };
    }
    return {};
  };

  renderButton = () => {
    const { t, booking, bookingUpdaters } = this.props;
    const { confirmBooking, discardBooking } = bookingUpdaters;

    switch (booking.status) {
      case true:
        /*
            <Grid item>
              <Button variant="outlined" disabled color="primary">
                {t('booking.confirm')}
              </Button>
            </Grid>
            */
        return (
          <Grid container direction="row" spacing={16}>
            <Grid item>{this.getAttendance()}</Grid>
            <Grid item>
              <RedButton variant="outlined" disabled onClick={discardBooking}>
                {t('booking.discard')}
              </RedButton>
            </Grid>
          </Grid>
        );
      case false:
        // should never be reached via API but whatever
        return (
          <Grid container direction="row" spacing={16}>
            <Grid item>{this.getAttendance()}</Grid>
            <Grid item>
              <Button variant="outlined" disabled>
                {t('booking.confirm')}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" disabled>
                {t('booking.discard')}
              </Button>
            </Grid>
          </Grid>
        );
      default:
        return (
          <Grid container direction="row" spacing={16}>
            <Grid item>{this.getAttendance()}</Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={confirmBooking}
              >
                {t('booking.confirm')}
              </Button>
            </Grid>
            <Grid item>
              <RedButton variant="outlined" onClick={discardBooking}>
                {t('booking.discard')}
              </RedButton>
            </Grid>
          </Grid>
        );
    }
  };

  getStatusText = (status: ?boolean) => {
    const { t } = this.props;
    switch (status) {
      case true:
        return t('booking.validated');
      case false:
        return t('booking.cancelled');
      case null:
      default:
        return t('booking.pending');
    }
  };

  getAttendance = () => {
    const { t, booking, bookingUpdaters, classes } = this.props;

    if (booking.attendance) {
      return (
        <ListItemSecondaryAction>
          <Button
            color="primary"
            onClick={bookingUpdaters.discardBookingAttendance}
          >
            {t('booking.attend')}
            <CachedIcon className={classes.iconButton} />
          </Button>
        </ListItemSecondaryAction>
      );
    }
    return (
      <ListItemSecondaryAction>
        <RedButton onClick={bookingUpdaters.confirmBookingAttendance}>
          {t('booking.doNotAttend')}
          <CachedIcon className={classes.iconButton} />
        </RedButton>
      </ListItemSecondaryAction>
    );
  };

  getHeading = () => {
    const { heading, booking } = this.props;
    switch (heading) {
      case 'date_start':
        return formatAsDatetime(booking.date_start);
      default:
        return booking.user.name;
    }
  };

  getAvatar = () => {
    const { heading, booking } = this.props;
    switch (heading) {
      case 'date_start':
        return null;
      default:
        return <Avatar src={booking.user.photo} />;
    }
  };

  render() {
    const { booking } = this.props;
    // <TableCell>{t(`booking.sources.${b.source}`)}</TableCell>
    const statusText = this.getStatusText(booking.status);
    return (
      <ListItem disabled={!booking.attendance} divider>
        {this.getAvatar()}
        <ListItemText
          primary={this.getHeading()}
          secondary={statusText}
          secondaryTypographyProps={this.getStatusStyleProps(booking.status)}
        />
        {this.getAttendance()}
      </ListItem>
    );
  }
}

const styles = (theme) => ({
  iconButton: {
    marginLeft: theme.spacing.unit,
  },
});

export default translate()(withStyles(styles)(BookingItemForManager));
