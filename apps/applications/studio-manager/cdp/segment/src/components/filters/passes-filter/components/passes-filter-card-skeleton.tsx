import {
  Body,
  Button,
  Card,
  Loader,
  RadioGroup,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { OWNERSHIP_OPTIONS } from "../constants";

/**
 * Lightweight skeleton displayed while pass options are loading for a card.
 */
export const PassesFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.19.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.19.actions.deleteFilter")}
            intent="flat"
            color="default"
            disabled
          />
        </div>

        <RadioGroup
          id="passes-filter-skeleton-ownership"
          label={t("filters.19.ownership.label")}
          options={[
            {
              label: t("filters.19.ownership.own"),
              value: OWNERSHIP_OPTIONS.own,
            },
            {
              label: t("filters.19.ownership.doesNotOwn"),
              value: OWNERSHIP_OPTIONS.doesNotOwn,
            },
          ]}
          value={OWNERSHIP_OPTIONS.own}
          disabled
        />

        <Loader className="self-center" size="lg" />

        <Body size="md" color="weak" weight="strong">
          {t("filters.19.fields.filterSpecifications")}
        </Body>

        <Button
          iconLeft="plus"
          size="sm"
          intent="flat"
          color="default"
          label={t("filters.19.actions.addSubFilter")}
          disabled
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.19.actions.save")}
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
