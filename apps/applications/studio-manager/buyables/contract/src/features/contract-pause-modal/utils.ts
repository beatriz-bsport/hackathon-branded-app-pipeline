import { type DateTime, getLocalNow } from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export const useToday = () => {
  const { i18n } = useTranslation();
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  return getLocalNow({ locale: i18n.language, zone: companyTimezone });
};

export const useDisablePast = () => {
  const today = useToday();

  const disablePast = (date: DateTime) =>
    date.startOf("day") < today.startOf("day");

  return disablePast;
};
