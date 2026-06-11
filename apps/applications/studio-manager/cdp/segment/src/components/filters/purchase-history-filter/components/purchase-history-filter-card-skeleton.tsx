import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Skeleton placeholder for the purchase history filter card.
 */
export const PurchaseHistoryFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <div role="status" aria-busy="true">
      <Card className="w-full animate-pulse" padding="default">
        <div className="flex flex-col gap-sm">
          <div className="flex items-start justify-between">
            <Body size="lg" weight="stronger">
              {t("filters.24.title")}
            </Body>
            <Button
              kind="icon-button"
              icon="trash-01"
              size="md"
              label={t("filters.24.actions.deleteFilter")}
              intent="flat"
              color="default"
              disabled
            />
          </div>

          <div className="flex justify-end">
            <Button
              label={t("filters.24.actions.save")}
              size="sm"
              color="main"
              intent="default"
              iconLeft="check"
              disabled
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
