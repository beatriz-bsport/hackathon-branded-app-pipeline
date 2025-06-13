import type {
  CustomForm,
  CustomFormStatistics,
} from "@bsport/store-cdp-custom-form";

import type { CustomFormTableRowData } from "#src/components/columns";

export const getCustomFormTableColumns = ({
  customForms,
  statistics,
}: {
  customForms: CustomForm[];
  statistics: CustomFormStatistics[];
}): CustomFormTableRowData[] => {
  if (customForms) {
    return customForms.filter(Boolean).map((form) => {
      const statistic = statistics
        .filter(Boolean)
        .find((stat) => stat.id === form.id);
      return {
        id: form.id,
        name: form.name,
        answers: statistic?.detail_by_member
          ? Object.values(statistic.detail_by_member).length
          : 0,
      };
    });
  }
  return [];
};
