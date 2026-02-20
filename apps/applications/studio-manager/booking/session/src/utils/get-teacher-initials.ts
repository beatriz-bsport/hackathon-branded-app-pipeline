import { first } from "lodash";

export const getTeacherInitials = ({
  teacher,
  teacherOverride,
}: {
  teacher: { firstname: string; lastname: string } | null | undefined;
  teacherOverride: { firstname: string; lastname: string } | null | undefined;
}): string => {
  const firstInitial =
    first(teacherOverride?.firstname ?? teacher?.firstname ?? "") ?? "";
  const lastInitial =
    first(teacherOverride?.lastname ?? teacher?.lastname ?? "") ?? "";
  return `${firstInitial}${lastInitial}`;
};
