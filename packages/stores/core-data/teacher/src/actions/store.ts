import { teacherStore } from "#src/store";
import type { Teacher } from "#src/types";

export const updateTeacher = (updatedTeacher: Teacher) => {
  teacherStore.setState((state) => {
    if (!updatedTeacher) return state;

    const id = updatedTeacher.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedTeacher },
    };
  });
};

export const setTeachers = ({
  teachers,
  count,
  page,
}: {
  teachers: Teacher[];
  count: number;
  page: number;
}) => {
  teacherStore.setState(() => {
    const byId = teachers.reduce(
      (acc, teacher) => {
        acc[teacher.id] = teacher;
        return acc;
      },
      {} as { [key: number]: Teacher },
    );

    return {
      ids: teachers.map((teacher) => teacher.id),
      byId,
      count,
      page,
    };
  });
};
