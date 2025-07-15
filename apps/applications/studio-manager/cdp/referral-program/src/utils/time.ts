import { ReferralSettings } from "@bsport/store-cdp-referral";

import { i18nInstance } from "./i18n";

export function getTimeUnitFromReferralProgram(
  timeLimitUnit: ReferralSettings["application_time_limit_unit"],
): "day" | "week" | "month" {
  switch (timeLimitUnit) {
    case "days":
      return "day";
    case "weeks":
      return "week";
    case "months":
      return "month";
    default:
      return "day";
  }
}

export function formatTimeUnitForPatchReferralProgram(
  timeLimitUnit: string,
  timeInterval: number,
): ReferralSettings["application_time_limit_unit"] | null {
  switch (timeLimitUnit) {
    case i18nInstance.t("active.form.timeLimitForUsage.unit.choices.day", {
      count: timeInterval,
    }):
      return "days";
    case i18nInstance.t("active.form.timeLimitForUsage.unit.choices.week", {
      count: timeInterval,
    }):
      return "weeks";
    case i18nInstance.t("active.form.timeLimitForUsage.unit.choices.month", {
      count: timeInterval,
    }):
      return "months";
    default:
      return null;
  }
}
