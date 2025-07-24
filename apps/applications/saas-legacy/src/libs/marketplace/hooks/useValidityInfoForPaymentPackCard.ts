import { useTranslation } from 'react-i18next';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack.js';

import { formatAsDate } from '#src/utils/datetime';
import type { CardValidityInfo } from '#src/pages/marketplace/passes/types';

export const useValidityInfoForPaymentPackCard = (
  packValidityInfo: CardValidityInfo,
) => {
  const { t } = useTranslation('marketplace');

  if (packValidityInfo?.dateRange) {
    try {
      // @ts-expect-error One of these days, we will have a type for this
      const validityDateRange = JSON.parse(packValidityInfo.dateRange);
      return t('genericCard.validForDuration.validFromTo', {
        duration_date_start: formatAsDate(validityDateRange.lower),
        duration_date_end: formatAsDate(validityDateRange.upper),
        interpolation: { escapeValue: false },
      });
    } catch (error) {
      console.error('Failed to parse dateRange:', error);
      return null;
    }
  }

  if (
    packValidityInfo?.durationYears &&
    !packValidityInfo?.durationMonths &&
    !packValidityInfo?.durationDays
  ) {
    return t('genericCard.validForDuration.validYear', {
      count: packValidityInfo.durationYears,
    });
  }

  if (
    !packValidityInfo?.durationYears &&
    packValidityInfo?.durationMonths &&
    !packValidityInfo?.durationDays
  ) {
    return t('genericCard.validForDuration.validMonth', {
      count: packValidityInfo.durationMonths,
    });
  }

  if (
    !packValidityInfo?.durationYears &&
    !packValidityInfo?.durationMonths &&
    packValidityInfo?.durationDays
  ) {
    return t('genericCard.validForDuration.validDay', {
      count: packValidityInfo.durationDays,
    });
  }

  if (
    packValidityInfo?.durationYears &&
    packValidityInfo?.durationMonths &&
    !packValidityInfo?.durationDays
  ) {
    return t('genericCard.validForDuration.validAnd', {
      first: t('genericCard.validity.year', {
        count: packValidityInfo.durationYears,
      }),
      second: t('genericCard.validity.month', {
        count: packValidityInfo.durationMonths,
      }),
    });
  }

  if (
    packValidityInfo?.durationYears &&
    !packValidityInfo?.durationMonths &&
    packValidityInfo?.durationDays
  ) {
    return t('genericCard.validForDuration.validAnd', {
      first: t('genericCard.validity.year', {
        count: packValidityInfo.durationYears,
      }),
      second: t('genericCard.validity.day', {
        count: packValidityInfo.durationDays,
      }),
    });
  }

  if (
    !packValidityInfo?.durationYears &&
    packValidityInfo?.durationMonths &&
    packValidityInfo?.durationDays
  ) {
    return t('genericCard.validForDuration.validAnd', {
      first: t('genericCard.validity.month', {
        count: packValidityInfo.durationMonths,
      }),
      second: t('genericCard.validity.day', {
        count: packValidityInfo.durationDays,
      }),
    });
  }

  if (
    packValidityInfo?.durationYears &&
    packValidityInfo?.durationMonths &&
    packValidityInfo?.durationDays
  ) {
    return t('genericCard.validForDuration.validDaysMonthsYears', {
      duration_years: t('genericCard.validity.year', {
        count: packValidityInfo.durationYears,
      }),
      duration_months: t('genericCard.validity.month', {
        count: packValidityInfo.durationMonths,
      }),
      duration_days: t('genericCard.validity.day', {
        count: packValidityInfo.durationDays,
      }),
    });
  }

  if (
    !packValidityInfo?.dateRange &&
    packValidityInfo?.startDateMethod !== undefined &&
    packValidityInfo?.startDateMethod !== null
  ) {
    if (packValidityInfo.startDateMethod === START_ON_FIRST_BOOKING) {
      return t('genericCard.validForDuration.booking');
    }
    if (packValidityInfo.startDateMethod === START_ON_FIRST_ATTENDANCE) {
      return t('genericCard.validForDuration.attendance');
    }
    if (packValidityInfo.startDateMethod === START_ON_PURCHASE) {
      return t('genericCard.validForDuration.purchase');
    }
  }

  return null;
};
