import uniq from 'lodash/uniq';
import { getTheme } from '#src/libs/theme/selectors';
import { useSelector } from 'react-redux';

import type {
  ConsumerPaymentPackCompatibility,
  PrivateConsumerPassCompatibility,
} from '#src/libs/consumer-space/types';
import type { UniversalPassReworked } from '#src/libs/universal-pass/types';
import { PrivateServiceCompatibilityPass } from '#src/libs/private-service/types';
import type { UniversalPassDetailsCardProps } from '#src/libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsCard';

const getPrivateServiceCompatibilityPassData = (
  privateServiceCompatibilityPass: PrivateServiceCompatibilityPass,
): PrivateConsumerPassCompatibility => {
  const name = privateServiceCompatibilityPass?.private_service?.name;
  if (privateServiceCompatibilityPass?.excluded_slot_ids?.length) {
    const included_sessions_names =
      privateServiceCompatibilityPass?.private_service?.slots
        ?.filter(
          (slot) =>
            !privateServiceCompatibilityPass?.excluded_slot_ids?.includes(
              slot.id,
            ),
        )
        ?.map((slot) => slot.name);
    return {
      name,
      sessions: included_sessions_names,
    };
  }
  return {
    name: privateServiceCompatibilityPass?.private_service?.name,
    allSessions: true,
  };
};

const useUniversalPassData = (
  universalPass: UniversalPassReworked | null,
): Omit<
  Required<UniversalPassDetailsCardProps>,
  | 'className'
  | 'compatibleEstablishments'
  | 'isLoading'
  | 'isMobile'
  | 'showPlaceholder'
  | 'suspensionDate'
> => {
  const companyTheme = useSelector(getTheme);

  const name = universalPass?.consumer_payment_pack?.payment_pack?.name;

  const description =
    universalPass?.consumer_payment_pack?.payment_pack?.description;

  const creditsLeft = universalPass?.consumer_payment_pack?.available_credits;

  const totalCredits =
    universalPass?.consumer_payment_pack?.payment_pack?.credits || 0;

  const isUnlimited =
    !universalPass?.consumer_payment_pack?.payment_pack?.credits;

  const isCompatibleWithBookingForGuest =
    companyTheme?.allow_guest_activatable &&
    companyTheme?.allow_guest &&
    universalPass?.consumer_payment_pack?.payment_pack?.allow_guest_pass;

  const startDate = universalPass?.consumer_payment_pack?.starting_date;

  const expirationDate = universalPass?.consumer_payment_pack?.ending_date;

  const isSuspended = universalPass?.consumer_payment_pack?.disabled;

  const sharedWith =
    universalPass?.consumer_payment_pack?.src_consumer_payment_pack?.map(
      (consumerPaymentPackLink) => consumerPaymentPackLink?.dst_member_name,
    ) || null;

  const sharedBy =
    universalPass?.consumer_payment_pack?.dst_consumer_payment_pack
      ?.src_member_name || null;

  const timeSlots = universalPass?.consumer_payment_pack?.payment_pack
    ?.off_peak_schedule
    ? Object.keys(
        universalPass?.consumer_payment_pack.payment_pack.off_peak_schedule,
      )?.reduce(
        (acc, key) => [
          ...acc,
          ...universalPass?.consumer_payment_pack.payment_pack.off_peak_schedule[
            key
          ]?.map((timeSlot) => ({
            dayOfWeek: parseInt(key) - 1,
            from: timeSlot[0],
            to: timeSlot[1],
          })),
        ],
        [],
      )
    : null;

  const isCompatibleWithVod =
    universalPass?.consumer_payment_pack?.payment_pack?.full_vod_access;

  const metaActivityCompatibilities = uniq(
    universalPass?.consumer_payment_pack?.payment_pack?.metaActivities?.map(
      (metaActivity) =>
        metaActivity?.name
          ? ({
              type: 'activity',
              label: metaActivity?.name,
            } as ConsumerPaymentPackCompatibility)
          : null,
    ) || [],
  ).filter((e) => !!e);

  const roomCompatibilities = uniq(
    universalPass?.consumer_payment_pack?.payment_pack?.establishments?.map(
      (establishment) =>
        establishment?.title
          ? ({
              type: 'room',
              label: establishment?.title,
            } as ConsumerPaymentPackCompatibility)
          : null,
    ) || [],
  ).filter((e) => !!e);

  const categoryCompatibilities = uniq(
    universalPass?.consumer_payment_pack?.payment_pack?.SCTs?.map((category) =>
      category?.name
        ? ({
            type: 'category',
            label: category?.name,
          } as ConsumerPaymentPackCompatibility)
        : null,
    ) || [],
  ).filter((e) => !!e);

  const appointmentCompatibilities =
    universalPass?.private_consumer_pass?.private_pass?.private_services?.map(
      getPrivateServiceCompatibilityPassData,
    );

  return {
    activityCompatibilities: [
      ...metaActivityCompatibilities,
      ...roomCompatibilities,
      ...categoryCompatibilities,
    ],
    appointmentCompatibilities,
    creditsLeft,
    description,
    expirationDate,
    isCompatibleWithBookingForGuest,
    isCompatibleWithVod,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    timeSlots,
    totalCredits,
  };
};

export default useUniversalPassData;
