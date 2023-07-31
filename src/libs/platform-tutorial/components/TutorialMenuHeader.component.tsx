import {
  CircularProgress,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import React from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import classNames from 'classnames';
import BookIcon from '#components/icons/BookIcon.component';

export type Props = {
  percentage: number;
};

const TutorialMenuHeader: React.FC<Props> = (props: Props) => {
  const { percentage } = props;
  const { t } = useTranslation(['tutorial']);
  const classes = useStyles();

  return (
    <Paper elevation={0}>
      <Grid container className={classes.container}>
        <Grid
          item
          xs={12}
          sm={7}
          md={8}
          className={classNames(classes.gridItem, classes.responsiveGridItem)}
        >
          <div className={classNames(classes.box, classes.primary)}>
            <BookIcon width="65%" height="50%" />
          </div>

          <div className={classes.textContainer}>
            <Typography variant="h6">{t('menuHeader.title')}</Typography>
            <Hidden xsDown>
              <Typography variant="body1">
                {t('menuHeader.infoText')}
              </Typography>
            </Hidden>
          </div>
        </Grid>
        <Hidden smUp>
          <Grid item xs={12}>
            <Typography className={classes.mobileText} variant="body1">
              {t('menuHeader.infoText')}
            </Typography>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={5} md={4} className={classes.gridItem}>
          <div className={classes.progressIcon}>
            <div className={classes.overlapping}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={200}
                className={classes.bottom}
              />
              <CircularProgress
                variant="determinate"
                value={percentage}
                color="primary"
                size={200}
                className={classes.top}
                classes={{ circle: classes.circle }}
              />
            </div>
            <div className={classes.iconWithProgress}>
              <SchoolIcon classes={{ root: classes.schoolIcon }} />
              <Typography variant="subtitle1">{`${percentage}%`}</Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    minHeight: theme.spacing(33),
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
  box: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    minWidth: theme.spacing(14),
    minHeight: theme.spacing(14),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      minWidth: theme.spacing(7),
      minHeight: theme.spacing(7),
    },
  },
  primary: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
  textContainer: {
    maxWidth: '65%',
  },
  progressIcon: {
    fontSize: theme.spacing(10),
    display: 'inline-flex',
    position: 'relative',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  circle: {
    strokeLinecap: 'round',
  },
  schoolIcon: {
    fontSize: theme.spacing(7),
  },
  iconWithProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  overlapping: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bottom: {
    color: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
  mobileText: {
    padding: theme.spacing(2),
  },
  responsiveGridItem: {
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      justifyContent: 'start',
    },
  },
}));

export default TutorialMenuHeader;
