import { Body, Button, Card, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Lightweight skeleton displayed while total booking card data is loading.
 */
export const TotalBookingFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.22.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.22.actions.deleteFilter")}
            intent="flat"
            color="default"
            disabled
          />
        </div>

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
            label={t("filters.22.actions.save")}
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
