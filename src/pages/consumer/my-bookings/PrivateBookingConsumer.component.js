// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

type Props = {
  classes: Object,
  private_booking: PrivateBooking,
  t: TFunction,
};
export const PrivateBookingConsumer = (props: Props) => {
  const { private_booking, classes, t } = props;
  const dateStart = moment(private_booking.date_start);
  const dateEnd = moment(private_booking.date_end);
  return (
    <Paper className={classes.container}>
      <Typography variant="h6">{private_booking.name}</Typography>
      {private_booking.booking_status_code !== BOOKING_STATUS_OK.id ? (
        <Typography color="error" variant="h6">
          {t('privateBooking.isCancelled')}
        </Typography>
      ) : null}
      <Typography variant="subtitle">
        {dateStart.format('MMMM Do YYYY')}
      </Typography>
      <Typography variant="subtitle2">
        {`${dateStart.format('HH:mm')} - ${dateEnd.format('HH:mm')}`}
      </Typography>
      <div className={classes.addressContainer}>
        <LocationOnIcon className={classes.leftIcon} />
        <Typography color="textSecondary">{private_booking.address}</Typography>
      </div>
    </Paper>
  );
};

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  addressContainer: {
    display: 'flex',
    paddingTop: theme.spacing.unit,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateBookingConsumer);
