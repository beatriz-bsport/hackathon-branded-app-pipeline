import React, { useCallback, useEffect, useState } from "react";

import { TeacherTable } from "#src/components/TeacherTable";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";

import { TeacherArchiveModal } from "./TeacherArchiveModal";

export const TeacherListContent: React.FC<{
  searchInput: string;
  onAddTeacherClick: () => void;
}> = ({ searchInput, onAddTeacherClick }) => {
  const {
    paginationParams,
    teachers,
    isLoading,
    isEmpty,
    isEmptySearch,
    fuzzySearchTeachers,
    fetchTeacherPage,
  } = useFetchTeachers({ searchInput, archived: false });

  const [teacherToArchive, setTeacherToArchive] = useState<{
    teacherId: number;
    teacherName: string;
  } | null>(null);

  // ----- Handlers -----

  const handleCloseArchiveModal = useCallback(() => {
    setTeacherToArchive(null);
  }, []);

  // ----- Load data -----

  useEffect(() => {
    fuzzySearchTeachers();
  }, [fuzzySearchTeachers]);

  useEffect(() => {
    fetchTeacherPage();
  }, [fetchTeacherPage]);

  return (
    <>
      <TeacherTable
        mode="active"
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        isLoading={isLoading}
        paginationProps={paginationParams}
        teachers={teachers}
        handleArchive={setTeacherToArchive}
        onAddTeacherClick={onAddTeacherClick}
      />
      {teacherToArchive && (
        <TeacherArchiveModal
          isOpen
          teacherId={teacherToArchive.teacherId}
          teacherName={teacherToArchive.teacherName}
          onClose={handleCloseArchiveModal}
          refreshPageList={searchInput ? fuzzySearchTeachers : fetchTeacherPage}
        />
      )}
    </>
  );
};
