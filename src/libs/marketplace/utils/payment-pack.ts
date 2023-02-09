import { useTranslation } from 'react-i18next';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';

import { useMemo } from 'react';
import { formatAsDate } from '../../../utils/datetime';

import type { PaymentPack } from '#libs/payment-packs/types';

export const useValidityInfoForPaymentPackCard = (paymentPack: PaymentPack) => {
  const { t } = useTranslation(['marketplace']);
  const validityInfo = useMemo(() => {
    if (paymentPack.validity_daterange) {
      return t('genericCard.validForDuration.validFromTo', {
        duration_date_start: formatAsDate(paymentPack.validity_daterange.lower),
        duration_date_end: formatAsDate(paymentPack.validity_daterange.upper),
        interpolation: { escapeValue: false },
      });
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
