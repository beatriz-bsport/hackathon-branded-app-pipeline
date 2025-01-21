import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

type Props = {
  open: boolean;
};

const StaffLocationBlocker: React.FC<Props> = ({ open }) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  if (!open) {
    return null;
  }

  return (
    <div
      className={clsx(
        classes.blockerFrame,
        classes.blockerFrameForContentPages,
      )}
    >
      <div className={classes.pseudoDialogContainer}>
        <Paper elevation={3}>
          <div className={classes.innerPaper}>
            <div className={classes.textContainer}>
              <Typography variant="h6">
                {t(`modals.locationBlocker.title`)}
              </Typography>
            </div>
            <div className={classes.textContainer}>
              <Typography variant="body1">
                {t(`modals.locationBlocker.message`)}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {t(`modals.locationBlocker.description`)}
              </Typography>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  blockerFrame: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 100000 /* some high z-index */,
    width: '100%',
    height: '100%',
    backdropFilter: 'brightness(60%)',
    userSelect:
      'none' /* prevents double clicking from highlighting entire page */,
  },
  blockerFrameForContentPages: {
    width: 'auto',
    height: 'auto',
    bottom: `-${theme.spacing(1)}px`,
    top: `-${theme.spacing(2)}px`,
    [theme.breakpoints.up('md')]: {
      left: `-${theme.spacing(3)}px`,
      right: `-${theme.spacing(3)}px`,
    },
  },
  pseudoDialogContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  textContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  innerPaper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

export default React.memo(StaffLocationBlocker);
