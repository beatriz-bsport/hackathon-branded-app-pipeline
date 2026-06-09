import {
  Body,
  Button,
  Card,
  Loader,
  RadioGroup,
} from "@bsport/kaizen-primitive-core";

import { OWNERSHIP_OPTIONS } from "#src/components/filters/passes-filter/constants";
import { useTranslation } from "#src/utils/i18n";

/**
 * Skeleton shown while appointment pass options are loading.
 */
export const AppointmentPassFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.25.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.25.actions.deleteFilter")}
            intent="flat"
            color="default"
            disabled
          />
        </div>

        <RadioGroup
          id="appointment-pass-filter-skeleton-ownership"
          label={t("filters.25.ownership.label")}
          options={[
            {
              label: t("filters.25.ownership.own"),
              value: OWNERSHIP_OPTIONS.own,
            },
            {
              label: t("filters.25.ownership.doesNotOwn"),
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
            label={t("filters.25.actions.save")}
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
