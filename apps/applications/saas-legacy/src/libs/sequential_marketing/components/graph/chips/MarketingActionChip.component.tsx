import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

import { useMarketingActionUpsellCheck } from '#src/libs/sequential_marketing/components/graph/hooks/marketingActionUpsellCheck.hook';
import {
  CadenceStatusColors,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import {
  getMarketingActionChipIcon,
  getMarketingActionChipName,
} from '#src/libs/sequential_marketing/components/helpers/utils';
import { CadenceChip } from './CadenceChip.component';

import type { StepMarketingActions } from '#src/libs/sequential_marketing/types';
import type { Tag } from '#src/libs/tag/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';

type Props = {
  marketingAction: StepMarketingActions;
  getTag: (id: string) => Tag;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
  onClick?: () => void;
};

type ClickableChipProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

const ClickableChip: React.FC<ClickableChipProps> = React.memo(
  ({ onClick, children }) => {
    const classes = useStyles();

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
        onClick?.();
      },
      [onClick],
    );

    if (onClick) {
      return (
        <ButtonBase className={classes.button} onClick={handleClick}>
          {children}
        </ButtonBase>
      );
    }

    return <div className={classes.button}>{children}</div>;
  },
);

const MarketingActionChip: React.FC<Props> = ({
  marketingAction,
  getTag,
  getEmailTemplate,
  onClick,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const marketingActionIcon = getMarketingActionChipIcon(marketingAction);
  const marketingActionLabel =
    getMarketingActionChipName({
      marketingAction,
      getTag,
      getEmailTemplate,
    }) ?? '';

  const { isPushNotification, isSms, hasPushNotificationUpsell, hasSmsUpsell } =
    useMarketingActionUpsellCheck(marketingAction);

  const showPushNotificationWarning =
    isPushNotification && !hasPushNotificationUpsell;
  const showSmsWarning = isSms && !hasSmsUpsell;

  const showUpsellWarning = showPushNotificationWarning || showSmsWarning;
  const upsellWarningTitle = t('audience.upsells.warning.title');
  const upsellWarningMessage = isPushNotification
    ? t('audience.upsells.warning.message.pushNotification')
    : isSms
    ? t('audience.upsells.warning.message.sms')
    : '';

  return (
    <ClickableChip onClick={onClick}>
      <CadenceChip
        autoOverflow
        withBackgroundOnHover
        color={SequentialMarketingColors.MARKETING_ACTION_COLOR}
        icon={marketingActionIcon}
        isClickable={!!onClick}
        name={marketingActionLabel}
      />
      {showUpsellWarning && (
        <div className={classes.warningChip}>
          <CadenceChip
            toolTip
            color={CadenceStatusColors.ERROR_DARK_COLOR}
            icon="Warning"
            isClickable={false}
            name={upsellWarningTitle}
            toolTipValue={upsellWarningMessage}
          />
        </div>
      )}
    </ClickableChip>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    justifyContent: 'flex-start',
    width: 'fit-content',
    gap: theme.spacing(1),
    maxWidth: '100%',
  },
  warningChip: { display: 'flex', flex: 1 },
}));

export default React.memo(MarketingActionChip);
