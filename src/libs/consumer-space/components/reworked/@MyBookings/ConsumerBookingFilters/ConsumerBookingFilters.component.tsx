import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericFilters from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericFilters';
import { BookingFilterTabEnum } from './constants';

import type { BookingFilterTab } from './types';

type Props = {
  isMobile?: boolean;
  selectedTab: BookingFilterTab;
  futureBookingsCount: number;
  waitlistBookingsCount: number;
  isWaitlistFilterHidden?: boolean;
  onChangeFilterTab: (type: BookingFilterTab) => void;
};

export const ConsumerBookingFilters: React.FC<Props> = ({
  isMobile,
  selectedTab,
  futureBookingsCount,
  waitlistBookingsCount,
  isWaitlistFilterHidden,
  onChangeFilterTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetFutureFilterTab = useCallback(
    () => onChangeFilterTab?.(BookingFilterTabEnum.FUTURE),
    [onChangeFilterTab],
  );

  const handleSetPastBookingClick = useCallback(
    () => onChangeFilterTab?.(BookingFilterTabEnum.PAST),
    [onChangeFilterTab],
  );

  const handleSetWaitlistBookingClick = useCallback(
    () => onChangeFilterTab?.(BookingFilterTabEnum.WAITLIST),
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
          onClick: handleSetPastBookingClick,
        },
        !isWaitlistFilterHidden && {
          hasBadge: waitlistBookingsCount > 0,
          type: BookingFilterTabEnum.WAITLIST,
          label: t('consumerSpace:reworked.myBookings.filter.onWaitlist'),
          onClick: handleSetWaitlistBookingClick,
          value: waitlistBookingsCount,
        },
      ]}
      isMobile={isMobile}
      selectedTab={selectedTab}
    />
  );
};

export default React.memo(ConsumerBookingFilters);
