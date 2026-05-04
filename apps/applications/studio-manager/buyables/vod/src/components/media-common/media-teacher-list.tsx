import type { FC } from "react";

import type { TeacherPreview } from "#src/hooks/api/use-teachers-by-associated-coach-id-query";

import { TeacherChip } from "./teacher-chip";

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
        <TeacherChip key={coachId} teacher={teacher} />
      ))}
    </div>
  );
};
