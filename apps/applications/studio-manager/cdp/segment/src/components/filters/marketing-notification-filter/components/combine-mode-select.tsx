import { Select } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { COMBINE_MODE_OPTIONS, type CombineModeOption } from "../constants";

type CombineModeSelectProps = {
  id: string;
  value: CombineModeOption;
  onChange: (nextValue: CombineModeOption) => void;
  disabled?: boolean;
};

/**
 * AND / OR combine mode selector backed by Kaizen `Select`.
 */
export const CombineModeSelect = ({
  id,
  value,
  onChange,
  disabled = false,
}: CombineModeSelectProps) => {
  const { t } = useTranslation("filters");

  const combineModeItems = [
    {
      id: COMBINE_MODE_OPTIONS.and,
      label: t("filters.103.combine.and"),
    },
    {
      id: COMBINE_MODE_OPTIONS.or,
      label: t("filters.103.combine.or"),
    },
  ];

  return (
    <Select
      id={id}
      label={t("filters.103.combine.label")}
      items={combineModeItems}
      value={value}
      disabled={disabled}
      fullWidth
      onChange={(nextValue) => {
        if (
          nextValue === COMBINE_MODE_OPTIONS.and ||
          nextValue === COMBINE_MODE_OPTIONS.or
        ) {
          onChange(nextValue);
        }
      }}
    />
  );
};
