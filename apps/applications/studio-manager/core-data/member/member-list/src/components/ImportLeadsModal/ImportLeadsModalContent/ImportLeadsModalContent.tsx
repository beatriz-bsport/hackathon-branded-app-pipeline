import React from "react";

import { Body } from "@bsport/kaizen-primitive-core";
import { BackgroundTask } from "@bsport/store-shared-background-task";

import { useTranslation } from "#src/utils/i18n";

import { GenericDownloadFile } from "./Statuses/GenericDownloadFile";
import { GenericStatusContainer } from "./Statuses/GenericStatusContainer";
import { ProcessingFile } from "./Statuses/ProcessingFile";
import { UploadingFile } from "./Statuses/UploadingFile";
import {
  IMPORT_STATUSES,
  type ImportBackgroundTaskReturnValue,
  type ImportStatus,
} from "./constants";

type ImportLeadsModalContentProps = {
  status: ImportStatus;
  handleProcessTask: (backgroundTaskUuid: string) => void;
  backgroundTask: BackgroundTask<ImportBackgroundTaskReturnValue> | undefined;
};

// Helper function to extract filename from path
const getFilenameFromPath = (path: string): string => {
  // Handle both Unix and Windows paths, and URLs
  return path.split(/[/\\]/).pop() || path.split("?")[0].split("#")[0];
};

export const ImportLeadsModalContent: React.FC<
  ImportLeadsModalContentProps
> = ({ status, handleProcessTask, backgroundTask }) => {
  const { t } = useTranslation("common");

  if (status === IMPORT_STATUSES.UPLOADING_FILE) {
    return <UploadingFile handleProcessTask={handleProcessTask} />;
  }

  if (status === IMPORT_STATUSES.PROCESSING_FILE) {
    return <ProcessingFile />;
  }

  if (status === IMPORT_STATUSES.SUCCESSFUL_IMPORT && backgroundTask) {
    return (
      <GenericStatusContainer
        title={t("importLeadsModal.importSuccess.title")}
        status="success"
      >
        {/* TEMPORARY -> The backend does not send any data on full success */}
        {/* <GenericDownloadFile
          caption={t("importLeadsModal.importSuccess.outputText")}
          filename={
            fileOutputSuccess.split("/").pop() ??
            `${t("importLeadsModal.importSuccess.outputFilename")}.csv`
          }
          pathname={fileOutputSuccess}
          iconName="file-check-02"
        /> */}
      </GenericStatusContainer>
    );
  }

  if (
    status === IMPORT_STATUSES.PARTIAL_ROWS_ERRORS &&
    backgroundTask &&
    Array.isArray(backgroundTask.return_value) &&
    (backgroundTask.return_value ?? []).length >= 2
  ) {
    const returnValue = backgroundTask.return_value;
    const fileOutputSuccess = returnValue[0];
    const fileOutputFailure = returnValue[1];
    return (
      <GenericStatusContainer
        title={t("importLeadsModal.importPartialSuccess.title")}
        status="partial-success"
      >
        {fileOutputSuccess && (
          <GenericDownloadFile
            caption={t("importLeadsModal.importSuccess.outputText")}
            filename={
              getFilenameFromPath(fileOutputSuccess) ??
              `${t("importLeadsModal.importSuccess.outputFilename")}.csv`
            }
            pathname={fileOutputSuccess}
            iconName="file-check-02"
          />
        )}
        {fileOutputFailure && (
          <GenericDownloadFile
            caption={t("importLeadsModal.importPartialSuccess.outputText")}
            filename={
              getFilenameFromPath(fileOutputFailure) ??
              `${t("importLeadsModal.importPartialSuccess.outputFilename")}.csv`
            }
            pathname={fileOutputFailure}
            iconName="file-x-02"
          />
        )}
      </GenericStatusContainer>
    );
  }

  if (status === IMPORT_STATUSES.TASK_ALREADY_IN_PROGRESS) {
    return (
      <GenericStatusContainer
        title={t("importLeadsModal.otherImportInProgress.title")}
        status="partial-success"
      >
        <Body size="sm">
          {t("importLeadsModal.otherImportInProgress.subtitle")}
        </Body>
      </GenericStatusContainer>
    );
  }

  if (status === IMPORT_STATUSES.IMPORT_FAILURE) {
    return (
      <GenericStatusContainer
        title={t("importLeadsModal.importError.title")}
        status="error"
      >
        <Body size="sm">{t("importLeadsModal.importError.unknownError")}</Body>
      </GenericStatusContainer>
    );
  }

  if (status === IMPORT_STATUSES.IMPORT_TIMEOUT) {
    return (
      <GenericStatusContainer
        title={t("importLeadsModal.importTimeout.title")}
        status="error"
      >
        <Body size="sm">
          {t("importLeadsModal.importTimeout.comeBackLater")}
        </Body>
      </GenericStatusContainer>
    );
  }

  return null;
};
