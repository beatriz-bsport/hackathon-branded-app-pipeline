import { useCallback, useState } from "react";

import {
  type BackgroundTask,
  fetchBackgroundTaskAction,
  selectBackgroundTask,
  useBackgroundTaskStore,
} from "@bsport/store-shared-background-task";

import { fetch } from "#src/utils/fetch";

import {
  IMPORT_STATUSES,
  type ImportBackgroundTaskReturnValue,
  type ImportStatus,
  LEAD_MANAGEMENT_ERRORS,
} from "./constants";

export const useImportLeadsUtils = ({
  handleOpenModal,
  refreshMemberList,
}: {
  handleOpenModal: () => void;
  refreshMemberList: () => void;
}) => {
  const [status, setStatus] = useState<ImportStatus>(
    IMPORT_STATUSES.UPLOADING_FILE,
  );

  const [backgroundTaskUuid, setBackgroundTaskUuid] = useState("");
  const backgroundTask = useBackgroundTaskStore((state) =>
    selectBackgroundTask(state, backgroundTaskUuid),
  ) as BackgroundTask<ImportBackgroundTaskReturnValue> | undefined;

  const handleProcessTask = useCallback(
    (backgroundTaskUuid: string) => {
      // Background task has been created -> Move to processing status
      setStatus(IMPORT_STATUSES.PROCESSING_FILE);
      setBackgroundTaskUuid(backgroundTaskUuid);

      // Recursively ask to the backend the status of the background task
      fetchBackgroundTaskAction<string[] | undefined, { error_code: number }>(
        fetch,
        {
          uuid: backgroundTaskUuid,
          callbacks: {
            onEndpointFailure: () => {
              // Open back the modal in case it has been closed
              handleOpenModal();
              // Set status to unknwon error
              setStatus(IMPORT_STATUSES.IMPORT_FAILURE);
            },
            onSuccess: (backgroundTask) => {
              // Open back the modal in case it has been closed
              handleOpenModal();
              // Set status to partial or full success
              if (
                Array.isArray(backgroundTask?.return_value) &&
                backgroundTask.return_value.length > 1
              ) {
                setStatus(IMPORT_STATUSES.PARTIAL_ROWS_ERRORS);
              } else {
                setStatus(IMPORT_STATUSES.SUCCESSFUL_IMPORT);
              }
              // Display a toast about the number of newly created members
              /** @todo The background task does not inform the number of success yet  */
              // toast({
              //   status: "positive",
              //   icon: "user-plus-01",
              //   // @ts-expect-error Typescript intellisense for i18n does not understand yet the plural management
              //   title: t("importLeadsModal.importSuccess.importedLeadsNumber", {
              //     count: 10,
              //   }),
              // });

              // Reload data
              refreshMemberList();
            },
            onTaskFailure: (backgroundTask) => {
              // Open back the modal in case it has been closed
              handleOpenModal();
              // Set status
              if (
                backgroundTask.return_value &&
                Object.hasOwn(backgroundTask.return_value, "error_code") &&
                backgroundTask.return_value.error_code ===
                  LEAD_MANAGEMENT_ERRORS.TASK_ALREADY_IN_PROCESS
              ) {
                setStatus(IMPORT_STATUSES.TASK_ALREADY_IN_PROGRESS);
              } else {
                setStatus(IMPORT_STATUSES.IMPORT_FAILURE);
              }
            },
            onTimeout: () => {
              // Open back the modal in case it has been closed
              handleOpenModal();
              // Set status
              setStatus(IMPORT_STATUSES.IMPORT_TIMEOUT);
            },
          },
        },
      );
    },
    [refreshMemberList, handleOpenModal],
  );

  const handleResetStatus = useCallback((currentStatus: ImportStatus) => {
    if (currentStatus !== IMPORT_STATUSES.PROCESSING_FILE) {
      setStatus(IMPORT_STATUSES.UPLOADING_FILE);
    }
  }, []);

  return {
    status,
    handleResetStatus,
    backgroundTask,
    handleProcessTask,
  };
};
