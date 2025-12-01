import React from "react";

import { SessionDatePicker } from "./SessionDatePicker";
import { TodayButton } from "./TodayButton";

export const DateNavigationHeader: React.FC = () => (
  <div
    className={[
      // Layout
      "flex justify-center",
      // Spacing
      "p-sm",
      // Border
      "border border-stroke-weak border-b-solid border-b-stroke-thin",
      // Sticky positioning
      "w-full sticky top-0 z-10 bg-surface-page",
    ].join(" ")}
  >
    <div className="absolute left-sm top-1/2 -translate-y-1/2">
      <TodayButton />
    </div>
    <div className="flex justify-center">
      <SessionDatePicker />
    </div>
  </div>
);
