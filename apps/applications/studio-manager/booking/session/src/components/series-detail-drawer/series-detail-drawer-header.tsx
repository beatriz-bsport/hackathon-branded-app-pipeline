import type { FC } from "react";

import { Chip, Title } from "@bsport/kaizen-primitive-core";

import { SeriesActionsMenuButton } from "#src/components/series-actions/series-actions-menu-button";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type SeriesDetailDrawerHeaderProps = {
  isCancelled: boolean;
  onOpenCancelSeries: (seriesId: number) => void;
  onOpenDuplicateSeries: (seriesId: number) => void;
  seriesId: number;
  title: string;
};

export const SeriesDetailDrawerHeader: FC<SeriesDetailDrawerHeaderProps> = ({
  isCancelled,
  onOpenCancelSeries,
  onOpenDuplicateSeries,
  seriesId,
  title,
}) => {
  const { t } = useTranslation("series");
  const { resolveSeriesEditPath } = useUrls();

  return (
    <div className="flex items-start justify-between gap-md">
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-xs">
          <Title
            htmlVariant="h2"
            weight="strong"
            className={`truncate ${isCancelled ? "line-through" : ""}`}
            color={isCancelled ? "weak" : "default"}
          >
            {title}
          </Title>
          {isCancelled ? (
            <Chip
              label={t("seriesDetailDrawer.cancelled")}
              color="critical"
              type="weak"
              size="lg"
            />
          ) : null}
        </div>
      </div>
      <SeriesActionsMenuButton
        editPath={resolveSeriesEditPath(seriesId)}
        labels={{
          cancel: t("seriesDetailDrawer.actions.cancel"),
          duplicate: t("seriesDetailDrawer.actions.duplicate"),
          edit: t("seriesDetailDrawer.actions.edit"),
          menu: t("seriesDetailDrawer.actions.label"),
        }}
        onCancel={isCancelled ? undefined : () => onOpenCancelSeries(seriesId)}
        onDuplicate={() => onOpenDuplicateSeries(seriesId)}
      />
    </div>
  );
};
