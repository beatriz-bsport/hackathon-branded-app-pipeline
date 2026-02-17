import { getLocalNow } from "@bsport/datetime-manipulation";
import type { DateTime } from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import { DEFAULT_FORM_DATA, PackFormData } from "./schema";

export const useGetDisablePast = () => {
  const { i18n } = useTranslation();
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const today = getLocalNow({ locale: i18n.language, zone: companyTimezone });

  const disablePast = (date: DateTime) =>
    date.startOf("day") < today.startOf("day");

  return disablePast;
};

export function sanitizeDataBeforeSubmit(data: PackFormData) {
  const {
    hasExpirationDate,
    available_payment_method_identifiers,
    expiration_date,
    manager_only,
    ...apiData
  } = data;

  return {
    ...apiData,
    manager_only,
    available_payment_method_identifiers: manager_only
      ? DEFAULT_FORM_DATA.available_payment_method_identifiers
      : available_payment_method_identifiers,
    expiration_date: hasExpirationDate ? expiration_date : null,
  };
}
