import uniq from 'lodash/uniq';
import { useSelector } from 'react-redux';
import { getTheme } from '#src/libs/theme/selectors';

import type { ConsumerPaymentPackReworked } from '#src/libs/consumer-payment-pack/types';
import type {
  ConsumerPassRestriction,
  ConsumerPaymentPackCompatibility,
} from '#src/libs/consumer-space/types';
import type { ConsumerPaymentPackDetailsCardProps } from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard';

const useConsumerPaymentPackData = (
  consumerPaymentPack: ConsumerPaymentPackReworked | null,
): Omit<
  Required<ConsumerPaymentPackDetailsCardProps>,
  | 'className'
  | 'compatibleEstablishments'
  | 'isLoading'
  | 'isMobile'
  | 'showPlaceholder'
  | 'suspensionDate'
> => {
  const companyTheme = useSelector(getTheme);

  const name = consumerPaymentPack?.payment_pack?.name;

  const description = consumerPaymentPack?.payment_pack?.description;

  const creditsLeft = consumerPaymentPack?.available_credits;

  const totalCredits = consumerPaymentPack?.payment_pack?.credits || 0;

  const isUnlimited = !consumerPaymentPack?.payment_pack?.credits;

  const isCompatibleWithBookingForGuest =
    companyTheme?.allow_guest_activatable &&
    companyTheme?.allow_guest &&
    consumerPaymentPack?.payment_pack?.allow_guest_pass;

  const startDate = consumerPaymentPack?.starting_date;

  const expirationDate = consumerPaymentPack?.ending_date;

  const isSuspended = consumerPaymentPack?.disabled;

  const sharedWith =
    consumerPaymentPack?.src_consumer_payment_pack?.map(
      (consumerPaymentPackLink) => consumerPaymentPackLink?.dst_member_name,
    ) || null;

  const sharedBy =
    consumerPaymentPack?.dst_consumer_payment_pack?.dst_member_name || null;

  const timeSlots = consumerPaymentPack?.payment_pack?.off_peak_schedule
    ? Object.keys(consumerPaymentPack.payment_pack.off_peak_schedule)?.reduce(
        (acc, key) => [
          ...acc,
          ...consumerPaymentPack.payment_pack.off_peak_schedule[key]?.map(
            (timeSlot) => ({
              dayOfWeek: parseInt(key) - 1,
              from: timeSlot[0],
              to: timeSlot[1],
            }),
          ),
        ],
        [],
      )
    : null;

  const isCompatibleWithVod =
    consumerPaymentPack?.payment_pack?.full_vod_access;

  const metaActivityCompatibilities = uniq(
    consumerPaymentPack?.payment_pack?.metaActivities?.map((metaActivity) =>
      metaActivity?.name
        ? ({
            type: 'activity',
            label: metaActivity?.name,
          } as ConsumerPaymentPackCompatibility)
        : null,
    ) || [],
  ).filter((metaActivity) => !!metaActivity);

  const roomCompatibilities = uniq(
    consumerPaymentPack?.payment_pack?.establishments?.map((establishment) =>
      establishment?.title
        ? ({
            type: 'room',
            label: establishment?.title,
          } as ConsumerPaymentPackCompatibility)
        : null,
    ) || [],
  ).filter((establishment) => !!establishment);

  const categoryCompatibilities = uniq(
    consumerPaymentPack?.payment_pack?.SCTs?.map((category) =>
      category?.name
        ? ({
            type: 'category',
            label: category?.name,
          } as ConsumerPaymentPackCompatibility)
        : null,
    ) || [],
  ).filter((category) => !!category);

  const restrictions = [
    ...(consumerPaymentPack?.payment_pack?.max_bookings_per_day
      ? [
          {
            frequency: 'day',
            amount: consumerPaymentPack.payment_pack.max_bookings_per_day,
          } as ConsumerPassRestriction,
        ]
      : []),
    ...(consumerPaymentPack?.payment_pack?.max_bookings_per_week
      ? [
          {
            frequency: 'week',
            amount: consumerPaymentPack.payment_pack.max_bookings_per_week,
          } as ConsumerPassRestriction,
        ]
      : []),
    ...(consumerPaymentPack?.payment_pack?.max_bookings_per_month
      ? [
          {
            frequency: 'month',
            amount: consumerPaymentPack.payment_pack.max_bookings_per_month,
          } as ConsumerPassRestriction,
        ]
      : []),
  ];

  return {
    activityCompatibilities: [
      ...metaActivityCompatibilities,
      ...roomCompatibilities,
      ...categoryCompatibilities,
    ],
    creditsLeft,
    isCompatibleWithBookingForGuest,
    description,
    expirationDate,
    isSuspended,
    isUnlimited,
    name,
    restrictions,
    sharedBy,
    sharedWith,
    startDate,
    timeSlots,
    totalCredits,
    isCompatibleWithVod,
  };
};

export default useConsumerPaymentPackData;
