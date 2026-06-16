import { useCallback } from "react";

import type { Pass } from "@bsport/api-buyables";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import { useTranslation } from "#src/utils/i18n";

const START_ON_FIRST_BOOKING = 0;
const START_ON_FIRST_ATTENDANCE = 1;
const START_ON_PURCHASE = 2;

export const usePassValidity = () => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n.language;

  const formatValidity = useCallback(
    (pass: Pass): string | null => {
      if (pass.validity_daterange) {
        try {
          const range = JSON.parse(pass.validity_daterange) as {
            lower: string;
            upper: string;
          };
          return t("bookingFlow.newPass.validity.validFromTo", {
            start: formatDateTime(range.lower, DATETIME_FORMATS.MEDIUM_DATE, {
              locale,
            }),
            end: formatDateTime(range.upper, DATETIME_FORMATS.MEDIUM_DATE, {
              locale,
            }),
          });
        } catch {
          // fall through to duration/start_date_method fallbacks
        }
      }

      const durationYears = pass.duration_years ?? 0;
      const durationMonths = pass.duration_months ?? 0;
      const durationDays = pass.duration_days ?? 0;

      if (durationYears && durationMonths && durationDays) {
        return t("bookingFlow.newPass.validity.validDaysMonthsYears", {
          years: t("bookingFlow.newPass.validity.year", {
            count: durationYears,
          }),
          months: t("bookingFlow.newPass.validity.month", {
            count: durationMonths,
          }),
          days: t("bookingFlow.newPass.validity.day", { count: durationDays }),
        });
      }
      if (durationYears && durationMonths) {
        return t("bookingFlow.newPass.validity.validAnd", {
          first: t("bookingFlow.newPass.validity.year", {
            count: durationYears,
          }),
          second: t("bookingFlow.newPass.validity.month", {
            count: durationMonths,
          }),
        });
      }
      if (durationYears && durationDays) {
        return t("bookingFlow.newPass.validity.validAnd", {
          first: t("bookingFlow.newPass.validity.year", {
            count: durationYears,
          }),
          second: t("bookingFlow.newPass.validity.day", {
            count: durationDays,
          }),
        });
      }
      if (durationMonths && durationDays) {
        return t("bookingFlow.newPass.validity.validAnd", {
          first: t("bookingFlow.newPass.validity.month", {
            count: durationMonths,
          }),
          second: t("bookingFlow.newPass.validity.day", {
            count: durationDays,
          }),
        });
      }
      if (durationYears)
        return t("bookingFlow.newPass.validity.year", { count: durationYears });
      if (durationMonths)
        return t("bookingFlow.newPass.validity.month", {
          count: durationMonths,
        });
      if (durationDays)
        return t("bookingFlow.newPass.validity.day", { count: durationDays });

      if (pass.start_date_method === START_ON_FIRST_BOOKING) {
        return t("bookingFlow.newPass.validity.startOnBooking");
      }
      if (pass.start_date_method === START_ON_FIRST_ATTENDANCE) {
        return t("bookingFlow.newPass.validity.startOnAttendance");
      }
      if (pass.start_date_method === START_ON_PURCHASE) {
        return t("bookingFlow.newPass.validity.startOnPurchase");
      }

      return null;
    },
    [locale, t],
  );

  return { formatValidity };
};
