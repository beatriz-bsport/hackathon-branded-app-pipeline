import { memo } from "react";

import Button from "#src/components/Button";
import type { ProgressBarStatuses } from "#src/components/ProgressBar";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

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
const LoaderActionButton = ({
  progressBarStatus,
  onAbortUploadClick,
  onDeleteUploadedFileClick,
  onRetryUploadClick,
}: LoaderActionButtonProps) => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  // Loading state
  if (progressBarStatus === "main") {
    return (
      <Button
        kind="icon-button"
        onClick={onAbortUploadClick}
        color="default"
        intent="flat"
        icon="x-close"
        label={t("fileUpload.actions.abort")}
        size="sm"
      />
    );
  }
  // Completed and success state
  if (progressBarStatus === "positive") {
    return (
      <Button
        kind="icon-button"
        onClick={onDeleteUploadedFileClick}
        color="default"
        intent="flat"
        icon="x-close"
        label={t("fileUpload.actions.remove")}
        size="sm"
      />
    );
  }
  // Completed and error state
  if (progressBarStatus === "critical") {
    return (
      <div className="flex flex-row items-center gap-sm">
        <Button
          kind="icon-button"
          onClick={onRetryUploadClick}
          color="default"
          intent="flat"
          icon="refresh-cw-01"
          label={t("fileUpload.actions.retry")}
          size="sm"
        />
        <Button
          kind="icon-button"
          onClick={onDeleteUploadedFileClick}
          color="default"
          intent="flat"
          icon="x-close"
          label={t("fileUpload.actions.remove")}
          size="sm"
        />
      </div>
    );
  }
  return null;
};

export default memo(LoaderActionButton);
