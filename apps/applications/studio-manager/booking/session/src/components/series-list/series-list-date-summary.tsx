import { useEffect, useState } from "react";

import type { DateTime } from "@bsport/datetime-manipulation";
import {
  Button,
  DatePicker,
  type SelectedDate,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

type CompleteSeriesListDateRange = [DateTime, DateTime];

type SeriesListDateSummaryProps = {
  fromDate: DateTime;
  onDateRangeChange: (dateRange: CompleteSeriesListDateRange) => void;
  onTodayClick: () => void;
  todayLabel: string;
  toDate: DateTime | null;
};

const isCompleteDateRange = (
  selectedDate: SelectedDate,
): selectedDate is CompleteSeriesListDateRange =>
  Array.isArray(selectedDate) && Boolean(selectedDate[0] && selectedDate[1]);

export const SeriesListDateSummary = ({
  fromDate,
  onDateRangeChange,
  onTodayClick,
  todayLabel,
  toDate,
}: SeriesListDateSummaryProps) => {
  const [datePickerValue, setDatePickerValue] = useState<SelectedDate>([
    fromDate,
    toDate,
  ]);
  const isMobile = !useMatchMedia("sm");

  useEffect(() => {
    setDatePickerValue([fromDate, toDate]);
  }, [fromDate, toDate]);

  const handleDateRangeSelect = (selectedDate: SelectedDate) => {
    setDatePickerValue(selectedDate);

    if (isCompleteDateRange(selectedDate)) {
      onDateRangeChange(selectedDate);
    }
  };

  return (
    <div
      data-id="series-date-nav-header"
      className={[
        "flex justify-center",
        "p-sm",
        "border border-stroke-weak border-b-solid border-b-stroke-thin",
        "w-full sticky top-0 z-10 bg-surface-page",
      ].join(" ")}
    >
      {!isMobile && (
        <div className="absolute left-sm top-1/2 -translate-y-1/2">
          <Button
            label={todayLabel}
            size="md"
            intent="default"
            color="main"
            onClick={onTodayClick}
          />
        </div>
      )}
      <div className="flex justify-center gap-xs">
        <DatePicker
          id="series-list-date-picker"
          mode="range"
          displayAs="popover"
          dateFormat={isMobile ? "short" : "medium"}
          dateValue={datePickerValue}
          onSelect={handleDateRangeSelect}
          popoverPlacement="bottom"
        />
      </div>
    </div>
  );
};
