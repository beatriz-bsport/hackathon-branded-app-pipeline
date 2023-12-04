import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import CadenceWorkflowMetricsProgressBar from '#libs/sequential_marketing/components/workflow-metrics/CadenceWorkflowMetricsProgressBar.component';
import CadenceWorkflowMetricsIconContainer from '#libs/sequential_marketing/components/workflow-metrics/CadenceWorkflowMetricsIconContainer.component';
import CadenceWorkflowMetricsProgressListSkeleton from '#libs/sequential_marketing/components/workflow-metrics/CadenceWorkflowMetricsProgressListSkeleton.components';
import {
  SequentialMarketingColors,
  SequentialMarketingWorkflowMetricsSizes,
} from '#libs/sequential_marketing/constants';

type CadenceProgressBarProps = Omit<
  React.ComponentProps<typeof CadenceWorkflowMetricsProgressBar>,
  'customColor' | 'width'
>;

type Props = {
  progressList: CadenceProgressBarProps[];
  backgroundColor?: string;
  customColor?: string;
  isLoading?: boolean;
};

export const CadenceWorkflowMetricsProgressList: React.FC<Props> = ({
  progressList,
  backgroundColor,
  customColor,
  isLoading,
}) => {
  const classes = useStyles({ backgroundColor });

  const { t } = useTranslation('marketing');

  // The width of the progress bars are based on the biggest one
  const maxCount = useMemo(
    () =>
      progressList.reduce((max, currentValue) => {
        if (!!currentValue.count && currentValue.count > max) {
          return currentValue.count;
        }
        return max;
      }, 0),
    [progressList],
  );

  if (isLoading) {
    return <CadenceWorkflowMetricsProgressListSkeleton />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.iconAndTitleContainer}>
        <CadenceWorkflowMetricsIconContainer
          CustomIcon={null}
          icon="Send"
          iconColor={
            customColor ?? SequentialMarketingColors.MARKETING_ACTION_COLOR
          }
        />
        <Typography className={classes.title} variant="subtitle1">
          {t('audience.workflowMetrics.communication.title')}
        </Typography>
      </div>
      <div className={classes.progressesContainer}>
        {(progressList || []).map((progress: CadenceProgressBarProps) => {
          return (
            <CadenceWorkflowMetricsProgressBar
              count={progress.count}
              customColor={customColor}
              disabled={progress.disabled}
              displayUpsellAvailableSoon={progress.displayUpsellAvailableSoon}
              displayUpsellKnowMoreLink={progress.displayUpsellKnowMoreLink}
              label={progress.label}
              onClickKnowMore={progress.onClickKnowMore}
              upsellName={progress.upsellName}
              width={
                maxCount > 0 && !!progress.count
                  ? (progress.count / maxCount) * 100
                  : 0
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export const useStyles = makeStyles<Theme, { backgroundColor?: string }>(
  (theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius:
        SequentialMarketingWorkflowMetricsSizes.PROGRESS_LIST_CONTAINER_BORDER_RADIUS,
      padding: theme.spacing(2),
      gap: theme.spacing(2),
      backgroundColor: ({ backgroundColor }) => backgroundColor ?? 'white',
    },
    iconAndTitleContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(2),
      alignItems: 'center',
    },
    progressesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
    title: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

export default React.memo(CadenceWorkflowMetricsProgressList);
