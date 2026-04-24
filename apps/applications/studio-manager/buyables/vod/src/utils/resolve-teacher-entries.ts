import type { TeacherPreview } from "#src/hooks/api/use-teachers-by-associated-coach-id-query";

export const resolveTeacherEntries = (
  coaches: number[],
  teachersByAssociatedCoachId: Map<number, TeacherPreview>,
): [number, TeacherPreview][] =>
  Array.from(
    coaches.reduce((teachersByCoachId, coachId) => {
      const teacher = teachersByAssociatedCoachId.get(coachId);

      if (teacher && !teachersByCoachId.has(coachId)) {
        teachersByCoachId.set(coachId, teacher);
      }

      return teachersByCoachId;
    }, new Map<number, TeacherPreview>()),
  );
