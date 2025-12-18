import React from "react";

import { Body } from "@bsport/kaizen-primitive-core";

type TeacherCellProps = {
  teacherName?: string;
  originalTeacherName?: string;
  coach_override?: number | null;
  hasPendingReplacementRequest?: boolean;
};
export const TeacherCell: React.FC<TeacherCellProps> = ({
  teacherName,
  originalTeacherName,
  coach_override,
}) => (
  <div className="flex gap-md items-center">
    <Body htmlVariant="p" size="md" className="truncate max-w-[140px]">
      {teacherName}
    </Body>
    {coach_override && (
      <Body
        htmlVariant="p"
        size="md"
        color="weak"
        className="line-through truncate max-w-[140px]"
      >
        {originalTeacherName}
      </Body>
    )}
  </div>
);
