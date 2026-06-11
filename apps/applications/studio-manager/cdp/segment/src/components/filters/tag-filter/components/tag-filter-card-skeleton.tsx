import { Body, Button, Card, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Skeleton placeholder shown while tag catalog queries load.
 */
export const TagFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");
  return (
    <div role="status" aria-busy="true" aria-label={t("filters.11.loading")}>
      <Card className="w-full animate-pulse" padding="default">
        <div className="flex flex-col gap-sm">
          <div className="flex items-start justify-between gap-sm">
            <Body size="lg" weight="stronger">
              {t("filters.11.title")}
            </Body>
            <Button
              kind="icon-button"
              icon="trash-01"
              size="md"
              label={t("filters.11.actions.deleteFilter")}
              intent="flat"
              color="default"
              disabled
            />
          </div>
          <Loader size="lg" />

          <div className="flex justify-end">
            <Button
              label={t("filters.11.actions.save")}
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
