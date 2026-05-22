import { Body, Button, Card, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Placeholder shown while pass and appointment-pass catalogs load.
 * Mirrors booking-milestone / total-booking skeletons: structure, real copy, disabled actions.
 */
export const ActivePassesFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t("filters.27.skeleton.ariaLabel")}
    >
      <Card className="w-full" padding="default">
        <div className="flex flex-col gap-sm">
          <div className="flex items-start justify-between gap-sm">
            <Body size="lg" weight="stronger">
              {t("filters.27.title")}
            </Body>
            <Button
              kind="icon-button"
              icon="trash-01"
              size="md"
              label={t("filters.27.actions.deleteFilter")}
              intent="flat"
              color="default"
              disabled
            />
          </div>

          <Loader className="self-center" size="lg" />

          <Body
            size="sm"
            weight="stronger"
            color="weak"
            className="uppercase tracking-wide"
          >
            {t("filters.27.fields.filterSpecifications")}
          </Body>

          <Loader className="self-center" size="lg" />

          <div className="flex justify-end">
            <Button
              iconLeft="check"
              label={t("filters.27.actions.save")}
              size="sm"
              color="main"
              intent="default"
              disabled
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
