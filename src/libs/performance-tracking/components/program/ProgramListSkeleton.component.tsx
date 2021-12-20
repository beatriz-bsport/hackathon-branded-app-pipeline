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
                width="50%"
                variant="rect"
                height={28}
              />
            </div>
            <div className={classes.programHeaderRight}>
              <Skeleton
                animation="wave"
                width="50%"
                variant="rect"
                height={25}
              />
              <Skeleton
                animation="wave"
                width="50%"
                variant="rect"
                height={28}
              />
            </div>
          </div>
          <Skeleton animation="wave" width="100%" variant="text" height={4} />
        </div>
        <div className={classes.content}>
          {[1, 1, 1, 1, 1].map(() => (
            <Skeleton
              animation="wave"
              width="100%"
              variant="rect"
              height={51}
            />
          ))}
        </div>
        <div className={classes.headerContainer}>
          <div className={classes.header}>
            <div className={classes.leftArchived}>
              <Skeleton
                animation="wave"
                width="75%"
                variant="rect"
                height={25}
              />
            </div>
            <div className={classes.rightArchived}>
              <Skeleton
                animation="wave"
                width={25}
                variant="circle"
                height={25}
              />
            </div>
          </div>
          <Skeleton animation="wave" width="100%" variant="text" height={4} />
        </div>
      </div>
      <div className={classes.subContainer}>
        {props?.selectedProgramId !== undefined ? (
          <>
            <div className={classes.headerContainer}>
              <div className={classes.header}>
                <Skeleton
                  animation="wave"
                  width="20%"
                  variant="rect"
                  height={28}
                />
              </div>
              <Skeleton
                animation="wave"
                width="100%"
                variant="text"
                height={4}
              />
            </div>
            <Skeleton
              animation="wave"
              width="100%"
              variant="rect"
              height={100}
            />
            <div className={classes.headerContainer}>
              <div className={classes.header}>
                <Skeleton
                  animation="wave"
                  width="15%"
                  variant="rect"
                  height={28}
                />
              </div>
              <Skeleton
                animation="wave"
                width="100%"
                variant="text"
                height={4}
              />
            </div>
            <div className={classes.content}>
              <Skeleton
                animation="wave"
                width="100%"
                variant="rect"
                height={50}
              />
              <Skeleton
                animation="wave"
                width="100%"
                variant="rect"
                height={50}
              />
            </div>
            <div className={classes.headerContainer}>
              <div className={classes.header}>
                <Skeleton
                  animation="wave"
                  width="15%"
                  variant="rect"
                  height={28}
                />
              </div>
              <Skeleton
                animation="wave"
                width="100%"
                variant="text"
                height={4}
              />
            </div>
            <div className={classes.memberHeader}>
              {[0, 0, 0].map(() => (
                <Skeleton
                  animation="wave"
                  width="33%"
                  variant="rect"
                  height={25}
                />
              ))}
            </div>
            <div className={classes.content}>
              {[0, 0, 0, 0, 0].map(() => (
                <Skeleton
                  animation="wave"
                  width="100%"
                  variant="rect"
                  height={51}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={classes.headerContainer}>
            <div className={classes.header}>
              <Skeleton
                animation="wave"
                width="20%"
                variant="rect"
                height={28}
              />
            </div>
            <Skeleton animation="wave" width="100%" variant="text" height={4} />
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
