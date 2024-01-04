import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericTabs from '#libs/consumer-space/components/reworked/common/ConsumerGenericTabs';
import { BookingTabEnum } from './constants';

import type { BookingTab } from './types';

type Props = {
  selectedTab: BookingTab;
  onChangeBookingTab: (type: BookingTab) => void;
};

export const ConsumerBookingTabs: React.FC<Props> = ({
  selectedTab,
  onChangeBookingTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetActivityBookingTab = useCallback(
    () => onChangeBookingTab?.(BookingTabEnum.ACTIVITY),
    [onChangeBookingTab],
  );

  const handleSetWorkshopBookingTab = useCallback(
    () => onChangeBookingTab?.(BookingTabEnum.WORKSHOP),
    [onChangeBookingTab],
  );

  return (
    <ConsumerGenericTabs<BookingTab>
      selectedTab={selectedTab}
      tabs={[
        {
          type: BookingTabEnum.ACTIVITY,
          label: t('reworked.myBookings.tab.activities'),
          onClick: handleSetActivityBookingTab,
        },
        {
          type: BookingTabEnum.WORKSHOP,
          label: t('reworked.myBookings.tab.workshops'),
          onClick: handleSetWorkshopBookingTab,
        },
      ]}
    />
  );
};

export default React.memo(ConsumerBookingTabs);
