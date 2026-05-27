import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  FIRST_PURCHASE_STATUS,
  type FirstPurchaseStatusOption,
} from "../constants";

type FirstPurchaseStatusFieldProps = {
  id: string;
  value: FirstPurchaseStatusOption;
  onChange: (next: FirstPurchaseStatusOption) => void;
  disabled?: boolean;
};

/**
 * Stateless first-purchase status selector backed by Kaizen `RadioGroup`.
 */
export const FirstPurchaseStatusField = ({
  id,
  value,
  onChange,
  disabled = false,
}: FirstPurchaseStatusFieldProps) => {
  const { t } = useTranslation("filters");

  const statusOptions = [
    {
      value: FIRST_PURCHASE_STATUS.done,
      label: t("filters.28.status.done"),
    },
    {
      value: FIRST_PURCHASE_STATUS.notDone,
      label: t("filters.28.status.notDone"),
    },
  ];

  return (
    <RadioGroup
      id={id}
      options={statusOptions}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        const nextValue =
          event.target.value === FIRST_PURCHASE_STATUS.done
            ? FIRST_PURCHASE_STATUS.done
            : FIRST_PURCHASE_STATUS.notDone;
        onChange(nextValue);
      }}
    />
  );
};
