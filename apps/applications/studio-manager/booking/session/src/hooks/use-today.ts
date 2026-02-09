import { getLocalNow } from "@bsport/datetime-manipulation";
import { type DateTime } from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export const useToday = (): DateTime => {
  const { i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  // We don't memoize today value in case client leaves the window opened for a long time
  return getLocalNow({ locale: intlLocale, zone: companyTimeZone });
};
