import { Body, Button, Select, Toggle } from "@bsport/kaizen-primitive-core";

import { CalendarViewSetting } from "#src/components/shared/calendar-view-setting";
import {
  selectSeriesDisplayedColumns,
  selectSeriesOrdering,
  selectSeriesShowCancelled,
  setSeriesOrdering,
  setSeriesShowCancelled,
  toggleSeriesColumn,
  useCalendarStore,
} from "#src/stores/calendar";
import { SeriesColumn, type SeriesOrdering } from "#src/types";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

const isSeriesOrdering = (value: string): value is SeriesOrdering =>
  value === "upcoming" || value === "name";

export const SeriesListDisplaySettings = () => {
  const { t } = useTranslation("series");
  const ordering = useCalendarStore(selectSeriesOrdering);
  const showCancelled = useCalendarStore(selectSeriesShowCancelled);
  const displayedColumns = useCalendarStore(selectSeriesDisplayedColumns);
  const hasShowCancelledSeriesPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );

  const handleOrderingChange = (value: string) => {
    if (isSeriesOrdering(value)) {
      setSeriesOrdering(value);
    }
  };

  const displayedColumnOptions = [
    {
      id: SeriesColumn.DATES,
      label: t("seriesDisplaySettings.displayedColumns.dates"),
    },
    {
      id: SeriesColumn.BOOKING_RULE,
      label: t("seriesDisplaySettings.displayedColumns.bookingRule"),
    },
    {
      id: SeriesColumn.CLASSES,
      label: t("seriesDisplaySettings.displayedColumns.classes"),
    },
  ];

  return (
    <div className="flex flex-col gap-lg max-w-[260px] p-xs">
      <CalendarViewSetting />
      <Select
        id="series-ordering"
        label={t("seriesDisplaySettings.ordering.label")}
        items={[
          {
            id: "upcoming",
            label: t("seriesDisplaySettings.ordering.options.upcoming"),
          },
          {
            id: "name",
            label: t("seriesDisplaySettings.ordering.options.name"),
          },
        ]}
        onChange={handleOrderingChange}
        value={ordering}
        fullWidth
      />
      {hasShowCancelledSeriesPermission ? (
        <Toggle
          id="show-cancelled-series"
          label={t("seriesDisplaySettings.showCancelled.label")}
          checked={showCancelled}
          onToggleChange={setSeriesShowCancelled}
        />
      ) : null}
      <div className="flex flex-col gap-xs">
        <Body size="md" weight="weak">
          {t("seriesDisplaySettings.displayedColumns.label")}
        </Body>
        <div className="flex flex-wrap gap-xs">
          {displayedColumnOptions.map((column) => (
            <Button
              key={column.id}
              label={column.label}
              size="sm"
              intent="default"
              onClick={() => toggleSeriesColumn(column.id)}
              color={displayedColumns.includes(column.id) ? "selected" : "main"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
