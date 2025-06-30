import React, { useEffect } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import {
  archiveTeacherAction,
  restoreTeacherAction,
} from "@bsport/store-core-data-teacher";

import {
  type TableRequiredPermissions,
  TeacherTable,
} from "#src/components/TeacherTable";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";
import { useGenericToasts } from "#src/hooks/useGenericToasts";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const ArchivedTeacherListContent: React.FC<{
  searchInput: string;
  permissions: TableRequiredPermissions;
}> = ({ searchInput, permissions }) => {
  const {
    paginationParams,
    teachers,
    isLoading,
    isEmpty,
    isEmptySearch,
    fuzzySearchTeachers,
    fetchTeacherPage,
  } = useFetchTeachers({ searchInput, archived: true });

  const { t } = useTranslation("common");

  // ----- Handlers -----

  const { handleActionFailed, handleActionUndone } = useGenericToasts();

  const handleArchive = async ({ teacherId }: { teacherId: number }) => {
    const response = await archiveTeacherAction(fetch, {
      id: teacherId,
    });

    const onSuccess = () => {
      // Refresh the list
      fetchTeacherPage();
      // Display a toast to inform about the success
      handleActionUndone();
    };

    const onFailure = () => {
      // Display a toast to inform about the failure
      handleActionFailed(t("toasts.messageUndone.error"));
    };

    response.fold(onSuccess, onFailure);
  };

  const handleRestore = async ({ teacherId }: { teacherId: number }) => {
    const response = await restoreTeacherAction(fetch, {
      id: teacherId,
    });

    const onSuccess = () => {
      // Display a toast to "undo" the action
      toast({
        status: "default",
        icon: "unarchive",
        title: t("toasts.messageRestored.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => handleArchive({ teacherId }),
      });

      // Refresh the list
      fetchTeacherPage();
    };

    const onFailure = () => {
      // Display a toast to inform about the failure
      handleActionFailed(t("toasts.messageRestored.error"));
    };

    response.fold(onSuccess, onFailure);
  };
  // ----- Load data -----

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
      handleRestore={handleRestore}
      permissions={permissions}
    />
  );
};
