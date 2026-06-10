import { Body, Button, Card, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Skeleton placeholder for the first purchase filter card.
 */
export const FirstPurchaseFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <div role="status" aria-busy="true">
      <Card className="w-full animate-pulse" padding="default">
        <div className="flex flex-col gap-sm">
          <div className="flex items-start justify-between">
            <Body size="lg" weight="stronger">
              {t("filters.28.title")}
            </Body>
            <Button
              kind="icon-button"
              icon="trash-01"
              size="md"
              label={t("filters.28.actions.deleteFilter")}
              intent="flat"
              color="default"
              disabled
            />
          </div>

          <RadioGroup
            id="first-purchase-filter-skeleton-status"
            options={[
              { value: "done", label: t("filters.28.status.done") },
              { value: "notDone", label: t("filters.28.status.notDone") },
            ]}
            value="done"
            disabled
            onChange={() => undefined}
          />

          <div className="flex justify-end">
            <Button
              label={t("filters.28.actions.save")}
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
