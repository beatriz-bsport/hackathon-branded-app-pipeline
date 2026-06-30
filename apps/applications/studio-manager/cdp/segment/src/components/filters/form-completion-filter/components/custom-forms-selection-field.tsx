import { Body } from "@bsport/kaizen-primitive-core";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import type { ItemsSearchFilterOption } from "#src/components/primitive-filters/items-search-filter/types";
import { useTranslation } from "#src/utils/i18n";

type CustomFormsSelectionFieldProps = {
  id: string;
  value: number[];
  customFormOptions: Array<{ id: number; name: string }>;
  disabled?: boolean;
  errorText?: string;
  onChange: (nextValue: number[]) => void;
};

/**
 * Multi-select for company custom forms included in the completion filter.
 */
export const CustomFormsSelectionField = ({
  id,
  value,
  customFormOptions,
  disabled = false,
  errorText,
  onChange,
}: CustomFormsSelectionFieldProps) => {
  const { t } = useTranslation("filters");

  const options: ItemsSearchFilterOption[] = customFormOptions.map(
    (customForm) => ({
      id: customForm.id,
      name: customForm.name,
    }),
  );

  return (
    <div className="flex flex-col gap-xs">
      <Body size="md" weight="strong">
        {t("filters.102.fields.customForms")}
      </Body>
      <ItemsSearchFilter
        id={id}
        options={options}
        value={value}
        disabled={disabled}
        searchPlaceholder={t("filters.102.fields.customFormsSearchPlaceholder")}
        emptySelectionLabel={t("filters.102.fields.customFormsEmptySelection")}
        errorText={errorText}
        onChange={onChange}
      />
    </div>
  );
};
