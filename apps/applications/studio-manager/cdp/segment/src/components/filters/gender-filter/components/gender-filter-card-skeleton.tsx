import { Body, Button, Card, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { GENDER_OPTIONS } from "../constants";

/**
 * Lightweight skeleton displayed while gender filter cards are loading.
 */
export const GenderFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.5.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.5.actions.deleteFilter")}
            intent="flat"
            color="default"
            disabled
          />
        </div>

        <RadioGroup
          id="gender-filter-skeleton-value"
          label={t("filters.5.fields.radioLabel")}
          options={[
            {
              label: t("filters.5.fields.male"),
              value: GENDER_OPTIONS.male,
            },
            {
              label: t("filters.5.fields.female"),
              value: GENDER_OPTIONS.female,
            },
          ]}
          value={GENDER_OPTIONS.male}
          disabled
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.5.actions.save")}
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
