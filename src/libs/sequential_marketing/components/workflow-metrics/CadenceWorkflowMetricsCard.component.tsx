import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import type { Theme } from '@material-ui/core/styles';

import chroma from 'chroma-js';

import {
  SequentialMarketingColors,
  SequentialMarketingWorkflowMetricsSizes,
} from '#libs/sequential_marketing/constants';
import TrophyIcon from '#components/icons/TrophyIcon.component';
import CadenceWorkflowMetricsIconContainer from './CadenceWorkflowMetricsIconContainer.component';

export enum WorkflowMetricsVariant {
  MEMBERS = 'members',
  SUCCESS = 'success',
  AVERAGE_TIME = 'average-time',
  TAGS = 'tags',
}

type Props = {
  count: number;
  variant: WorkflowMetricsVariant;
  backgroundColor?: string;
};

const useCadenceWorkflowMetricsCardIcon = (
  variant: WorkflowMetricsVariant,
  theme: Theme,
): {
  icon: string | null;
  CustomIcon: React.FC<React.SVGProps<SVGElement>> | null;
  iconColor: string;
} => {
  switch (variant) {
    case WorkflowMetricsVariant.MEMBERS:
      return {
        icon: 'People',
        CustomIcon: null,
        iconColor: SequentialMarketingColors.WORKFLOW_METRICS_ORANGE,
      };
    case WorkflowMetricsVariant.SUCCESS:
      return {
        icon: null,
        CustomIcon: TrophyIcon,
        iconColor: SequentialMarketingColors.WORKFLOW_METRICS_GREEN,
      };
    case WorkflowMetricsVariant.AVERAGE_TIME:
      return {
        icon: 'Timer',
        CustomIcon: null,
        iconColor: SequentialMarketingColors.TRIGGER_COLOR,
      };
    case WorkflowMetricsVariant.TAGS:
      return {
        icon: 'Label',
        CustomIcon: null,
        iconColor: SequentialMarketingColors.MARKETING_ACTION_COLOR,
      };
    default:
      return {
        icon: 'Error',
        CustomIcon: null,
        iconColor: theme.palette.error.main,
      };
  }
};

const useCadenceWorkflowMetricsCardTexts = (
  variant: WorkflowMetricsVariant,
): {
  title: string;
  description: string;
  label: string;
} => {
  const { t } = useTranslation('marketing');

  switch (variant) {
    case WorkflowMetricsVariant.MEMBERS:
      return {
        title: t('audience.workflowMetrics.cards.members.title'),
        description: t('audience.workflowMetrics.cards.members.description'),
        label: t('audience.workflowMetrics.cards.members.label'),
      };
    case WorkflowMetricsVariant.SUCCESS:
      return {
        title: t('audience.workflowMetrics.cards.success.title'),
        description: t('audience.workflowMetrics.cards.success.description'),
        label: t('audience.workflowMetrics.cards.success.label'),
      };
    case WorkflowMetricsVariant.AVERAGE_TIME:
      return {
        title: t('audience.workflowMetrics.cards.averageTime.title'),
        description: t(
          'audience.workflowMetrics.cards.averageTime.description',
        ),
        label: t('audience.workflowMetrics.cards.averageTime.label'),
      };
    case WorkflowMetricsVariant.TAGS:
      return {
        title: t('audience.workflowMetrics.cards.tags.title'),
        description: t('audience.workflowMetrics.cards.tags.description'),
        label: t('audience.workflowMetrics.cards.tags.label'),
      };
    default:
      return {
        title: '',
        description: '',
        label: '',
      };
  }
};

const useCadenceWorkflowMetricsCarFigure = (
  variant: WorkflowMetricsVariant,
  count: number,
): {
  figure: string;
} => {
  switch (variant) {
    case WorkflowMetricsVariant.MEMBERS:
    case WorkflowMetricsVariant.AVERAGE_TIME:
    case WorkflowMetricsVariant.TAGS:
      return { figure: `${count}` };

    case WorkflowMetricsVariant.SUCCESS:
      return { figure: `${count} %` };

    default:
      return { figure: '' };
  }
};

export const CadenceWorkflowMetricsCard: React.FC<Props> = ({
  count,
  variant,
  backgroundColor,
}) => {
  const theme = useTheme();

  const { icon, CustomIcon, iconColor } = useCadenceWorkflowMetricsCardIcon(
    variant,
    theme,
  );

  const classes = useStyles({ iconColor, backgroundColor });

  const { title, description, label } =
    useCadenceWorkflowMetricsCardTexts(variant);

  const { figure } = useCadenceWorkflowMetricsCarFigure(variant, count);

  return (
    <div className={classes.cardContainer}>
      <div className={classes.topContainer}>
        <div className={classes.iconAndTitleContainer}>
          <CadenceWorkflowMetricsIconContainer
            CustomIcon={CustomIcon}
            icon={icon}
            iconColor={iconColor}
          />
          <Typography className={classes.title} variant="subtitle1">
            {title}
          </Typography>
        </div>
        <Typography className={classes.description} variant="body2">
          {description}
        </Typography>
      </div>
      <div className={classes.lowContainer}>
        <Typography className={classes.number} variant="h5">
          {figure}
        </Typography>
        <Typography className={classes.label} variant="subtitle1">
          {label}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  { iconColor: string; backgroundColor?: string }
>((theme) => ({
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    backgroundColor: ({ backgroundColor }) => backgroundColor ?? 'white',
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  iconAndTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    height: SequentialMarketingWorkflowMetricsSizes.ICON_CONTAINER_SIZE,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  description: { color: SequentialMarketingColors.WORKFLOW_METRICS_GREY },
  lowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'end',
  },
  number: {
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    color: SequentialMarketingColors.WORKFLOW_METRICS_GREY,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    backgroundColor: ({ iconColor }) => chroma(iconColor).alpha(0.09).hex(),
    height: SequentialMarketingWorkflowMetricsSizes.ICON_CONTAINER_SIZE,
    width: SequentialMarketingWorkflowMetricsSizes.ICON_CONTAINER_SIZE,
  },
  icon: {
    height: SequentialMarketingWorkflowMetricsSizes.ICON_SIZE,
    width: SequentialMarketingWorkflowMetricsSizes.ICON_SIZE,
    color: ({ iconColor }) => iconColor,
  },
}));

export default React.memo(CadenceWorkflowMetricsCard);
