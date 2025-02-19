import { useState, useMemo } from "react";

import ProgressBar from "#src/components/ProgressBar";

import type { FileUploadTracker } from "../constants";
import { getProgressInformation } from "../utils";

import TransitionWrapper from "./TransitionWrapper";
import LoaderActionButton from "./LoaderActionButton";

type LoaderProgressBarProps = {
  fileUploadTracker: FileUploadTracker;
  handleAbortUpload: (fileUploadTracker: FileUploadTracker) => void;
  handleRemoveFileFromList: (fileUploadTracker: FileUploadTracker) => void;
  handleRetryUpload: (fileUploadTracker: FileUploadTracker) => void;
};

/**
 * React component to render ProgressBar reflecting the upload progress of a file.
 * @param props.fileUploadTracker FileUploadTracker item to render.
 * @param props.handleAbortUpload Handler to abort a progressing upload request.
 * @param props.handleRemoveFileFromList Handler to remove the item from the state list.
 * @param props.handleRetryUpload Handler to retry upload when it has failed.
 * @returns
 */
const LoaderProgressBar = ({
  fileUploadTracker,
  handleAbortUpload,
  handleRemoveFileFromList,
  handleRetryUpload,
}: LoaderProgressBarProps) => {
  const [displayUploadProgress, setDisplayUploadProgress] = useState(true);

  const { status, file, progressValue, customMessage } = fileUploadTracker;
  const { progressBarStatus, progressBarValue, progressMessage } = useMemo(
    () =>
      getProgressInformation({
        status: status,
        uploadProgressValue: progressValue,
        customMessage: customMessage,
      }),
    [status, progressValue],
  );

  const onDeleteUploadedFileClick = () => {
    setDisplayUploadProgress(false);
    // After animation ended, safely remove the file from the list
    setTimeout(() => {
      handleRemoveFileFromList(fileUploadTracker);
    }, 500);
  };

  const onAbortUploadClick = () => {
    handleAbortUpload(fileUploadTracker);
    onDeleteUploadedFileClick();
  };

  const onRetryUploadClick = () => handleRetryUpload(fileUploadTracker);

  return (
    <TransitionWrapper
      isVisible={displayUploadProgress}
      classNameVisibility="max-h-[80px] w-full"
    >
      <div className="flex flex-row justify-start items-start w-full gap-xs">
        <ProgressBar
          size="sm"
          label={file.name}
          status={progressBarStatus}
          value={progressBarValue}
          message={progressMessage}
        />
        <LoaderActionButton
          progressBarStatus={progressBarStatus}
          onAbortUploadClick={onAbortUploadClick}
          onDeleteUploadedFileClick={onDeleteUploadedFileClick}
          onRetryUploadClick={onRetryUploadClick}
        />
      </div>
    </TransitionWrapper>
  );
};

export default LoaderProgressBar;
