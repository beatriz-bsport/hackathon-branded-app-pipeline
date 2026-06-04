import { Body, Button, Card, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Lightweight skeleton displayed while total appointments card data is loading.
 */
export const TotalAppointmentsFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.26.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.26.actions.deleteFilter")}
            intent="flat"
            color="default"
            disabled
          />
        </div>

        <Loader className="self-center" size="lg" />

        <div className="flex justify-end">
          <Button
            label={t("filters.26.actions.save")}
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
