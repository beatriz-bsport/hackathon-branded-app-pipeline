// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { Moment } from '../i18n';

type Props = {
  timeTillDate: string,
  classes: any,
  t: TFunction,
  currentTime: Moment,
  color: ?string,
};

function Countdown(props: Props) {
  const { classes, t, timeTillDate, currentTime, color } = props;
  let duration: string;
  const then = Moment(timeTillDate);
  const now = Moment(currentTime);
  if (then.isAfter(now)) duration = Moment(then.diff(now)).format('HH:mm:ss');
  else duration = Moment(now.diff(then)).format('HH:mm:ss');
  const timeParts = duration.split(':');
  const hours = timeParts[0];
  const minutes = timeParts[1];
  const seconds = timeParts[2];

  if (!seconds) return null;
  return (
    <div className={classes.countdownWrapper}>
      {hours && (
        <div className={classes.countdownItem}>
          <Typography variant="h5" color={color}>
            {hours}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('countdown.hours')}
          </Typography>
        </div>
      )}
      {minutes && (
        <div className={classes.countdownItem}>
          <Typography variant="h5" color={color}>
            {minutes}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('countdown.minutes')}
          </Typography>
        </div>
      )}
    </div>
  );
}

const styles = (theme) => {
  return {
    countdownWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    countdownItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: theme.spacing(1),
      position: 'relative',
      width: theme.spacing(8),
      height: theme.spacing(6),
      // border: `2px solid ${theme.palette.grey[200]}`,
      // borderRadius: '4px',
      // color: `${theme.palette.primary.main}`,
    },
  };
};
export default withStyles(styles)(withNamespaces()(Countdown));
