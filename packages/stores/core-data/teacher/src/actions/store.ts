import type { Teacher } from "@bsport/api-core";

import { teacherStore } from "#src/store";

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

const _buildById = ({
  initial,
  teachers,
}: {
  initial: { [key: number]: Teacher };
  teachers: Teacher[];
}) => {
  return teachers.reduce(
    (acc, teacher) => {
      acc[teacher.id] = teacher;
      return acc;
    },
    { ...initial },
  );
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
  teacherStore.setState((state) => {
    return {
      ids: teachers.map((teacher) => teacher.id),
      byId: _buildById({ initial: state.byId, teachers }),
      count,
      page,
    };
  });
};

export const setFlatTeachers = ({ teachers }: { teachers: Teacher[] }) => {
  teacherStore.setState((state) => {
    return {
      flatIds: teachers.map((teacher) => teacher.id),
      byId: _buildById({ initial: state.byId, teachers }),
    };
  });
};

export const setFuzzySearchTeachers = ({
  teachers,
}: {
  teachers: Teacher[];
}) => {
  teacherStore.setState((state) => {
    return {
      fuzzyIds: teachers.map((teacher) => teacher.id),
      byId: _buildById({ initial: state.byId, teachers }),
    };
  });
};
