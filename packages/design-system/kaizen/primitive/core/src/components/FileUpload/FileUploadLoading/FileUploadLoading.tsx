import { cva } from "class-variance-authority";

import { type FileUploadTracker, UPLOAD_STATUSES } from "../constants";
import type { FileUploadFieldStatus } from "../file-upload-status";
import LoaderProgressBar from "./LoaderProgressBar";
import LoadingIcon from "./LoadingIcon";

const defaultClasses = [
  "rounded-md",
  "p-md",
  "flex flex-col items-center gap-xs",
] as const;

const variants = {
  inline: {
    true: "",
    false: ["border-stroke-thin", "bg-surface-default"],
  },
  status: {
    default: "",
    error: "",
    positive: "",
  },
} as const;

const fileUploadLoading = cva(defaultClasses, {
  variants,
  compoundVariants: [
    {
      inline: false,
      status: "default",
      className: ["border-dashed", "border-stroke-action-default-rest/md"],
    },
    {
      inline: false,
      status: "error",
      className: [
        "border-solid",
        "border-stroke-status-critical",
        "shadow-border-thin-critical",
      ],
    },
    {
      inline: false,
      status: "positive",
      className: [
        "border-solid",
        "border-stroke-status-positive",
        "shadow-border-thin-positive",
      ],
    },
  ],
});

type FileUploadLoadingProps = {
  className?: string;
  fileUploadTrackerList: FileUploadTracker[];
  handleAbortUpload: (fileUploadTracker: FileUploadTracker) => void;
  handleRemoveFileFromList: (fileUploadTracker: FileUploadTracker) => void;
  handleRetryUpload: (fileUploadTracker: FileUploadTracker) => void;
  inline?: boolean;
  status?: FileUploadFieldStatus;
};

/**
 * A React component to display the uploading state of one or multiple files.
 * @param props.fileUploadTrackerList The list of the state tracker of the files being uploaded .
 * @param props.handleAbortUpload Handler to abort a progressing upload request.
 * @param props.handleRemoveFileFromList Handler to remove the item from the state list.
 * @param props.handleRetryUpload Handler to retry upload when it has failed.
 * @param props.inline Whether to display the component in an inline style.
 */
const FileUploadLoading = ({
  className,
  fileUploadTrackerList,
  handleAbortUpload,
  handleRemoveFileFromList,
  handleRetryUpload,
  inline,
  status = "default",
}: FileUploadLoadingProps) => {
  const _fileUploadTrackerList = fileUploadTrackerList || [];
  const isUploading = _fileUploadTrackerList.some(
    (item) => item.status === UPLOAD_STATUSES.loading,
  );
  return (
    <div
      data-component="Kaizen-FileUpload-Loading"
      className={fileUploadLoading({ className, inline, status })}
    >
      {!inline && <LoadingIcon isUploading={isUploading} />}
      {_fileUploadTrackerList.map((fileUploadTracker) => (
        <LoaderProgressBar
          key={fileUploadTracker.file.name}
          fileUploadTracker={fileUploadTracker}
          handleRemoveFileFromList={handleRemoveFileFromList}
          handleAbortUpload={handleAbortUpload}
          handleRetryUpload={handleRetryUpload}
        />
      ))}
    </div>
  );
};

export default FileUploadLoading;
