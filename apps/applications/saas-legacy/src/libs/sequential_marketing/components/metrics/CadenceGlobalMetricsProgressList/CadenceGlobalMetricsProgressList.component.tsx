import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import CadenceGlobalMetricsIcon from '#src/libs/sequential_marketing/components/metrics/CadenceGlobalMetricsIcon.component';
import {
  SequentialMarketingColors,
  CadenceMetricsSizes,
} from '#src/libs/sequential_marketing/constants';
import CadenceGlobalMetricsProgressBar from './CadenceGlobalMetricsProgressBar.component';
import CadenceGlobalMetricsProgressListSkeleton from './CadenceGlobalMetricsProgressListSkeleton.components';

type CadenceProgressBarProps = Omit<
  React.ComponentProps<typeof CadenceGlobalMetricsProgressBar>,
  'customColor' | 'width'
>;

type MetricsProgressListProps = {
  progressList: CadenceProgressBarProps[];
  backgroundColor?: string;
  customColor?: string;
  isLoading?: boolean;
};

type Props = {
  emailCount: number;
  notificationCount: number;
  smsCount: number;
  hasNotificationUpsell?: boolean;
  backgroundColor?: string;
  customColor?: string;
  isLoading?: boolean;
  knowMoreOnNotifications?: () => void;
};

export const MetricsProgressList: React.FC<MetricsProgressListProps> =
  React.memo(({ progressList, backgroundColor, customColor, isLoading }) => {
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
      return <CadenceGlobalMetricsProgressListSkeleton />;
    }

    return (
      <div className={classes.container}>
        <div className={classes.iconAndTitleContainer}>
          <CadenceGlobalMetricsIcon
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
          {(progressList ?? []).map((progress: CadenceProgressBarProps) => {
            return (
              <CadenceGlobalMetricsProgressBar
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
  });

export const CadenceGlobalMetricsProgressList: React.FC<Props> = ({
  emailCount,
  notificationCount,
  smsCount,
  hasNotificationUpsell,
  backgroundColor,
  customColor,
  isLoading,
  knowMoreOnNotifications,
}) => {
  const { t } = useTranslation('marketing');

  const progressList: CadenceProgressBarProps[] = React.useMemo(
    () => [
      {
        label: t('audience.workflowMetrics.communication.email'),
        count: emailCount,
      },
      {
        label: t('audience.workflowMetrics.communication.sms'),
        count: smsCount,
        disabled: true,
      },
      {
        label: t('audience.workflowMetrics.communication.pushNotif'),
        count: notificationCount,
        displayUpsellKnowMoreLink: !hasNotificationUpsell,
        disabled: !hasNotificationUpsell,
        upsellName: 'Push notifications',
        onClickKnowMore: knowMoreOnNotifications,
      },
    ],
    [
      emailCount,
      hasNotificationUpsell,
      notificationCount,
      smsCount,
      knowMoreOnNotifications,
      t,
    ],
  );

  if (isLoading) {
    return <CadenceGlobalMetricsProgressListSkeleton />;
  }

  return (
    <MetricsProgressList
      backgroundColor={backgroundColor}
      customColor={customColor}
      isLoading={isLoading}
      progressList={progressList}
    />
  );
};

export const useStyles = makeStyles<Theme, { backgroundColor?: string }>(
  (theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: CadenceMetricsSizes.PROGRESS_LIST_CONTAINER_BORDER_RADIUS,
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
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

export default React.memo(CadenceGlobalMetricsProgressList);
