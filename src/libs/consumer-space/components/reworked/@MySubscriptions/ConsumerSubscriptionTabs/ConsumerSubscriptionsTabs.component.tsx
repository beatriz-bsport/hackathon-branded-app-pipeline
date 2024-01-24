import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericTabs from '#libs/consumer-space/components/reworked/common/ConsumerGenericTabs';
import { SubscriptionTabEnum } from '#libs/consumer-space/components/reworked/@MySubscriptions/constants';
import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';

type Props = {
  selectedTab: SubscriptionTab;
  onChangeSubscriptionTab: (type: SubscriptionTab) => void;
};

export const ConsumerSubscriptionsTabs: React.FC<Props> = ({
  selectedTab,
  onChangeSubscriptionTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetActiveTab = useCallback(
    () => onChangeSubscriptionTab?.(SubscriptionTabEnum.ACTIVE),
    [onChangeSubscriptionTab],
  );

  const handleSetFutureTab = useCallback(
    () => onChangeSubscriptionTab?.(SubscriptionTabEnum.FUTURE),
    [onChangeSubscriptionTab],
  );

  const handleSetExpiredTab = useCallback(
    () => onChangeSubscriptionTab?.(SubscriptionTabEnum.EXPIRED),
    [onChangeSubscriptionTab],
  );

  const tabs = useMemo(
    () => [
      {
        type: SubscriptionTabEnum.ACTIVE,
        label: t('reworked.mySubscriptions.tab.active'),
        onClick: handleSetActiveTab,
      },
      {
        type: SubscriptionTabEnum.FUTURE,
        label: t('reworked.mySubscriptions.tab.future'),
        onClick: handleSetFutureTab,
      },
      {
        type: SubscriptionTabEnum.EXPIRED,
        label: t('reworked.mySubscriptions.tab.expired'),
        onClick: handleSetExpiredTab,
      },
    ],
    [handleSetActiveTab, handleSetFutureTab, handleSetExpiredTab, t],
  );

  return (
    <ConsumerGenericTabs<SubscriptionTab>
      selectedTab={selectedTab}
      tabs={tabs}
    />
  );
};

export default React.memo(ConsumerSubscriptionsTabs);
