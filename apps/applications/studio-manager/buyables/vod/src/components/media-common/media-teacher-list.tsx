import type { FC } from "react";

import { Avatar, Body } from "@bsport/kaizen-primitive-core";

import type { TeacherPreview } from "#src/hooks/api/use-teachers-by-associated-coach-id-query";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";

type MediaTeacherListProps = {
  teacherEntries: [number, TeacherPreview][];
};

export const MediaTeacherList: FC<MediaTeacherListProps> = ({
  teacherEntries,
}) => {
  if (teacherEntries.length === 0) {
    return null;
  }

  return (
    <div className="mt-md flex flex-wrap items-center gap-xs">
      {teacherEntries.map(([coachId, teacher]) => (
        <div
          key={coachId}
          className="flex items-center gap-xs rounded-full bg-surface-default-weak px-sm py-xs"
        >
          <Avatar
            shape="round"
            size="sm"
            src={teacher.photo ?? undefined}
            alt={teacher.name}
            initials={getTeacherInitials(teacher.name)}
          />
          <Body htmlVariant="span" size="md" color="default">
            {teacher.name}
          </Body>
        </div>
      ))}
    </div>
  );
};
