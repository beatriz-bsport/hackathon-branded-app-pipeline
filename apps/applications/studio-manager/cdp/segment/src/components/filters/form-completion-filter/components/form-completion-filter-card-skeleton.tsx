import {
  Body,
  Button,
  Card,
  Loader,
  Select,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FORM_COMPLETION_CONDITION_SELECT } from "../constants";

/**
 * Lightweight skeleton displayed while custom form options are loading.
 */
export const FormCompletionFilterCardSkeleton = () => {
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
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.102.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.102.actions.deleteFilter")}
            intent="flat"
            color="default"
            disabled
          />
        </div>

        <Select
          id="form-completion-filter-skeleton-completion-condition"
          label={t("filters.102.fields.completionCondition.label")}
          items={completionConditionItems}
          value={FORM_COMPLETION_CONDITION_SELECT.atLeastOne}
          disabled
          fullWidth
          required
        />

        <Loader className="self-center" size="lg" />

        <div className="flex justify-end">
          <Button
            label={t("filters.102.actions.save")}
            size="sm"
            color="main"
            intent="default"
            disabled
          />
        </div>
      </div>
    </Card>
  );
};
