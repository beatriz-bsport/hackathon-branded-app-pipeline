import React from "react";

import { type Teacher, TeacherTable } from "#src/components/TeacherTable";
import TEMP_DATA from "#src/pages/temp_data.json";

export const TeacherListContent: React.FC = () => {
  return (
    <TeacherTable
      mode="active"
      /** @todo Will set true parameters after */
      paginationProps={{
        currentPage: 1,
        rowsPerPage: 10,
        totalItems: 100,
        showRowsPerPageSelector: true,
      }}
      teachers={TEMP_DATA as Teacher[]}
      handleArchive={({ teacherId, teacherName }) =>
        console.log(`Archive ${teacherName} - n°${teacherId} `)
      }
    />
  );
};
