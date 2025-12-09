import React from "react";

import { Body, SegmentedControl } from "@bsport/kaizen-primitive-core";

import {
  CalendarView,
  selectCalendarView,
  setCalendarView,
  useSessionListStore,
} from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

export const DisplaySettings: React.FC = () => {
  const { t } = useTranslation("sessionList");

  const onChangeCalendarView = (value: string) => {
    if (value === CalendarView.DAILY || value === CalendarView.RANGE) {
      setCalendarView(value as CalendarView);
    }
  };
  const calendarView = useSessionListStore(selectCalendarView);
  return (
    <div className="p-xs flex flex-col gap-xs">
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
        onChangeValue={onChangeCalendarView}
        value={calendarView}
      />
    </div>
  );
};
