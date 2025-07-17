import { useCallback } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import type { DailyTimeSlots } from '#src/pages/marketplace/passes/types';
import { useValidityInfoForAppointmentPassCard } from '#src/libs/marketplace/hooks/useValidityInfoForAppointmentPassCard';
import { getCreditsDividedValue } from '#src/libs/theme/utils';
import { usePassCardDataContext } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';

export const usePrivatePassCardData = () => {
  const { t } = useTranslation('marketplace');
  const { passCardData } = usePassCardDataContext();

  const { privatePass, privateServices, privateSlots } =
    passCardData?.privatePassData ?? {};

  const validity = useValidityInfoForAppointmentPassCard({
    durationYears: privatePass?.duration_years ?? 0,
    durationMonths: privatePass?.duration_months ?? 0,
    durationDays: privatePass?.duration_days ?? 0,
    startDateMethod: privatePass?.start_date_method ?? 0,
  });

  const privateServiceIds = privatePass?.private_services ?? [];

  const compatibleServices = Object.values(privateServices ?? [])
    .filter((privateService) => privateServiceIds.includes(privateService.id))
    .map((privateService) => {
      const slotIds = privateService?.slots ?? [];
      const populatedSlots = slotIds
        .map((slotId) => privateSlots?.[slotId])
        .filter((privateSlot) => !!privateSlot);
      const availableSlots =
        populatedSlots?.filter((slot) => slot?.available) ?? [];
      const areAllSlotsAvailable =
        populatedSlots?.length === availableSlots?.length &&
        populatedSlots.length > 0;

      return {
        ...privateService,
        slots: populatedSlots,
        availableSlots,
        areAllSlotsAvailable,
      };
    })
    .filter((privateService) => privateService.slots.length > 0);

  const getTimeSlotChipsLabels = useCallback(
    (timeSlot: DailyTimeSlots) => {
      if (!timeSlot?.slots?.length) return [];

      return timeSlot.slots.map((slot) => {
        const fromTime = DateTime.fromFormat(slot.from, 'H:m').toLocaleString(
          DateTime.TIME_SIMPLE,
        );
        const toTime = DateTime.fromFormat(slot.to, 'H:m').toLocaleString(
          DateTime.TIME_SIMPLE,
        );
        return `${fromTime} ${t('passes.to')} ${toTime}`;
      });
    },
    [t],
  );

  return {
    id: privatePass?.id,
    title: privatePass?.name,
    description: privatePass?.description,
    validity: validity,
    price: privatePass?.price ?? 0,
    tax: privatePass?.tax ?? 0,
    credits: getCreditsDividedValue(privatePass?.credits ?? 0),
    isCompatibleWithVod: privatePass?.full_vod_access,
    isNewMemberOnly: privatePass?.new_member_only,
    isUniversalPass: !!privatePass?.linked_payment_pack,
    compatibleServices: compatibleServices,
    hasNoCompatibleServices: compatibleServices.length === 0,
    getTimeSlotChipsLabels: getTimeSlotChipsLabels,
  };
};
