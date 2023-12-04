import React from 'react';

import makeStyles from '@material-ui/styles/makeStyles';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { useStyles as CadenceWorkflowMetricsProgressListStyles } from '#libs/sequential_marketing/components/workflow-metrics/CadenceWorkflowMetricsProgressList.component';

import {
  CustomMuiSkeletonText,
  CustomMuiSkeletonIconContainer,
} from '#components/customMuiSkeletons';

export const CadenceWorkflowMetricsProgressListSkeleton = () => {
  const classes = useStyles();

  const CadenceWorkflowMetricsProgressListClasses =
    CadenceWorkflowMetricsProgressListStyles({
      backgroundColor: 'white',
    });

  const labelWidth = '80px';

  return (
    <div className={CadenceWorkflowMetricsProgressListClasses.container}>
      <div
        className={
          CadenceWorkflowMetricsProgressListClasses.iconAndTitleContainer
        }
      >
        <CustomMuiSkeletonIconContainer size="36px" />
        <CustomMuiSkeletonText width={labelWidth} />
      </div>
      <div
        className={
          CadenceWorkflowMetricsProgressListClasses.progressesContainer
        }
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

export const CadenceWorkflowMetricsProgressListSkeletonStorybook =
  marketplaceCssHoc<
    React.ComponentProps<typeof CadenceWorkflowMetricsProgressListSkeleton>
  >()(CadenceWorkflowMetricsProgressListSkeleton);

export default React.memo(CadenceWorkflowMetricsProgressListSkeleton);
