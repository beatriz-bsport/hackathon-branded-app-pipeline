import type { FC } from "react";

import { Chip } from "@bsport/kaizen-primitive-core";

import type { TeacherPreview } from "#src/hooks/api/use-teachers-by-associated-coach-id-query";
import { getNameInitials } from "#src/utils/get-name-initials";

type TeacherChipProps = {
  teacher: TeacherPreview;
};

export const TeacherChip: FC<TeacherChipProps> = ({ teacher }) => (
  <div className="inline-flex items-center gap-xs text-body-md leading-xs text-onsurface-default">
    <Chip
      size="lg"
      color="default"
      type="weak"
      label={getNameInitials(teacher.name)}
      aria-label={teacher.name}
      className="shrink-0 cursor-default"
    />
    <span>{teacher.name}</span>
  </div>
);
