import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ChipColor } from '#Fabrique/Chip';

import {
  CreditCardX,
  Home03,
  UserX01,
  UsersPlus,
  VideoRecorder,
  XCircle,
} from '#src/components/untitledui';

import { ConsumerGenericCardHeader } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import type { ConsumerBookingCardProps } from '..';

type Props = Required<
  Pick<
    ConsumerBookingCardProps,
    | 'offerDate'
    | 'activityName'
    | 'isBookingCancelled'
    | 'isOnline'
    | 'isBookedForAGuest'
    | 'isUnpaid'
    | 'isAtHome'
    | 'isNoShow'
  >
>;

const ConsumerBookingCardHeader: React.FC<Props> = ({
  offerDate,
  activityName,
  isBookingCancelled,
  isOnline,
  isBookedForAGuest,
  isUnpaid,
  isAtHome,
  isNoShow,
}) => {
  const { t } = useTranslation('consumerSpace');
  const chipsDataList = React.useMemo(
    () => [
      {
        shouldDisplay: isOnline,
        chipColor: 'grey' as ChipColor,
        leftIcon: <VideoRecorder stroke="currentColor" />,
        text: t('reworked.myBookings.consumerBookingCard.chip.online'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay: isAtHome,
        chipColor: 'grey' as ChipColor,
        leftIcon: <Home03 stroke="currentColor" />,
        text: t('reworked.myBookings.consumerBookingCard.chip.atHome'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay: isUnpaid,
        chipColor: 'warning' as ChipColor,
        leftIcon: <CreditCardX stroke="currentColor" />,
        text: t('reworked.myBookings.consumerBookingCard.chip.status.unpaid'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay: isBookedForAGuest,
        chipColor: 'info' as ChipColor,
        leftIcon: <UsersPlus stroke="currentColor" />,
        text: t(
          'reworked.myBookings.consumerBookingCard.chip.status.bookedForAGuest',
        ),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay: isBookingCancelled,
        chipColor: 'error' as ChipColor,
        leftIcon: <XCircle stroke="currentColor" />,
        text: t(
          'reworked.myBookings.consumerBookingCard.chip.status.cancelled',
        ),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay: isNoShow,
        chipColor: 'warning' as ChipColor,
        leftIcon: <UserX01 stroke="currentColor" />,
        text: t('reworked.myBookings.consumerBookingCard.chip.noShow'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
    ],
    [
      isOnline,
      isAtHome,
      isUnpaid,
      isBookedForAGuest,
      isBookingCancelled,
      isNoShow,
      t,
    ],
  );
  return (
    <ConsumerGenericCardHeader
      chipsDataList={chipsDataList}
      chipsWrapperClassName="bs-consumer__booking-card__header__chips-wrapper"
      className="bs-consumer__booking-card__header"
      subtitle={activityName}
      title={offerDate}
    />
  );
};

export default React.memo(ConsumerBookingCardHeader);
