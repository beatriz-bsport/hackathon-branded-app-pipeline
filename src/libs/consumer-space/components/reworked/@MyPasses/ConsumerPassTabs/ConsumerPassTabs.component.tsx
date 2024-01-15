import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericTabs from '#libs/consumer-space/components/reworked/common/ConsumerGenericTabs';
import { PassTabEnum } from './constants';

import type { PassTab } from './types';

type Props = {
  selectedTab: PassTab;
  onChangePassTab: (type: PassTab) => void;
};

export const ConsumerPassTabs: React.FC<Props> = ({
  selectedTab,
  onChangePassTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetActivityPassTab = useCallback(
    () => onChangePassTab(PassTabEnum.CONSUMER_PAYMENT_PACK),
    [onChangePassTab],
  );

  const handleSetAppointmentPassTab = useCallback(
    () => onChangePassTab(PassTabEnum.PRIVATE_CONSUMER_PASS),
    [onChangePassTab],
  );

  const tabs = useMemo(
    () => [
      {
        type: PassTabEnum.CONSUMER_PAYMENT_PACK,
        label: t('reworked.myPasses.tab.activity'),
        onClick: handleSetActivityPassTab,
      },
      {
        type: PassTabEnum.PRIVATE_CONSUMER_PASS,
        label: t('reworked.myPasses.tab.appointment'),
        onClick: handleSetAppointmentPassTab,
      },
    ],
    [handleSetActivityPassTab, handleSetAppointmentPassTab, t],
  );

  return <ConsumerGenericTabs<PassTab> selectedTab={selectedTab} tabs={tabs} />;
};

export default React.memo(ConsumerPassTabs);
