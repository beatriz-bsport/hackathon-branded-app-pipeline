import { useTranslation } from 'react-i18next';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack.js';
import type { CardValidityInfo } from '#src/pages/marketplace/passes/types';

export const useValidityInfoForAppointmentPassCard = (
  passInfo: CardValidityInfo,
) => {
  const { t } = useTranslation('marketplace');

  if (
    passInfo.durationYears &&
    !passInfo.durationMonths &&
    !passInfo.durationDays
  ) {
    return t('genericCard.validForDuration.validYear', {
      count: passInfo.durationYears,
    });
  }

  if (
    !passInfo.durationYears &&
    passInfo.durationMonths &&
    !passInfo.durationDays
  ) {
    return t('genericCard.validForDuration.validMonth', {
      count: passInfo.durationMonths,
    });
  }

  if (
    !passInfo.durationYears &&
    !passInfo.durationMonths &&
    passInfo.durationDays
  ) {
    return t('genericCard.validForDuration.validDay', {
      count: passInfo.durationDays,
    });
  }

  if (
    passInfo.durationYears &&
    passInfo.durationMonths &&
    !passInfo.durationDays
  ) {
    return t('genericCard.validForDuration.validAnd', {
      first: t('genericCard.validity.year', {
        count: passInfo.durationYears,
      }),
      second: t('genericCard.validity.month', {
        count: passInfo.durationMonths,
      }),
    });
  }

  if (
    passInfo.durationYears &&
    !passInfo.durationMonths &&
    passInfo.durationDays
  ) {
    return t('genericCard.validForDuration.validAnd', {
      first: t('genericCard.validity.year', {
        count: passInfo.durationYears,
      }),
      second: t('genericCard.validity.day', {
        count: passInfo.durationDays,
      }),
    });
  }

  if (
    !passInfo.durationYears &&
    passInfo.durationMonths &&
    passInfo.durationDays
  ) {
    return t('genericCard.validForDuration.validAnd', {
      first: t('genericCard.validity.month', {
        count: passInfo.durationMonths,
      }),
      second: t('genericCard.validity.day', {
        count: passInfo.durationDays,
      }),
    });
  }

  if (
    passInfo.durationYears &&
    passInfo.durationMonths &&
    passInfo.durationDays
  ) {
    return t('genericCard.validForDuration.validDaysMonthsYears', {
      duration_years: t('genericCard.validity.year', {
        count: passInfo.durationYears,
      }),
      duration_months: t('genericCard.validity.month', {
        count: passInfo.durationMonths,
      }),
      duration_days: t('genericCard.validity.day', {
        count: passInfo.durationDays,
      }),
    });
  }

  if (
    passInfo.startDateMethod !== undefined &&
    passInfo.startDateMethod !== null
  ) {
    if (passInfo.startDateMethod === START_ON_FIRST_BOOKING) {
      return t('genericCard.validForDuration.booking');
    }
    if (passInfo.startDateMethod === START_ON_FIRST_ATTENDANCE) {
      return t('genericCard.validForDuration.attendance');
    }
    if (passInfo.startDateMethod === START_ON_PURCHASE) {
      return t('genericCard.validForDuration.purchase');
    }
  }
  return null;
};
