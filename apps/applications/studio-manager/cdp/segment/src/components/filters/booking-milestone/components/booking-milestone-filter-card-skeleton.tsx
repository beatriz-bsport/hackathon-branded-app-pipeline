import { Body, Button, Card, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Lightweight skeleton displayed while booking milestone card data is loading.
 */
export const BookingMilestoneFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.21.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.21.actions.deleteFilter")}
            intent="flat"
            color="default"
            disabled
          />
        </div>

        <Loader className="self-center" size="lg" />

        <Body size="md" color="weak" weight="strong">
          {t("filters.21.fields.filterSpecifications")}
        </Body>

        <Button
          iconLeft="plus"
          size="sm"
          intent="flat"
          color="default"
          label={t("filters.21.actions.addFilter")}
          disabled
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.21.actions.save")}
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
