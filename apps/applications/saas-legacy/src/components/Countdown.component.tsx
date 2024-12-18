import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

interface CountdownProps {
  timeToShow: number;
  color?:
    | 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error';
}

const getHours = (s: number) => Math.floor(s / 3600);
const getMinutes = (s: number) => Math.floor((s % 3600) / 60);
const getSeconds = (s: number) => Math.floor((s % 3600) % 60);

const Countdown: React.FC<CountdownProps> = ({
  color = 'primary',
  timeToShow,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const hours: number = getHours(timeToShow);
  const minutes: number = getMinutes(timeToShow);
  const seconds: number = getSeconds(timeToShow);

  if (!seconds) return null;

  return (
    <div className={classes.countdownWrapper}>
      {hours !== null && (
        <div className={classes.countdownItem}>
          <Typography color={color} variant="h5">
            {hours}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {t('countdown.hours')}
          </Typography>
        </div>
      )}
      {minutes !== null && (
        <div className={classes.countdownItem}>
          <Typography color={color} variant="h5">
            {minutes}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {t('countdown.minutes')}
          </Typography>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
  },
}));

export default React.memo(Countdown);
