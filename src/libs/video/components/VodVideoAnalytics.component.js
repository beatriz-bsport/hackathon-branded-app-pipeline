// @flow
import React from 'react';
import moment from 'moment-timezone';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';

type Props = {
  loading: boolean,
  data: {
    nb_views_total: number,
    nb_views_last_week: number,
    nb_distinct_viewers: number,
  },
  videoDateCreated: string | null,
};

const VodVideoAnalytics = (props: Props) => {
  const { t } = useTranslation(['video']);
  const classes = useStyles();
  if (props.loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress disableShrink />
      </div>
    );
  }
  return (
    <Paper className={classes.container}>
      {props.videoDateCreated && (
        <Typography
          variant="body2"
          className={classes.uploaded}
          align="center"
          component="p"
        >
          {t('video.analytics.uploaded', {
            date: moment(props.videoDateCreated).format('LL'),
          })}
        </Typography>
      )}
      <div className={classes.viewsContainer}>
        <div className={classes.statContainer}>
          <Typography variant="h5" align="center">
            {props.data.nb_views_total !== undefined
              ? props.data.nb_views_total
              : '-'}
          </Typography>
          <Typography variant="caption" align="center" component="p">
            {t('video.analytics.totalViews')}
          </Typography>
        </div>
        <div className={classes.statContainer}>
          <Typography variant="h5" align="center">
            {props.data.nb_views_last_week !== undefined
              ? props.data.nb_views_last_week
              : '-'}
          </Typography>
          <Typography variant="caption" align="center" component="p">
            {t('video.analytics.viewsLastWeek')}
          </Typography>
        </div>
        <div className={classes.statContainer}>
          <Typography variant="h5" align="center">
            {props.data.nb_distinct_viewers !== undefined
              ? props.data.nb_distinct_viewers
              : '-'}
          </Typography>
          <Typography variant="caption" align="center" component="p">
            {t('video.analytics.distinctViewers')}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  viewsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    alingItems: 'baseline',
  },
  statContainer: {
    flex: '1 1 250px',
    marginBottom: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(3),
  },
  uploaded: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

export default VodVideoAnalytics;
