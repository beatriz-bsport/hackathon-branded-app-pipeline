import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import ConsumerGenericFilters from '#libs/consumer-space/components/reworked/common/ConsumerGenericFilters';
import { PassFilterTabEnum } from './constants';

import type { PassFilterTab } from './types';

type Props = {
  selectedTab: PassFilterTab;
  futurePassesCount: number;
  activePassesCount: number;
  expiredPassesCount?: number;
  onChangeFilterTab: (type: PassFilterTab) => void;
};

export const ConsumerPassFilters: React.FC<Props> = ({
  selectedTab,
  futurePassesCount,
  activePassesCount,
  expiredPassesCount = 0,
  onChangeFilterTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetActiveFilterTab = useCallback(
    () => onChangeFilterTab(PassFilterTabEnum.ACTIVE),
    [onChangeFilterTab],
  );

  const handleSetFutureFilterTab = useCallback(
    () => onChangeFilterTab(PassFilterTabEnum.FUTURE),
    [onChangeFilterTab],
  );

  const handleSetExpiredFilterTab = useCallback(
    () => onChangeFilterTab(PassFilterTabEnum.EXPIRED),
    [onChangeFilterTab],
  );

  const filters = useMemo(
    () => [
      {
        hasBadge: activePassesCount > 0,
        type: PassFilterTabEnum.ACTIVE,
        label: t('reworked.myPasses.filters.active'),
        onClick: handleSetActiveFilterTab,
        value: activePassesCount,
      },
      {
        hasBadge: futurePassesCount > 0,
        type: PassFilterTabEnum.FUTURE,
        label: t('reworked.myPasses.filters.future'),
        onClick: handleSetFutureFilterTab,
        value: futurePassesCount,
      },
      {
        hasBadge: expiredPassesCount > 0,
        type: PassFilterTabEnum.EXPIRED,
        label: t('reworked.myPasses.filters.expired'),
        onClick: handleSetExpiredFilterTab,
        value: expiredPassesCount,
      },
    ],
    [
      t,
      handleSetActiveFilterTab,
      handleSetFutureFilterTab,
      handleSetExpiredFilterTab,
      activePassesCount,
      futurePassesCount,
      expiredPassesCount,
    ],
  );
  return (
    <ConsumerGenericFilters<PassFilterTab>
      filters={filters}
      selectedTab={selectedTab}
    />
  );
};

export default React.memo(ConsumerPassFilters);
