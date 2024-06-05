import React from 'react';

import makeStyles from '@material-ui/styles/makeStyles';

import {
  CustomMuiSkeletonText,
  CustomMuiSkeletonIconContainer,
} from '#components/customMuiSkeletons';
import { useStyles as cadenceGlobalMetricsProgressListStyles } from './CadenceGlobalMetricsProgressList.component';


export const CadenceGlobalMetricsProgressListSkeleton = () => {
  const classes = useStyles();

  const cadenceGlobalMetricsProgressListClasses =
    cadenceGlobalMetricsProgressListStyles({});

  const labelWidth = '80px';

  return (
    <div className={cadenceGlobalMetricsProgressListClasses.container}>
      <div
        className={
          cadenceGlobalMetricsProgressListClasses.iconAndTitleContainer
        }
      >
        <CustomMuiSkeletonIconContainer size="36px" />
        <CustomMuiSkeletonText width={labelWidth} />
      </div>
      <div
        className={cadenceGlobalMetricsProgressListClasses.progressesContainer}
      >
        <div>
          <div className={classes.labelContainer}>
            <CustomMuiSkeletonText width={labelWidth} />
          </div>
          <div className={classes.progressBarContainer}>
            <CustomMuiSkeletonText width="100%" />
          </div>
        </div>
        <div>
          <div className={classes.labelContainer}>
            <CustomMuiSkeletonText width={labelWidth} />
          </div>
          <div className={classes.progressBarContainer}>
            <CustomMuiSkeletonText width="30%" />
          </div>
        </div>

        <div>
          <div className={classes.labelContainer}>
            <CustomMuiSkeletonText width={labelWidth} />
          </div>
          <div className={classes.progressBarContainer}>
            <CustomMuiSkeletonText width="80%" />
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  progressBarContainer: {
    height: '28px',
    display: 'flex',
    alignItems: 'center',
  },
  labelContainer: {
    height: '20px',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default React.memo(CadenceGlobalMetricsProgressListSkeleton);
