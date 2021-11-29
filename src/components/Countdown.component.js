// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

type Props = {
  timeToShow: string,
  classes: any,
  t: TFunction,
  color: ?string,
};

function getHours(s) {
  return Math.floor(s / 3600);
}
function getMinutes(s) {
  return Math.floor((s % 3600) / 60);
}
function getSeconds(s) {
  return Math.floor((s % 3600) % 60);
}

function Countdown(props: Props) {
  const { classes, t, timeToShow, color } = props;
  const hours = getHours(timeToShow);
  const minutes = getMinutes(timeToShow);
  const seconds = getSeconds(timeToShow);

  if (!seconds) return null;
  return (
    <div className={classes.countdownWrapper}>
      {hours !== null && (
        <div className={classes.countdownItem}>
          <Typography variant="h5" color={color}>
            {hours}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('countdown.hours')}
          </Typography>
        </div>
      )}
      {minutes !== null && (
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
export default withStyles(styles)(withTranslation()(Countdown));
