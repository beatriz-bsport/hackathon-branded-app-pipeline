import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { DateTime } from 'luxon';
import { uniq } from 'lodash';
import { useTranslation } from 'react-i18next';
import type { RootState } from '#src/reducers';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { getPaymentPack } from '#src/libs/payment-packs/selectors';
import { getTheme } from '#src/libs/theme/selectors';
import { getActivitiesByIdList } from '#src/libs/meta-activity/selectors';
import { getAllEstablishments } from '#src/libs/establishment/selectors';
import { getSCTs } from '#src/libs/category/selectors';
import { useValidityInfoForPaymentPackCard } from '#src/pages/marketplace/passes/hooks/useValidityInfoForPaymentPackCard';
import type { DailyTimeSlots } from '#src/pages/marketplace/passes/types';
import {
  getDailyTimeSlots,
  getPackRestrictions,
} from '#src/pages/marketplace/passes/utils';

/**
 * A custom hook that retrieves and formats all relevant data required
 * to display the detail modal for a specific payment pack.
 *
 */
export const usePaymentPackModalData = (id: number) => {
  const { t } = useTranslation('marketplace');
  const companyTheme = useSelector(getTheme);
  const paymentPack: PaymentPack =
    useSelector((state: RootState) => getPaymentPack(state, id)) ?? {};

  const validity = useValidityInfoForPaymentPackCard({
    dateRange: paymentPack.validity_daterange,
    durationYears: paymentPack.duration_years ?? 0,
    durationMonths: paymentPack.duration_months ?? 0,
    durationDays: paymentPack.duration_days ?? 0,
    startDateMethod: paymentPack.start_date_method,
  });

  const metaActivityIds = uniq(
    paymentPack?.metaActivities?.map((metaActivity) => metaActivity) || [],
  );
  const establishmentsIds = uniq(
    paymentPack?.establishments?.map((establishment) => establishment) || [],
  );
  const SCTsIds = uniq(paymentPack?.SCTs?.map((SCT) => SCT) || []);

  const activities = useSelector((state: RootState) =>
    getActivitiesByIdList(state, metaActivityIds)?.asMutable(),
  );

  const allEstablishments = useSelector(getAllEstablishments);
  const establishments = allEstablishments
    .filter((establishment) => establishmentsIds.includes(establishment.id))
    .asMutable({ deep: true });

  const allSCTs = useSelector((state: RootState) => getSCTs(state));
  const SCTs = allSCTs.filter((sct) => SCTsIds.includes(sct.id));

  const compatibleMetaActivityLabels = activities.map(
    (activity) => activity.name,
  );
  const compatibleRoomLabels = establishments.map(
    (establishment) => establishment.title,
  );
  const compatibleCategoryLabels = SCTs.map((SCT) => SCT.name);

  const isCompatibleWithAllActivities = activities.length === 0;
  const isCompatibleWithAllRooms = establishments.length === 0;
  const isCompatibleWithAllCategories = SCTs.length === 0;

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
    id: paymentPack.id,
    title: paymentPack.name,
    description: paymentPack.description,
    validity: validity,
    price: paymentPack.price,
    credits: paymentPack.credits ?? 0,
    isOnsitePaymentAvailable: paymentPack.onsite_payment_available,
    isCompatibleWithVod: paymentPack?.full_vod_access,
    isOnlyCompatibleWithVod: paymentPack?.only_vod_access,
    isUniversal: paymentPack?.linked_private_pass,
    isNewMemberOnly: paymentPack?.new_member_only,
    isCompatibleWithAllActivities: isCompatibleWithAllActivities,
    isCompatibleWithAllRooms: isCompatibleWithAllRooms,
    isCompatibleWithAllCategories: isCompatibleWithAllCategories,
    compatibleEstablishments: establishments,
    compatibleMetaActivityLabels: compatibleMetaActivityLabels,
    compatibleRoomLabels: compatibleRoomLabels,
    compatibleCategoryLabels: compatibleCategoryLabels,
    timeSlots: getDailyTimeSlots(paymentPack.off_peak_schedule),
    restrictions: getPackRestrictions({
      maxBookingPerDay: paymentPack.max_bookings_per_day,
      maxBookingPerWeek: paymentPack.max_bookings_per_week,
      maxBookingPerMonth: paymentPack.max_bookings_per_month,
    }),
    isCompatibleWithBookingForGuest: !!(
      companyTheme?.allow_guest_activatable &&
      companyTheme?.allow_guest &&
      paymentPack?.allow_guest_pass
    ),
    getTimeSlotChipsLabels: getTimeSlotChipsLabels,
  };
};
