import { useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import { getTheme } from '#src/libs/theme/selectors';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { usePassCardDataContext } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';
import { useValidityInfoForPaymentPackCard } from '#src/libs/marketplace/hooks/useValidityInfoForPaymentPackCard';
import { getCreditsDividedValue } from '#src/libs/theme/utils';
import {
  getDailyTimeSlots,
  getPackRestrictions,
} from '#src/pages/marketplace/passes/utils';
import type { ChipData } from '#src/pages/marketplace/passes/components/chips-container/ChipsContainer';
import type { DailyTimeSlots } from '#src/pages/marketplace/passes/types';

export const usePaymentPackCardData = () => {
  const { t } = useTranslation('marketplace');
  const companyTheme = useSelector(getTheme);

  const { passCardData } = usePassCardDataContext();

  const { paymentPackData } = passCardData ?? {};
  const {
    validity_daterange,
    duration_years,
    duration_months,
    duration_days,
    start_date_method,
    id,
    name,
    description,
    price,
    tax,
    credits,
    onsite_payment_available,
    full_vod_access,
    only_vod_access,
    linked_private_pass,
    new_member_only,
    off_peak_schedule,
    max_bookings_per_day,
    max_bookings_per_week,
    max_bookings_per_month,
    allow_guest_pass,
    establishments,
    metaActivities,
    categories,
    unlimited,
  } = paymentPackData?.paymentPack ?? {};

  const isCompatibleWithAllActivities = metaActivities?.length === 0;
  const isCompatibleWithAllRooms = establishments?.length === 0;
  const isCompatibleWithAllCategories = categories?.length === 0;

  const compatibleMetaActivityLabels = useMemo(
    () =>
      paymentPackData?.metaActivities?.map((activity) => activity.name) ?? [],
    [paymentPackData?.metaActivities],
  );

  const compatibleRoomLabels = useMemo(
    () =>
      paymentPackData?.establishments?.map(
        (establishment) => establishment.title,
      ) ?? [],
    [paymentPackData?.establishments],
  );
  const compatibleCategoryLabels = useMemo(
    () =>
      Array.isArray(paymentPackData?.categories)
        ? paymentPackData.categories.map((category) => category.name)
        : [],
    [paymentPackData?.categories],
  );

  const timeSlots = useMemo(
    () => (!!off_peak_schedule ? getDailyTimeSlots(off_peak_schedule) : []),
    [off_peak_schedule],
  );

  const validity = useValidityInfoForPaymentPackCard({
    dateRange: validity_daterange,
    durationYears: duration_years ?? 0,
    durationMonths: duration_months ?? 0,
    durationDays: duration_days ?? 0,
    startDateMethod: start_date_method,
  });

  const categoryChipsData: ChipData[] = useMemo(
    () => compatibleCategoryLabels.map((label) => ({ label })),
    [compatibleCategoryLabels],
  );

  const metaActivityChipsData: ChipData[] = useMemo(
    () => compatibleMetaActivityLabels.map((label) => ({ label })),
    [compatibleMetaActivityLabels],
  );

  const roomChipsData: ChipData[] = useMemo(
    () => compatibleRoomLabels.map((label) => ({ label })),
    [compatibleRoomLabels],
  );

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

  const timeSlotsWithChipsData = useMemo(() => {
    return timeSlots.map((timeSlot) => ({
      ...timeSlot,
      chips: getTimeSlotChipsLabels(timeSlot).map((label) => ({ label })),
    }));
  }, [timeSlots, getTimeSlotChipsLabels]);

  return {
    id,
    title: name,
    description,
    validity,
    price: price ?? 0,
    tax,
    credits: getCreditsDividedValue(credits ?? 0),
    isOnsitePaymentAvailable: onsite_payment_available,
    isCompatibleWithVod: full_vod_access,
    isOnlyCompatibleWithVod: only_vod_access,
    isUniversal: linked_private_pass,
    isNewMemberOnly: new_member_only,
    isCompatibleWithAllActivities,
    isCompatibleWithAllRooms,
    isCompatibleWithAllCategories,
    compatibleRooms: paymentPackData?.establishments ?? [],
    establishments: establishments ?? [],
    metaActivities: metaActivities ?? [],
    categories: categories ?? [],
    timeSlots,
    restrictions: getPackRestrictions({
      maxBookingPerDay: max_bookings_per_day ?? null,
      maxBookingPerWeek: max_bookings_per_week ?? null,
      maxBookingPerMonth: max_bookings_per_month ?? null,
    }),
    isCompatibleWithBookingForGuest: !!(
      companyTheme?.allow_guest_activatable &&
      companyTheme?.allow_guest &&
      allow_guest_pass
    ),
    getTimeSlotChipsLabels: getTimeSlotChipsLabels,
    categoryChipsData,
    metaActivityChipsData,
    roomChipsData,
    timeSlotsWithChipsData,
    unlimited,
  };
};
