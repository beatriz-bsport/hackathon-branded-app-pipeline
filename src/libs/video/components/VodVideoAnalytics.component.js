// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import BarChartIcon from '@material-ui/icons/BarChart';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

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
          className={classes.uploaded}
          component="p"
          variant="caption"
        >
          {t('video.analytics.uploaded', {
            date: formatAsDatetimeAdapted(props.videoDateCreated, 'LL'),
          })}
        </Typography>
      )}
      <Paper className={classes.viewsContainer}>
        <div className={classes.statContainer}>
          <Typography align="center" variant="h5">
            {props.data.nb_views_total !== undefined
              ? props.data.nb_views_total
              : '-'}
          </Typography>
          <Typography align="center" component="p" variant="caption">
            {t('video.analytics.totalViews')}
          </Typography>
        </div>
        <div className={classes.statContainer}>
          <Typography align="center" variant="h5">
            {props.data.nb_views_last_week !== undefined
              ? props.data.nb_views_last_week
              : '-'}
          </Typography>
          <Typography align="center" component="p" variant="caption">
            {t('video.analytics.viewsLastWeek')}
          </Typography>
        </div>
        <div className={classes.statContainer}>
          <Typography align="center" variant="h5">
            {props.data.nb_distinct_viewers !== undefined
              ? props.data.nb_distinct_viewers
              : '-'}
          </Typography>
          <Typography align="center" component="p" variant="caption">
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
