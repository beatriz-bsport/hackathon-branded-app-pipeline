import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { OWNERSHIP_OPTIONS } from "#src/components/filters/passes-filter/constants";
import type { OwnershipOption } from "#src/components/filters/passes-filter/types";
import { useTranslation } from "#src/utils/i18n";

type AppointmentPassOwnershipFieldProps = {
  id: string;
  value: OwnershipOption;
  onChange: (next: OwnershipOption) => void;
};

/**
 * Ownership selector for appointment pass filter (maps to `has_pack` on the API).
 */
export const AppointmentPassOwnershipField = ({
  id,
  value,
  onChange,
}: AppointmentPassOwnershipFieldProps) => {
  const { t } = useTranslation("filters");

  const ownershipOptions = [
    {
      value: OWNERSHIP_OPTIONS.own,
      label: t("filters.25.ownership.own"),
    },
    {
      value: OWNERSHIP_OPTIONS.doesNotOwn,
      label: t("filters.25.ownership.doesNotOwn"),
    },
  ];

  return (
    <RadioGroup
      id={id}
      label={t("filters.25.ownership.label")}
      options={ownershipOptions}
      value={value}
      onChange={(event) => {
        const nextValue =
          event.target.value === OWNERSHIP_OPTIONS.own
            ? OWNERSHIP_OPTIONS.own
            : OWNERSHIP_OPTIONS.doesNotOwn;
        onChange(nextValue);
      }}
    />
  );
};
