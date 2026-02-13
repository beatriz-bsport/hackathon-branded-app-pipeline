import { getLocalNow } from "@bsport/datetime-manipulation";
import type { DateTime } from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export const useGetDisablePast = () => {
  const { i18n } = useTranslation();
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const today = getLocalNow({ locale: i18n.language, zone: companyTimezone });

  const disablePast = (date: DateTime) =>
    date.startOf("day") < today.startOf("day");

  return disablePast;
};
