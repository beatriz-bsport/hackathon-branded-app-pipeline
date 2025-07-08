import type { CustomForm } from "@bsport/store-cdp-custom-form";

import type { CustomFormTableRowData } from "#src/components/columns";
import { LEGACY_URLS } from "#src/urls";

export const getCustomFormTableColumns = ({
  customForms,
}: {
  customForms: CustomForm[];
}): CustomFormTableRowData[] => {
  if (customForms) {
    return customForms.filter(Boolean).map((form) => {
      return {
        id: form.id,
        name: form.name,
        questions: form?.custom_form_field?.length ?? 0,
        link: LEGACY_URLS.FORM_DETAILS(form.id),
      };
    });
  }
  return [];
};
