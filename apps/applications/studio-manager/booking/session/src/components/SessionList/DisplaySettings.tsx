import React from "react";

import { Body, SegmentedControl } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "../../utils/i18n";

export const DisplaySettings: React.FC = () => {
  const { t } = useTranslation("sessionList");
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
        defaultValue="daily"
        onChangeValue={(value) => console.log(value)}
      />
    </div>
  );
};
