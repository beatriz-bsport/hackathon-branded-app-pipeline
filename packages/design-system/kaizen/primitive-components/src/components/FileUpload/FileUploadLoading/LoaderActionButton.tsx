import { memo } from "react";

import Button from "#src/components/Button";
import type { ProgressBarStatuses } from "#src/components/ProgressBar";

type LoaderActionButtonProps = {
  progressBarStatus: ProgressBarStatuses;
  onAbortUploadClick: () => void;
  onDeleteUploadedFileClick: () => void;
  onRetryUploadClick: () => void;
};

/**
 * An Icon button to allow file management during and after file uploading.
 * @param props.progressBarStatus Status to display on the progress bar.
 * @param props.onAbortUploadClick Action to abort a progressing upload request.
 * @param props.onDeleteUploadedFileClick Action to remove file tracker in the list when the file upload has been successfull.
 * @param props.onRetryUploadClick Action to trigger when the file upload has failed.
 */
const LoaderActionButton: React.FC<LoaderActionButtonProps> = ({
  progressBarStatus,
  onAbortUploadClick,
  onDeleteUploadedFileClick,
  onRetryUploadClick,
}) => {
  // Loading state
  if (progressBarStatus === "main") {
    return (
      <Button
        onClick={onAbortUploadClick}
        color="default"
        intent="flat"
        iconLeft="x-close"
        size="sm"
      />
    );
  }
  // Completed and success state
  if (progressBarStatus === "positive") {
    return (
      <Button
        onClick={onDeleteUploadedFileClick}
        color="default"
        intent="flat"
        iconLeft="x-close"
        size="sm"
      />
    );
  }
  // Completed and error state
  if (progressBarStatus === "critical") {
    return (
      <Button
        onClick={onRetryUploadClick}
        color="default"
        intent="flat"
        iconLeft="refresh-cw-01"
        size="sm"
      />
    );
  }
  return null;
};

export default memo(LoaderActionButton);
