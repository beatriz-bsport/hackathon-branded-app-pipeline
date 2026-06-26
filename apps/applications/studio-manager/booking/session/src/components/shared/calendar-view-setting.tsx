import { useCallback } from "react";

import { Body, SegmentedControl } from "@bsport/kaizen-primitive-core";

import {
  selectCalendarView,
  setCalendarView,
  useCalendarStore,
} from "#src/stores/calendar";
import { CalendarView } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type CalendarViewSettingProps = {
  onCalendarViewChange?: (calendarView: CalendarView) => void;
};

const isCalendarView = (value: string): value is CalendarView =>
  value === CalendarView.DAILY || value === CalendarView.RANGE;

export const CalendarViewSetting = ({
  onCalendarViewChange,
}: CalendarViewSettingProps) => {
  const { t } = useTranslation("sessionList");
  const calendarView = useCalendarStore(selectCalendarView);

  const handleCalendarViewChange = useCallback(
    (value: string) => {
      if (!isCalendarView(value)) {
        return;
      }

      setCalendarView(value);
      onCalendarViewChange?.(value);
    },
    [onCalendarViewChange],
  );

  return (
    <div className="flex flex-col gap-xs">
      <Body size="md" weight="weak">
        {t("displaySettings.calendarView.label")}
      </Body>
      <SegmentedControl
        id="calendar-view"
        options={[
          {
            label: t("displaySettings.calendarView.options.daily"),
            value: CalendarView.DAILY,
          },
          {
            label: t("displaySettings.calendarView.options.range"),
            value: CalendarView.RANGE,
          },
        ]}
        onChangeValue={handleCalendarViewChange}
        value={calendarView}
      />
    </div>
  );
};
