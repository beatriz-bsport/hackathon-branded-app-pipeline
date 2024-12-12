import { cva } from "class-variance-authority";

import { UPLOAD_STATUSES, type FileUploadTracker } from "../constants";

import LoadingIcon from "./LoadingIcon";
import LoaderProgressBar from "./LoaderProgressBar";

const defaultClasses = [
  "rounded-md",
  "border-stroke-thin",
  "p-md",
  "flex flex-col items-center gap-xs",
] as const;

const variants = {
  inline: {
    true: "border-stroke-default/transparent",
    false: [
      "border-dashed",
      "border-stroke-action-default-rest/md",
      "bg-surface-default",
    ],
  },
} as const;

const fileUpload = cva(defaultClasses, {
  variants,
});

type FileUploadLoadingProps = {
  fileUploadTrackerList: FileUploadTracker[];
  handleAbortUpload: (fileUploadTracker: FileUploadTracker) => void;
  handleRemoveFileFromList: (fileUploadTracker: FileUploadTracker) => void;
  handleRetryUpload: (fileUploadTracker: FileUploadTracker) => void;
  inline?: boolean;
};

/**
 * A React component to display the uploading state of one or multiple files.
 * @param props.fileUploadTrackerList The list of the state tracker of the files being uploaded .
 * @param props.handleAbortUpload Handler to abort a progressing upload request.
 * @param props.handleRemoveFileFromList Handler to remove the item from the state list.
 * @param props.handleRetryUpload Handler to retry upload when it has failed.
 * @param props.inline Whether to display the component in an inline style.
 */
const FileUploadLoading: React.FC<FileUploadLoadingProps> = ({
  fileUploadTrackerList,
  handleAbortUpload,
  handleRemoveFileFromList,
  handleRetryUpload,
  inline,
}) => {
  const _fileUploadTrackerList = fileUploadTrackerList || [];
  const uploading = _fileUploadTrackerList.some(
    (item) => item.status === UPLOAD_STATUSES.loading,
  );
  return (
    <div className={fileUpload({ inline })}>
      {!inline && <LoadingIcon uploading={uploading} />}
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
