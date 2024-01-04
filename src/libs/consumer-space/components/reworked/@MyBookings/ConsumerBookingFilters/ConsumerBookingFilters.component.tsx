import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericFilters from '#libs/consumer-space/components/reworked/common/ConsumerGenericFilters';
import { BookingFilterTabEnum } from './constants';

import type { BookingFilterTab } from './types';

type Props = {
  selectedTab: BookingFilterTab;
  futureBookingsCount: number;
  onChangeFilterTab: (type: BookingFilterTab) => void;
  onDatePickerClick: () => void;
};

export const ConsumerBookingFilters: React.FC<Props> = ({
  selectedTab,
  futureBookingsCount,
  onChangeFilterTab,
  onDatePickerClick,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetFutureFilterTab = useCallback(
    () => onChangeFilterTab?.(BookingFilterTabEnum.FUTURE),
    [onChangeFilterTab],
  );

  const handleAppointmentBookingClick = useCallback(
    () => onChangeFilterTab?.(BookingFilterTabEnum.PAST),
    [onChangeFilterTab],
  );

  return (
    <ConsumerGenericFilters<BookingFilterTab>
      filters={[
        {
          hasBadge: futureBookingsCount > 0,
          type: BookingFilterTabEnum.FUTURE,
          label: t('consumerSpace:reworked.myBookings.filter.upcoming'),
          onClick: handleSetFutureFilterTab,
          value: futureBookingsCount,
        },
        {
          type: BookingFilterTabEnum.PAST,
          label: t('consumerSpace:reworked.myBookings.filter.past'),
          onClick: handleAppointmentBookingClick,
        },
      ]}
      onDatePickerClick={onDatePickerClick}
      selectedTab={selectedTab}
    />
  );
};

export default React.memo(ConsumerBookingFilters);
