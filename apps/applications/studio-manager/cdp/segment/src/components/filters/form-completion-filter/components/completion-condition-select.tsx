import { Select } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  FORM_COMPLETION_CONDITION_SELECT,
  type FormCompletionConditionSelectValue,
  isFormCompletionConditionSelectValue,
} from "../constants";

type CompletionConditionSelectProps = {
  id: string;
  value: FormCompletionConditionSelectValue;
  onChange: (nextValue: FormCompletionConditionSelectValue) => void;
  disabled?: boolean;
  errorText?: string;
};

/**
 * At least one of / all of / none of selector backed by Kaizen `Select`.
 */
export const CompletionConditionSelect = ({
  id,
  value,
  onChange,
  disabled = false,
  errorText,
}: CompletionConditionSelectProps) => {
  const { t } = useTranslation("filters");

  const completionConditionItems = [
    {
      id: FORM_COMPLETION_CONDITION_SELECT.atLeastOne,
      label: t("filters.102.fields.completionCondition.atLeastOne"),
    },
    {
      id: FORM_COMPLETION_CONDITION_SELECT.allForms,
      label: t("filters.102.fields.completionCondition.allForms"),
    },
    {
      id: FORM_COMPLETION_CONDITION_SELECT.noForm,
      label: t("filters.102.fields.completionCondition.noForm"),
    },
  ];

  return (
    <Select
      id={id}
      label={t("filters.102.fields.completionCondition.label")}
      items={completionConditionItems}
      value={value}
      disabled={disabled}
      fullWidth
      required
      errorText={errorText}
      onChange={(nextValue) => {
        if (isFormCompletionConditionSelectValue(nextValue)) {
          onChange(nextValue);
        }
      }}
    />
  );
};
