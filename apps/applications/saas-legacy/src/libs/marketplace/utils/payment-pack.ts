import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/master-data/payment-pack.js';

import { useMemo } from 'react';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { formatAsDate } from '../../../utils/datetime';

export const useValidityInfoForPaymentPackCard = (paymentPack: PaymentPack) => {
  const { t } = useTranslation('marketplace');
  const validityInfo = useMemo(() => {
    if (paymentPack.validity_daterange) {
      try {
        // @ts-expect-error
        const validityDateRange = JSON.parse(paymentPack.validity_daterange);
        return t('genericCard.validForDuration.validFromTo', {
          duration_date_start: formatAsDate(validityDateRange.lower),
          duration_date_end: formatAsDate(validityDateRange.upper),
          interpolation: { escapeValue: false },
        });
      } catch (error) {
        Sentry.captureException(error);
        return '';
      }
    }

    if (
      paymentPack.duration_years &&
      !paymentPack.duration_months &&
      !paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validYear', {
        count: paymentPack.duration_years,
      });
    }

    if (
      !paymentPack.duration_years &&
      paymentPack.duration_months &&
      !paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validMonth', {
        count: paymentPack.duration_months,
      });
    }

    if (
      !paymentPack.duration_years &&
      !paymentPack.duration_months &&
      paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validDay', {
        count: paymentPack.duration_days,
      });
    }

    if (
      paymentPack.duration_years &&
      paymentPack.duration_months &&
      !paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.year', {
          count: paymentPack.duration_years,
        }),
        second: t('genericCard.validity.month', {
          count: paymentPack.duration_months,
        }),
      });
    }

    if (
      paymentPack.duration_years &&
      !paymentPack.duration_months &&
      paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.year', {
          count: paymentPack.duration_years,
        }),
        second: t('genericCard.validity.day', {
          count: paymentPack.duration_days,
        }),
      });
    }

    if (
      !paymentPack.duration_years &&
      paymentPack.duration_months &&
      paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.month', {
          count: paymentPack.duration_months,
        }),
        second: t('genericCard.validity.day', {
          count: paymentPack.duration_days,
        }),
      });
    }

    if (
      !paymentPack.duration_years &&
      paymentPack.duration_months &&
      paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.month', {
          count: paymentPack.duration_months,
        }),
        second: t('genericCard.validity.day', {
          count: paymentPack.duration_days,
        }),
      });
    }

    if (
      paymentPack.duration_years &&
      paymentPack.duration_months &&
      paymentPack.duration_days
    ) {
      return t('genericCard.validForDuration.validDaysMonthsYears', {
        duration_years: t('genericCard.validity.year', {
          count: paymentPack.duration_years,
        }),
        duration_months: t('genericCard.validity.month', {
          count: paymentPack.duration_months,
        }),
        duration_days: t('genericCard.validity.day', {
          count: paymentPack.duration_days,
        }),
      });
    }

    if (!paymentPack.validity_daterange && paymentPack.start_date_method) {
      if (paymentPack.start_date_method === START_ON_FIRST_BOOKING) {
        return t('genericCard.validForDuration.booking');
      }
      if (paymentPack.start_date_method === START_ON_FIRST_ATTENDANCE) {
        return t('genericCard.validForDuration.attendance');
      }
      if (paymentPack.start_date_method === START_ON_PURCHASE) {
        return t('genericCard.validForDuration.purchase');
      }
    }
    return null;
  }, [t, paymentPack]);
  return validityInfo;
};

export const useCompatibilityInfoForPaymentPackDetailCard = (
  paymentPack: PaymentPack,
) => {
  const { t } = useTranslation('marketplace');
  const categoryInfo = useMemo(() => {
    const countCategories = paymentPack.categories?.length;
    const countActivities = paymentPack.metaActivities?.length;
    const countEstablishments = paymentPack.establishments?.length;

    if (!!countCategories && !!countActivities && !!countEstablishments) {
      return t(
        'genericCardDetails.compatibility.packs.categoriesAndActivitiesAndEstablishments',
        {
          categories: t('genericCardDetails.compatibility.categories', {
            count: countCategories,
          }),
          activities: t('genericCardDetails.compatibility.activities', {
            count: countActivities,
          }),
          establishments: t('genericCardDetails.compatibility.establishments', {
            count: countEstablishments,
          }),
        },
      );
    }
    if (!!countCategories && !!countActivities && !countEstablishments) {
      return t(
        'genericCardDetails.compatibility.packs.categoriesAndActivities',
        {
          categories: t('genericCardDetails.compatibility.categories', {
            count: countCategories,
          }),
          activities: t('genericCardDetails.compatibility.activities', {
            count: countActivities,
          }),
        },
      );
    }
    if (!!countCategories && !countActivities && !!countEstablishments) {
      return t(
        'genericCardDetails.compatibility.packs.categoriesAndEstablishment',
        {
          categories: t('genericCardDetails.compatibility.categories', {
            count: countCategories,
          }),
          establishments: t('genericCardDetails.compatibility.establishments', {
            count: countEstablishments,
          }),
        },
      );
    }
    if (!countCategories && !!countActivities && !!countEstablishments) {
      return t(
        'genericCardDetails.compatibility.packs.establishmentsAndActivities',
        {
          activities: t('genericCardDetails.compatibility.activities', {
            count: countActivities,
          }),
          establishments: t('genericCardDetails.compatibility.establishments', {
            count: countEstablishments,
          }),
        },
      );
    }
    if (!!countCategories && !countActivities && !countEstablishments) {
      return t('genericCardDetails.compatibility.packs.categories', {
        count: countCategories,
      });
    }
    if (!countCategories && !!countActivities && !countEstablishments) {
      return t('genericCardDetails.compatibility.packs.activities', {
        count: countActivities,
      });
    }
    if (!countCategories && !countActivities && !!countEstablishments) {
      return t('genericCardDetails.compatibility.packs.establishments', {
        count: countEstablishments,
      });
    }
    return null;
  }, [t, paymentPack]);
  return categoryInfo;
};

export const formatOffPeakScheduleOnDisplay = (
  off_peak_schedule: Record<string, string[][]>,
): Record<string, string[][]> => {
  const formattedOffPeakSchedule = {};
  if (off_peak_schedule) {
    Object.entries(off_peak_schedule).forEach((days) => {
      // @ts-expect-error
      if (!formattedOffPeakSchedule[days[0][0]]) {
        // @ts-expect-error
        formattedOffPeakSchedule[days[0][0]] = [];
      }
      Object.values(days[1]).forEach((dates) => {
        const [start_time, end_time] = Object.values(dates);
        // @ts-expect-error
        formattedOffPeakSchedule[days[0][0]].push([start_time, end_time]);
      });
    });
  }
  return formattedOffPeakSchedule;
};
