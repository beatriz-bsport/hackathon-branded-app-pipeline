import React from 'react';
import clsx from 'clsx';
import { Theme, makeStyles } from '@material-ui/core/styles';

import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';

import { AccessStatus } from '#src/libs/access-control/constants';

const MemberVisitDetailsCardSkeleton: React.FC = React.memo(() => {
  const classes = useStyles({ access_status: null });
  return (
    <Card className={classes.root} variant="outlined">
      <div className={classes.titleContainer}>
        <Skeleton
          className={classes.skeleton}
          height={24}
          variant="rect"
          width={120}
        />
        <Skeleton
          className={classes.skeleton}
          height={24}
          variant="rect"
          width={80}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.photoContainer}>
          <Skeleton
            className={classes.skeleton}
            height={280}
            variant="rect"
            width={280}
          />
          <div className={classes.ctaButtonsContainer}>
            <Skeleton
              className={clsx(classes.memberCtaButton, classes.skeleton)}
              height={24}
              variant="rect"
            />
            <Skeleton
              className={clsx(classes.memberCtaButton, classes.skeleton)}
              height={24}
              variant="rect"
            />
          </div>
        </div>
        <div className={classes.infoContainer}>
          <Skeleton
            className={classes.skeleton}
            height={24}
            variant="rect"
            width={375}
          />
          <Skeleton
            className={classes.skeleton}
            height={24}
            variant="rect"
            width={479}
          />
          <Skeleton
            className={classes.skeleton}
            height={24}
            variant="rect"
            width={375}
          />
          <Skeleton
            className={classes.skeleton}
            height={24}
            variant="rect"
            width={280}
          />
        </div>
      </div>
    </Card>
  );
});

const useStyles = makeStyles<Theme, { access_status?: AccessStatus }>(
  (theme) => ({
    root: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      borderColor: ({ access_status }) => {
        switch (access_status) {
          case AccessStatus.GREEN:
            return theme.palette.success.main;
          case AccessStatus.ORANGE:
            return theme.palette.warning.main;
          case AccessStatus.RED:
            return theme.palette.error.main;
          default:
            return theme.palette.grey[300];
        }
      },
      borderWidth: 2,
      borderRadius: theme.spacing(1),
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      display: 'flex',
      gap: theme.spacing(2),
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      flexGrow: 1,
    },
    photoContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      width: 280,
    },
    ctaButtonsContainer: {
      display: 'flex',
      gap: theme.spacing(1),
    },
    memberCtaButton: {
      flex: 1,
    },
    skeleton: {
      borderRadius: theme.spacing(1),
    },
  }),
);

export default React.memo(MemberVisitDetailsCardSkeleton);
