import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericFilters from '#libs/consumer-space/components/reworked/common/ConsumerGenericFilters';
import { SubscriptionTabEnum } from '#libs/consumer-space/components/reworked/@MySubscriptions/constants';
import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';

type Props = {
  selectedTab: SubscriptionTab;
  onChangeSubscriptionTab: (type: SubscriptionTab) => void;
  activeBookingsCount: number;
  futureBookingsCount: number;
};

export const ConsumerSubscriptionsTabs: React.FC<Props> = ({
  selectedTab,
  onChangeSubscriptionTab,
  activeBookingsCount,
  futureBookingsCount,
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
        hasBadge: activeBookingsCount > 0,
        type: SubscriptionTabEnum.ACTIVE,
        label: t('reworked.mySubscriptions.tab.active'),
        onClick: handleSetActiveTab,
        value: activeBookingsCount,
      },
      {
        hasBadge: futureBookingsCount > 0,
        type: SubscriptionTabEnum.FUTURE,
        label: t('reworked.mySubscriptions.tab.future'),
        onClick: handleSetFutureTab,
        value: futureBookingsCount,
      },
      {
        type: SubscriptionTabEnum.EXPIRED,
        label: t('reworked.mySubscriptions.tab.expired'),
        onClick: handleSetExpiredTab,
      },
    ],
    [
      activeBookingsCount,
      futureBookingsCount,
      handleSetActiveTab,
      handleSetFutureTab,
      handleSetExpiredTab,
      t,
    ],
  );

  return (
    <ConsumerGenericFilters<SubscriptionTab>
      filters={tabs}
      selectedTab={selectedTab}
    />
  );
};

export default React.memo(ConsumerSubscriptionsTabs);
