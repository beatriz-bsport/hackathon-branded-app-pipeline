import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import type { Theme } from '@material-ui/core/styles';

import chroma from 'chroma-js';

import {
  SequentialMarketingColors,
  CadenceMetricsSizes,
} from '#libs/sequential_marketing/constants';
import TrophyIcon from '#components/icons/TrophyIcon.component';
import CadenceGlobalMetricsIcon from '#libs/sequential_marketing/components/metrics/CadenceGlobalMetricsIcon.component';
import CadenceGlobalMetricsCardSkeleton from './CadenceGlobalMetricsCardSkeleton.component';

export enum CadenceMetricsVariant {
  MEMBERS = 'members',
  SUCCESS = 'success',
  AVERAGE_TIME = 'average-time',
  TAGS = 'tags',
}

type Props = {
  count: number;
  variant: CadenceMetricsVariant;
  backgroundColor?: string;
  isLoading?: boolean;
  handleTitleClick?: () => void;
};

const useCadenceMetricsCardIcon = (
  variant: CadenceMetricsVariant,
  theme: Theme,
): {
  icon: string | null;
  CustomIcon: React.FC<React.SVGProps<SVGElement>> | null;
  iconColor: string;
} => {
  switch (variant) {
    case CadenceMetricsVariant.MEMBERS:
      return {
        icon: 'People',
        CustomIcon: null,
        iconColor: SequentialMarketingColors.WORKFLOW_METRICS_ORANGE,
      };
    case CadenceMetricsVariant.SUCCESS:
      return {
        icon: null,
        CustomIcon: TrophyIcon,
        iconColor: SequentialMarketingColors.WORKFLOW_METRICS_GREEN,
      };
    case CadenceMetricsVariant.AVERAGE_TIME:
      return {
        icon: 'Timer',
        CustomIcon: null,
        iconColor: SequentialMarketingColors.TRIGGER_COLOR,
      };
    case CadenceMetricsVariant.TAGS:
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

const useCadenceMetricsCardTexts = (
  variant: CadenceMetricsVariant,
  count: number,
): {
  title: string;
  description: string;
  label: string;
} => {
  const { t } = useTranslation('marketing');

  switch (variant) {
    case CadenceMetricsVariant.MEMBERS:
      return {
        title: t('audience.workflowMetrics.cards.members.title'),
        description: t('audience.workflowMetrics.cards.members.description'),
        label: t('audience.workflowMetrics.cards.members.label', { count }),
      };
    case CadenceMetricsVariant.SUCCESS:
      return {
        title: t('audience.workflowMetrics.cards.success.title'),
        description: t('audience.workflowMetrics.cards.success.description'),
        label: t('audience.workflowMetrics.cards.success.label'),
      };
    case CadenceMetricsVariant.AVERAGE_TIME:
      return {
        title: t('audience.workflowMetrics.cards.averageTime.title'),
        description: t(
          'audience.workflowMetrics.cards.averageTime.description',
        ),
        label: t('audience.workflowMetrics.cards.averageTime.label', { count }),
      };
    case CadenceMetricsVariant.TAGS:
      return {
        title: t('audience.workflowMetrics.cards.tags.title'),
        description: t('audience.workflowMetrics.cards.tags.description'),
        label: t('audience.workflowMetrics.cards.tags.label', { count }),
      };
    default:
      return {
        title: '',
        description: '',
        label: '',
      };
  }
};

const useCadenceMetricsCardFigure = (
  variant: CadenceMetricsVariant,
  count: number,
): {
  figure: string;
} => {
  switch (variant) {
    case CadenceMetricsVariant.MEMBERS:
    case CadenceMetricsVariant.AVERAGE_TIME:
    case CadenceMetricsVariant.TAGS:
      return { figure: `${count ?? 0}` };

    case CadenceMetricsVariant.SUCCESS:
      return { figure: `${count ?? 0} %` };

    default:
      return { figure: '' };
  }
};

export const CadenceGlobalMetricsCard: React.FC<Props> = ({
  count,
  variant,
  backgroundColor,
  isLoading,
  handleTitleClick,
}) => {
  const theme = useTheme();

  const { icon, CustomIcon, iconColor } = useCadenceMetricsCardIcon(
    variant,
    theme,
  );

  const classes = useStyles({
    iconColor,
    backgroundColor,
    isTitleClickable: !!handleTitleClick,
  });

  const { title, description, label } = useCadenceMetricsCardTexts(
    variant,
    count,
  );

  const { figure } = useCadenceMetricsCardFigure(variant, count);

  if (isLoading) {
    return <CadenceGlobalMetricsCardSkeleton />;
  }

  return (
    <div className={classes.cardContainer}>
      <div className={classes.topContainer}>
        <div className={classes.iconAndTitleContainer}>
          <CadenceGlobalMetricsIcon
            CustomIcon={CustomIcon}
            icon={icon}
            iconColor={iconColor}
          />
          <Typography
            className={classes.title}
            onClick={handleTitleClick}
            variant="subtitle1"
          >
            {title}
          </Typography>
        </div>
        <Typography className={classes.description} variant="caption">
          {description}
        </Typography>
      </div>
      <div className={classes.lowContainer}>
        <Typography className={classes.number}>{figure}</Typography>
        <Typography className={classes.label} variant="subtitle1">
          {label}
        </Typography>
      </div>
    </div>
  );
};

type StylesProps = {
  iconColor: string;
  backgroundColor?: string;
  isTitleClickable?: boolean;
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    backgroundColor: ({ backgroundColor }) =>
      backgroundColor ?? theme.palette.common.white,
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    height: CadenceMetricsSizes.GLOBAL_METRICS_CARD_DESCRIPTION_SIZE,
  },
  iconAndTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    height: CadenceMetricsSizes.ICON_CONTAINER_SIZE,
    alignItems: 'center',
  },
  title: {
    fontWeight: 500,
    cursor: ({ isTitleClickable }) => isTitleClickable && 'pointer',
  },
  description: {
    color: SequentialMarketingColors.WORKFLOW_METRICS_GREY,
    letterSpacing:
      CadenceMetricsSizes.GLOBAL_METRICS_CARD_DESCRIPTION_LETTER_SPACING,
  },
  lowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'end',
  },
  number: {
    fontWeight: 700,
    fontSize: CadenceMetricsSizes.FIGURE_FONT_SIZE,
  },
  label: {
    fontWeight: 500,
    color: SequentialMarketingColors.WORKFLOW_METRICS_GREY,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    backgroundColor: ({ iconColor }) => chroma(iconColor).alpha(0.09).hex(),
    height: CadenceMetricsSizes.ICON_CONTAINER_SIZE,
    width: CadenceMetricsSizes.ICON_CONTAINER_SIZE,
  },
  icon: {
    height: CadenceMetricsSizes.ICON_SIZE,
    width: CadenceMetricsSizes.ICON_SIZE,
    color: ({ iconColor }) => iconColor,
  },
}));

export default React.memo(CadenceGlobalMetricsCard);
