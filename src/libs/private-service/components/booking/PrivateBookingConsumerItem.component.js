// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import Button from '@material-ui/core/Button';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

import NearMeIcon from '@material-ui/icons/NearMe';
import TodayIcon from '@material-ui/icons/Today';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

type Props = {
  t: TFunction,
  classes: Object,
  private_booking: PrivateBooking,
  goToCalendar: () => void,
};
export const PrivateBookingConsumerItem = (props: Props) => {
  const { private_booking, classes, t } = props;
  return (
    <div>
      <div className={classes.header}>
        <Typography variant="h5">{private_booking.name}</Typography>
      </div>
      <Divider />
      <ListItem dense className={classes.translucentPaper}>
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText
          primary={moment(private_booking.date_start).format('LL')}
          secondary={moment(private_booking.date_start).format('LT')}
        />
      </ListItem>
      {private_booking.address ? (
        <ListItem dense className={classes.translucentPaper}>
          <ListItemIcon>
            <NearMeIcon />
          </ListItemIcon>
          <ListItemText primary={private_booking.address} />
        </ListItem>
      ) : null}

      <Divider />
      <div className={classes.footer}>
        <Button onClick={props.goToCalendar} variant="outlined" color="primary">
          <TodayIcon className={classes.leftIcon} />
          {t('booking.showCalendar')}
        </Button>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {},
  largeAvatar: {
    width: theme.spacing.unit * 14,
    height: theme.spacing.unit * 14,
    marginBottom: -theme.spacing.unit * 4,
  },
  translucentPaper: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  header: {
    paddingLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['consumerSpace']),
  withStyles(styles),
)(PrivateBookingConsumerItem);
