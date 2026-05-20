import React from "react";

import { Avatar, Body, Icon } from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useTranslation } from "#src/utils/i18n";

type TeacherCellProps = {
  teacherName?: string;
  originalTeacherName?: string;
  coach_override?: number | null;
  hasPendingReplacementRequest?: boolean;
  teacherAvatar?: string;
  teacherInitials?: string;
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
  teacherAvatar,
  teacherInitials,
}) => {
  const { t } = useTranslation("sessionList");
  return (
    <>
      {hasPendingReplacementRequest ? (
        <div className="flex gap-xs items-center">
          <ResponsiveTooltip
            label={t("table.substitution.pendingRequest")}
            placement="bottom"
          >
            <Icon icon="clock" size="sm" />
          </ResponsiveTooltip>
          <FormerTeacher name={originalTeacherName} />
        </div>
      ) : (
        <div className="flex gap-md items-center">
          <div className="flex gap-xs items-center">
            <Avatar
              shape="round"
              size="sm"
              src={teacherAvatar}
              initials={teacherInitials}
            />
            <Body htmlVariant="p" size="md" className="truncate max-w-[140px]">
              {teacherName}
            </Body>
          </div>
          {coach_override && <FormerTeacher name={originalTeacherName} />}
        </div>
      )}
    </>
  );
};
