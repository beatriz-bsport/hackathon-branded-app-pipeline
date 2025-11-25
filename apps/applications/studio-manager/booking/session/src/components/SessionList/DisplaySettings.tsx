import React from "react";

import { Body, SegmentedControl } from "@bsport/kaizen-primitive-core";

import {
  selectCalendarView,
  setCalendarView,
  useSessionListStore,
} from "../../stores/session-list";
import { useTranslation } from "../../utils/i18n";

export const DisplaySettings: React.FC = () => {
  const { t } = useTranslation("sessionList");

  const onChangeCalendarView = (value: string) => {
    if (value === "daily" || value === "range") {
      setCalendarView(value);
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
            value: "daily",
          },
          {
            label: t("displaySettings.calendarView.options.range"),
            value: "range",
          },
        ]}
        onChangeValue={onChangeCalendarView}
        value={calendarView}
      />
    </div>
  );
};
