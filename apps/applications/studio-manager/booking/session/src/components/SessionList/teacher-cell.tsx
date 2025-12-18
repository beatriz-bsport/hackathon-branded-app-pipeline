import React from "react";

import { Body, Icon, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type TeacherCellProps = {
  teacherName?: string;
  originalTeacherName?: string;
  coach_override?: number | null;
  hasPendingReplacementRequest?: boolean;
};

const FormerTeacher = ({ name }: { name?: string }) => (
  <Body
    htmlVariant="p"
    size="md"
    color="weak"
    className="line-through truncate max-w-[140px]"
  >
    {name}
  </Body>
);

export const TeacherCell: React.FC<TeacherCellProps> = ({
  teacherName,
  originalTeacherName,
  coach_override,
  hasPendingReplacementRequest,
}) => {
  const { t } = useTranslation("sessionList");
  return (
    <>
      {hasPendingReplacementRequest ? (
        <div className="flex gap-xs items-center">
          <Tooltip
            label={t("table.substitution.pendingRequest")}
            placement="bottom"
          >
            <Icon icon="clock" size="sm" />
          </Tooltip>
          <FormerTeacher name={originalTeacherName} />
        </div>
      ) : (
        <div className="flex gap-md items-center">
          <Body htmlVariant="p" size="md" className="truncate max-w-[140px]">
            {teacherName}
          </Body>
          {coach_override && <FormerTeacher name={originalTeacherName} />}
        </div>
      )}
    </>
  );
};
