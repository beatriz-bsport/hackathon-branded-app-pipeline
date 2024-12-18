import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BILLING_PLAN_STATUS_ENDED,
  BILLING_PLAN_STATUS_PAUSED,
} from '@bsport/common/lib/master-data/subscription-status';
import '#src/components/css-only/Chip/stories/stories.styles.css';
import { CustomMuiIcon } from '#src/components/icons/CustomMuiIcon.component';
import ToolTip from '#src/components/Tooltip.component';
import { makeStyles } from '@material-ui/core/styles';
import { QuicksaleInterfaceModalColors } from '#src/libs/quicksale/constants';
import { isPaused } from '#src/libs/subscription/utils';
import type { FranchiseUserBillingPlanPause } from '#src/libs/franchise/types';

type Props = {
  canceledAt: string | null;
  hasEnded: boolean;
  pauses: FranchiseUserBillingPlanPause[];
  status: number;
};

const SubscriptionStatus: React.FC<Props> = ({
  canceledAt,
  hasEnded,
  pauses,
  status,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  let title = t('billingPlanStatus.valid');
  let customColor = QuicksaleInterfaceModalColors.Success;
  let icon = 'CheckCircle';

  if (canceledAt) {
    title = t('billingPlanStatus.canceled');
    customColor = QuicksaleInterfaceModalColors.Error;
    icon = 'Stop';
  }

  if (hasEnded || status === BILLING_PLAN_STATUS_ENDED) {
    title = t('billingPlanStatus.expired');
    customColor = QuicksaleInterfaceModalColors.Error;
    icon = 'Cancel';
  }

  if (isPaused(pauses) || status === BILLING_PLAN_STATUS_PAUSED) {
    title = t('billingPlanStatus.paused');
    customColor = QuicksaleInterfaceModalColors.Info;
    icon = 'PauseCircleFilled';
  }

  return (
    <ToolTip title={title}>
      <div>
        <CustomMuiIcon
          customClassName={classes.chip}
          customColor={customColor}
          icon={icon}
        />
      </div>
    </ToolTip>
  );
};

const useStyles = makeStyles(() => ({
  chip: {
    display: 'flex',
  },
}));

export default React.memo(SubscriptionStatus);
