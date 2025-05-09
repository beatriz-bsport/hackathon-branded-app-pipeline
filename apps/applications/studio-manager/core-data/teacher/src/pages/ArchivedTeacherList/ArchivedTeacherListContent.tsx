import React, { useEffect } from "react";

import { TeacherTable } from "#src/components/TeacherTable";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";

export const ArchivedTeacherListContent: React.FC<{ searchInput: string }> = ({
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
  } = useFetchTeachers({ searchInput, archived: true });

  // ---- Load data -----

  useEffect(() => {
    fuzzySearchTeachers();
  }, [fuzzySearchTeachers]);

  useEffect(() => {
    fetchTeacherPage();
  }, [fetchTeacherPage]);
  return (
    <TeacherTable
      mode="archived"
      isEmpty={isEmpty}
      isEmptySearch={isEmptySearch}
      isLoading={isLoading}
      paginationProps={paginationParams}
      teachers={teachers}
      handleRestore={({ teacherId, teacherName }) =>
        console.log(`Restore ${teacherName} - n°${teacherId} `)
      }
    />
  );
};
