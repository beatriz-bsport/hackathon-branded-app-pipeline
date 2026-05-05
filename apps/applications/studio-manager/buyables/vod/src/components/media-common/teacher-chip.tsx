import type { FC } from "react";

import { Avatar } from "@bsport/kaizen-primitive-core";

import type { TeacherPreview } from "#src/hooks/api/use-teachers-by-associated-coach-id-query";
import { getNameInitials } from "#src/utils/get-name-initials";

type TeacherChipProps = {
  teacher: TeacherPreview;
};

export const TeacherChip: FC<TeacherChipProps> = ({ teacher }) => (
  <div className="inline-flex items-center gap-xs rounded-full bg-surface-default-weaker py-2xs px-xs text-body-md leading-xs text-onsurface-default shadow-border-thin-default">
    <Avatar
      shape="round"
      size="sm"
      src={teacher.photo ?? undefined}
      alt={teacher.name}
      initials={getNameInitials(teacher.name)}
      className="shrink-0 cursor-default border-none"
    />
    <span>{teacher.name}</span>
  </div>
);
