import { useTranslation } from 'react-i18next';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';

import { useMemo } from 'react';

import type { PrivatePass } from '#libs/private-service/types';

export const useValidityInfoForPrivatePassCard = (privatePass: PrivatePass) => {
  const { t } = useTranslation(['marketplace']);
  const validityInfo = useMemo(() => {
    if (
      privatePass.duration_years &&
      !privatePass.duration_months &&
      !privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.validYear', {
        count: privatePass.duration_years,
      });
    }

    if (
      !privatePass.duration_years &&
      privatePass.duration_months &&
      !privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.validMonth', {
        count: privatePass.duration_months,
      });
    }

    if (
      !privatePass.duration_years &&
      !privatePass.duration_months &&
      privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.valid_day', {
        count: privatePass.duration_days,
      });
    }

    if (
      privatePass.duration_years &&
      privatePass.duration_months &&
      !privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.year', {
          count: privatePass.duration_years,
        }),
        second: t('genericCard.validity.month', {
          count: privatePass.duration_months,
        }),
      });
    }

    if (
      privatePass.duration_years &&
      !privatePass.duration_months &&
      privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.year', {
          count: privatePass.duration_years,
        }),
        second: t('genericCard.validity.day', {
          count: privatePass.duration_days,
        }),
      });
    }

    if (
      !privatePass.duration_years &&
      privatePass.duration_months &&
      privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.month', {
          count: privatePass.duration_months,
        }),
        second: t('genericCard.validity.day', {
          count: privatePass.duration_days,
        }),
      });
    }

    if (
      !privatePass.duration_years &&
      privatePass.duration_months &&
      privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.validAnd', {
        first: t('genericCard.validity.month', {
          count: privatePass.duration_months,
        }),
        second: t('genericCard.validity.day', {
          count: privatePass.duration_days,
        }),
      });
    }

    if (
      privatePass.duration_years &&
      privatePass.duration_months &&
      privatePass.duration_days
    ) {
      return t('genericCard.validForDuration.valid_daysMonthsYears', {
        duration_years: t('genericCard.validity.year', {
          count: privatePass.duration_years,
        }),
        duration_months: t('genericCard.validity.month', {
          count: privatePass.duration_months,
        }),
        duration_days: t('genericCard.validity.day', {
          count: privatePass.duration_days,
        }),
      });
    }

    if (privatePass.start_date_method) {
      if (privatePass.start_date_method === START_ON_FIRST_BOOKING) {
        return t('genericCard.validForDuration.booking');
      }
      if (privatePass.start_date_method === START_ON_FIRST_ATTENDANCE) {
        return t('genericCard.validForDuration.attendance');
      }
      if (privatePass.start_date_method === START_ON_PURCHASE) {
        return t('genericCard.validForDuration.purchase');
      }
    }
    return null;
  }, [t, privatePass]);
  return validityInfo;
};
