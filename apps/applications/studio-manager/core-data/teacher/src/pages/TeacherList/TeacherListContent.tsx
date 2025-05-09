import React, { useEffect } from "react";

import { TeacherTable } from "#src/components/TeacherTable";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";

export const TeacherListContent: React.FC<{ searchInput: string }> = ({
  searchInput,
}) => {
  const {
    paginationParams,
    teachers,
    isLoading,
    isEmpty,
    isEmptySearch,
    fuzzySearchTeachers,
    fetchTeacherPage,
  } = useFetchTeachers({ searchInput, archived: false });

  // ---- Load data -----

  useEffect(() => {
    fuzzySearchTeachers();
  }, [fuzzySearchTeachers]);

  useEffect(() => {
    fetchTeacherPage();
  }, [fetchTeacherPage]);

  return (
    <TeacherTable
      mode="active"
      isEmpty={isEmpty}
      isEmptySearch={isEmptySearch}
      isLoading={isLoading}
      paginationProps={paginationParams}
      teachers={teachers}
      handleArchive={({ teacherId, teacherName }) =>
        console.log(`Archive ${teacherName} - n°${teacherId} `)
      }
    />
  );
};
