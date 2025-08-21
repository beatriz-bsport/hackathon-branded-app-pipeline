import { useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import {
  getTheme,
  getCurrencyDisplayWithPrice,
} from '#src/libs/theme/selectors';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { usePassCardDataContext } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';
import { useValidityInfoForPaymentPackCard } from '#src/libs/marketplace/hooks/useValidityInfoForPaymentPackCard';
import { getCreditsDividedValue } from '#src/libs/theme/utils';
import {
  getDailyTimeSlots,
  getPackRestrictions,
} from '#src/pages/marketplace/passes/utils';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#src/libs/payment-packs/constants';
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
    penalty_active,
    penalty_kind,
    penalty_days_blocked,
    penalty_nb_late_cancellations,
    penalty_nb_days,
    penalty_account_value,
    no_show_penalty_active,
    no_show_penalty_kind,
    no_show_penalty_threshold,
    no_show_penalty_time_window_days,
    no_show_penalty_days_blocked,
    no_show_penalty_amount,
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

  const penaltyInfo = useMemo(() => {
    if (!penalty_active) return null;

    if (penalty_kind === PENALTY_KIND_BLOCK_CPP) {
      return t('genericCardDetails.includedElements.penalty.days', {
        penalty_days: t(
          'genericCardDetails.includedElements.penalty.penaltyDay',
          {
            count: penalty_days_blocked,
          },
        ),
        penalty_cancellations: t(
          'genericCardDetails.includedElements.cancellation',
          {
            count: penalty_nb_late_cancellations,
          },
        ),
        penalty_days_period: t(
          'genericCardDetails.includedElements.penalty.penaltyDay',
          {
            count: penalty_nb_days,
          },
        ),
      });
    }

    if (penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT) {
      return t('genericCardDetails.includedElements.penalty.amount', {
        penalty_amount: getCurrencyDisplayWithPrice(penalty_account_value),
        penalty_cancellations: t(
          'genericCardDetails.includedElements.cancellation',
          { count: penalty_nb_late_cancellations },
        ),
        penalty_days_period: t(
          'genericCardDetails.includedElements.penalty.penaltyDay',
          { count: penalty_nb_days },
        ),
      });
    }

    return null;
  }, [
    penalty_active,
    penalty_kind,
    penalty_days_blocked,
    penalty_nb_late_cancellations,
    penalty_nb_days,
    penalty_account_value,
    t,
  ]);

  const noShowPenaltyInfo = useMemo(() => {
    if (!no_show_penalty_active) return null;

    const penaltyThresholdMessage = t(
      'genericCardDetails.includedElements.penaltyNoShow.threshold',
      {
        count: no_show_penalty_threshold,
      },
    );

    const penaltyTimeWindowMessage = t(
      'genericCardDetails.includedElements.penaltyNoShow.penaltyDay',
      {
        count: no_show_penalty_time_window_days,
      },
    );

    const penaltyDaysBlockedMessage =
      no_show_penalty_days_blocked &&
      t('genericCardDetails.includedElements.penaltyNoShow.penaltyDay', {
        count: no_show_penalty_days_blocked,
      });

    const penaltyAmountMessage =
      no_show_penalty_amount &&
      getCurrencyDisplayWithPrice(no_show_penalty_amount);

    if (no_show_penalty_kind === PENALTY_KIND_BLOCK_CPP) {
      return t('genericCardDetails.includedElements.penaltyNoShow.block', {
        days_blocked: penaltyDaysBlockedMessage,
        threshold: penaltyThresholdMessage,
        time_window_days: penaltyTimeWindowMessage,
      });
    }

    if (no_show_penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT) {
      return t('genericCardDetails.includedElements.penaltyNoShow.account', {
        amount: penaltyAmountMessage,
        threshold: penaltyThresholdMessage,
        time_window_days: penaltyTimeWindowMessage,
      });
    }

    return null;
  }, [
    no_show_penalty_active,
    no_show_penalty_kind,
    no_show_penalty_threshold,
    no_show_penalty_time_window_days,
    no_show_penalty_days_blocked,
    no_show_penalty_amount,
    t,
  ]);

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
    penaltyInfo,
    isPenaltyActive: penalty_active,
    noShowPenaltyInfo,
    isNoShowPenaltyActive: no_show_penalty_active,
  };
};
