import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import type { RootState } from '#src/reducers';
import type { PrivatePass } from '#src/libs/private-service/types';
import { getPrivatePass } from '#src/libs/private-service/selectors/private-pass';
import type { DailyTimeSlots } from '#src/pages/marketplace/passes/types';
import { useValidityInfoForAppointmentPassCard } from '#src/pages/marketplace/passes/hooks/useValidityInfoForAppointmentPassCard';
import { getAllPrivateSlotsDict } from '#src/libs/private-service/selectors/private-slot';
import { _getPrivateServicesById } from '#src/libs/private-service/selectors/private-service';

/**
 * A custom hook that retrieves and formats all relevant data required
 * to display the appointment detail modal for a specific private pass.
 *
 */
export const usePrivatePassModalData = (id: number | null) => {
  const { t } = useTranslation('marketplace');
  const privatePass: PrivatePass | null = useSelector((state: RootState) =>
    id ? getPrivatePass(state, id) : null,
  );

  const validity = useValidityInfoForAppointmentPassCard({
    durationYears: privatePass?.duration_years ?? 0,
    durationMonths: privatePass?.duration_months ?? 0,
    durationDays: privatePass?.duration_days ?? 0,
    startDateMethod: privatePass?.start_date_method ?? 0,
  });

  const privateServices =
    useSelector((state: RootState) => _getPrivateServicesById(state)) ?? {};

  const privateSlots =
    useSelector((state: RootState) => getAllPrivateSlotsDict(state)) ?? {};

  const privateServiceIds = privatePass?.private_services ?? [];

  const compatibleServices = Object.values(privateServices)
    .filter((privateService) => privateServiceIds.includes(privateService.id))
    .map((privateService) => {
      const slotIds = privateService?.slots ?? [];
      const populatedSlots = slotIds
        .map((slotId) => privateSlots[slotId])
        .filter(Boolean);
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
    price: privatePass?.price,
    credits: privatePass?.credits ?? 0,
    isCompatibleWithVod: privatePass?.full_vod_access,
    isNewMemberOnly: privatePass?.new_member_only,
    isUniversalPass: !!privatePass?.linked_payment_pack,
    compatibleServices: compatibleServices,
    hasNoCompatibleServices: compatibleServices.length === 0,
    getTimeSlotChipsLabels: getTimeSlotChipsLabels,
  };
};
