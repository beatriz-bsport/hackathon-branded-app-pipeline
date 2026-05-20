import type { FC } from "react";

import type { Session } from "@bsport/api-book";
import { Avatar, Body } from "@bsport/kaizen-primitive-core";

import { useRetrieveTeacher } from "#src/hooks/teacher/use-retrieve-teacher";
import { LEGACY_URLS } from "#src/urls";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";

export const TeacherRow: FC<{
  session: Pick<Session, "coach" | "coach_override">;
}> = ({ session }) => {
  const displayedTeacherId = session.coach_override ?? session.coach;
  const originalTeacherId = session.coach;

  // Both hooks always run (rules of hooks). When coach_override is null the two
  // ids are equal and the second call is a cache hit on the same suspense key.
  const { data: displayedTeacher } = useRetrieveTeacher(displayedTeacherId);
  const { data: originalTeacher } = useRetrieveTeacher(originalTeacherId);

  return (
    <a
      href={LEGACY_URLS.COACH_DETAILS(displayedTeacherId)}
      className="flex items-center gap-xs"
    >
      <Avatar
        shape="round"
        size="sm"
        src={displayedTeacher.photo ?? undefined}
        initials={getTeacherInitials({
          teacher: originalTeacher,
          teacherOverride: session.coach_override ? displayedTeacher : null,
        })}
      />
      <Body
        htmlVariant="span"
        size="md"
        color="weak"
        className="hover:underline"
      >
        {displayedTeacher.name}
      </Body>
    </a>
  );
};
