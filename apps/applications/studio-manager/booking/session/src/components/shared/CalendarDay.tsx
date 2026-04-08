import React, { memo } from "react";

type CalendarDayProps = {
  date: string;
  children: React.ReactNode;
};

const CalendarDay: React.FC<CalendarDayProps> = ({ date, children }) => {
  return (
    // Scroll margin top is needed when scrolling using the Today button.
    <div data-date={date} className="scroll-mt-2xl">
      {children}
    </div>
  );
};

export default memo(CalendarDay);
