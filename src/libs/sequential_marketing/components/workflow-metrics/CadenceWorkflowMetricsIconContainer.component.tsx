import React from 'react';

import makeStyles from '@material-ui/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import chroma from 'chroma-js';

import { SequentialMarketingWorkflowMetricsSizes } from '#libs/sequential_marketing/constants';
import MuiIconComponent from '#components/MuiIcon.component';

type Props = {
  icon: string | null;
  CustomIcon: React.FC<React.SVGProps<SVGElement>> | null;
  iconColor: string;
};

export const CadenceWorkflowMetricsIconContainer: React.FC<Props> = ({
  icon,
  CustomIcon,
  iconColor,
}) => {
  const classes = useStyles({ iconColor });

  return (
    <div className={classes.iconContainer}>
      {CustomIcon ? (
        <CustomIcon className={classes.icon} fill={iconColor} />
      ) : (
        <MuiIconComponent
          className={classes.icon}
          defaultIcon="CheckCircle"
          icon={icon}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles<Theme, { iconColor: string }>((theme) => ({
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    backgroundColor: ({ iconColor }) => chroma(iconColor).alpha(0.09).hex(),
    height: SequentialMarketingWorkflowMetricsSizes.ICON_CONTAINER_SIZE,
    minHeight: SequentialMarketingWorkflowMetricsSizes.ICON_CONTAINER_SIZE,
    width: SequentialMarketingWorkflowMetricsSizes.ICON_CONTAINER_SIZE,
    minWidth: SequentialMarketingWorkflowMetricsSizes.ICON_CONTAINER_SIZE,
  },
  icon: {
    height: SequentialMarketingWorkflowMetricsSizes.ICON_SIZE,
    width: SequentialMarketingWorkflowMetricsSizes.ICON_SIZE,
    color: ({ iconColor }) => iconColor,
  },
}));

export default React.memo(CadenceWorkflowMetricsIconContainer);
