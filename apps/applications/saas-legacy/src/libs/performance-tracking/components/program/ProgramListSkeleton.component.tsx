import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

type OwnProps = {
  selectedProgramId?: number;
};
export const ProgramListSkeleton = (props: OwnProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.headerContainer}>
          <div className={classes.header}>
            <div className={classes.programHeaderLeft}>
              <Skeleton
                animation="wave"
                height={28}
                variant="rect"
                width="50%"
              />
            </div>
            <div className={classes.programHeaderRight}>
              <Skeleton
                animation="wave"
                height={25}
                variant="rect"
                width="50%"
              />
              <Skeleton
                animation="wave"
                height={28}
                variant="rect"
                width="50%"
              />
            </div>
          </div>
          <Skeleton animation="wave" height={4} variant="text" width="100%" />
        </div>
        <div className={classes.content}>
          {[1, 1, 1, 1, 1].map(() => (
            <Skeleton
              animation="wave"
              height={51}
              variant="rect"
              width="100%"
            />
          ))}
        </div>
        <div className={classes.headerContainer}>
          <div className={classes.header}>
            <div className={classes.leftArchived}>
              <Skeleton
                animation="wave"
                height={25}
                variant="rect"
                width="75%"
              />
            </div>
            <div className={classes.rightArchived}>
              <Skeleton
                animation="wave"
                height={25}
                variant="circle"
                width={25}
              />
            </div>
          </div>
          <Skeleton animation="wave" height={4} variant="text" width="100%" />
        </div>
      </div>
      <div className={classes.subContainer}>
        {props?.selectedProgramId !== undefined ? (
          <>
            <div className={classes.headerContainer}>
              <div className={classes.header}>
                <Skeleton
                  animation="wave"
                  height={28}
                  variant="rect"
                  width="20%"
                />
              </div>
              <Skeleton
                animation="wave"
                height={4}
                variant="text"
                width="100%"
              />
            </div>
            <Skeleton
              animation="wave"
              height={100}
              variant="rect"
              width="100%"
            />
            <div className={classes.headerContainer}>
              <div className={classes.header}>
                <Skeleton
                  animation="wave"
                  height={28}
                  variant="rect"
                  width="15%"
                />
              </div>
              <Skeleton
                animation="wave"
                height={4}
                variant="text"
                width="100%"
              />
            </div>
            <div className={classes.content}>
              <Skeleton
                animation="wave"
                height={50}
                variant="rect"
                width="100%"
              />
              <Skeleton
                animation="wave"
                height={50}
                variant="rect"
                width="100%"
              />
            </div>
            <div className={classes.headerContainer}>
              <div className={classes.header}>
                <Skeleton
                  animation="wave"
                  height={28}
                  variant="rect"
                  width="15%"
                />
              </div>
              <Skeleton
                animation="wave"
                height={4}
                variant="text"
                width="100%"
              />
            </div>
            <div className={classes.memberHeader}>
              {[0, 0, 0].map(() => (
                <Skeleton
                  animation="wave"
                  height={25}
                  variant="rect"
                  width="33%"
                />
              ))}
            </div>
            <div className={classes.content}>
              {[0, 0, 0, 0, 0].map(() => (
                <Skeleton
                  animation="wave"
                  height={51}
                  variant="rect"
                  width="100%"
                />
              ))}
            </div>
          </>
        ) : (
          <div className={classes.headerContainer}>
            <div className={classes.header}>
              <Skeleton
                animation="wave"
                height={28}
                variant="rect"
                width="20%"
              />
            </div>
            <Skeleton animation="wave" height={4} variant="text" width="100%" />
          </div>
        )}
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(3),
  },
  subContainer: {
    display: 'flex',
    width: '50%',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
  },
  programHeaderLeft: {
    width: '50%',
  },
  programHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '50%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },

  leftArchived: {
    display: 'flex',
    width: '50%',
  },
  rightArchived: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '50%',
  },

  memberHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '10%',
  },
}));
export default ProgramListSkeleton;
