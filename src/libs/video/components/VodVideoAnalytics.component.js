// @flow
import React from 'react';
import moment from 'moment-timezone';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import BarChartIcon from '@material-ui/icons/BarChart';

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
  if (props.loading || !props.data) {
    return (
      <div className={classes.loading}>
        <CircularProgress disableShrink />
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <BarChartIcon className={classes.iconLeft} />
        <Typography variant="h6">{t('video.analytics.viewTitle')}</Typography>
      </div>
      {props.videoDateCreated && (
        <Typography
          variant="caption"
          className={classes.uploaded}
          component="p"
        >
          {t('video.analytics.uploaded', {
            date: moment(props.videoDateCreated).format('LL'),
          })}
        </Typography>
      )}
      <Paper className={classes.viewsContainer}>
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
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },

  viewsContainer: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flexDirection: 'row',
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
