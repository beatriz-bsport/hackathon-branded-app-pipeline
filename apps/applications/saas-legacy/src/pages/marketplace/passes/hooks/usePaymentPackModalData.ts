import { useCallback } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import type { DailyTimeSlots } from '#src/pages/marketplace/passes/types';
const mockPassDetail = {
  title: 'Pass test',
  description: `This is a pass description.
Unlimited access to all classes. Priority access to the schedule. Memberships renew automatically at the end of their term (unless cancelled prior to renewal). 
- Unlimited access to all classes
- Early access to the schedule
- 6 months commitment`,
  validity: 'Valid for 1 month',
  price: 20,
  credits: 1,
  isOnsitePaymentAvailable: true,
  isCompatibleWithVod: true,
  isOnlyCompatibleWithVod: false,
  isUniversal: false,
  isNewMemberOnly: true,
  isCompatibleWithAllActivities: false,
  isCompatibleWithAllRooms: false,
  isCompatibleWithAllCategories: false,
  compatibleEstablishments: [
    {
      id: 1,
      title: 'Local Gym',
      specific_info: 'Local Gym',
      capacity: 30,
      has_next_slots: false,
      cover: undefined as undefined,
    },
    {
      id: 2,
      title: 'Test Gym',
      specific_info: 'Test gym description',
      capacity: 30,
      has_next_slots: true,
    },
  ],
  compatibleMetaActivityLabels: ['Gym training'],
  compatibleRoomLabels: ['Local Gym', 'Test Gym'],
  compatibleCategoryLabels: ['Yoga'],
  timeSlots: [
    { dayOfWeek: 0, slots: [{ from: '00:00', to: '14:00' }] },
    {
      dayOfWeek: 1,
      slots: [
        { from: '06:00', to: '07:00' },
        { from: '09:00', to: '10:00' },
        { from: '11:00', to: '13:00' },
      ],
    },
    { dayOfWeek: 2, slots: [{ from: '00:00', to: '14:00' }] },
    { dayOfWeek: 4, slots: [{ from: '00:00', to: '14:00' }] },
  ],
  restrictions: [
    {
      frequency: 'daily',
      amount: 1,
    },
  ],
  isCompatibleWithBookingForGuest: false,
};

/**
 * A custom hook that retrieves and formats all relevant data required
 * to display the detail modal for a specific payment pack.
 *
 */
export const usePaymentPackModalData = (id: number) => {
  const { t } = useTranslation('marketplace');
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
    id,
    ...mockPassDetail,
    getTimeSlotChipsLabels: getTimeSlotChipsLabels,
  };
};
