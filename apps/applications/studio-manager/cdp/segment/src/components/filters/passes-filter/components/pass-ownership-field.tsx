import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { OWNERSHIP_OPTIONS } from "../constants";
import type { OwnershipOption } from "../types";

type PassOwnershipFieldProps = {
  id: string;
  value: OwnershipOption;
  onChange: (next: OwnershipOption) => void;
};

/**
 * Stateless ownership selector backed by Kaizen `RadioGroup`.
 *
 * Owns no business logic: parent components are responsible for plugging the
 * value into a form controller.
 */
export const PassOwnershipField = ({
  id,
  value,
  onChange,
}: PassOwnershipFieldProps) => {
  const { t } = useTranslation("campaign-filters");

  const ownershipOptions = [
    {
      value: OWNERSHIP_OPTIONS.own,
      label: t("filters.19.ownership.own"),
    },
    {
      value: OWNERSHIP_OPTIONS.doesNotOwn,
      label: t("filters.19.ownership.doesNotOwn"),
    },
  ];

  return (
    <RadioGroup
      id={id}
      label={t("filters.19.ownership.label")}
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
