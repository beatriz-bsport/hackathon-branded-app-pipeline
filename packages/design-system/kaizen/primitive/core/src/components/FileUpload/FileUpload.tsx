import React, {
  useState,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

import {
  UPLOAD_STATUSES,
  type FileUploadStatus,
  type FileUploadTracker,
  type FileType,
} from "./constants";
import { getNewFileUploadTrackerItems } from "./utils";
import FileUploadInput from "./FileUploadInput";
import FileUploadLoading from "./FileUploadLoading";

export type FileUploadProps = React.HTMLAttributes<HTMLDivElement> & {
  autoUpload?: boolean;
  disabled?: boolean;
  fileExtensionList?: FileType[];
  fileExtensionListHint?: string;
  fileUploadTrackerList?: FileUploadTracker[];
  handleUploadFile: (
    file: File,
    signal: AbortSignal,
    onUploadProgress: (progressEvent: ProgressEvent) => void,
  ) => Promise<FileUploadStatus>;
  inline?: boolean;
  inputId: string;
  inputName?: string;
  multiple?: boolean;
  onFileDrop?: (params: {
    fileList: FileList | null;
    newItems: FileUploadTracker[];
  }) => void;
  onInputChange?: (params: {
    fileList: FileList | null;
    newItems: FileUploadTracker[];
  }) => void;
  setFileUploadTrackerList?: Dispatch<SetStateAction<FileUploadTracker[]>>;
  uploadCallback?: () => void;
};

/**
 * A React component for file uploads, with built-in upload tracking.
 * Tracks upload progress using React state, which can be managed externally by the parent component
 * or internally by the component itself.
 * Apart from the `handleUploadFile` function, all upload logic is encapsulated within the component.
 *
 * @param props.autoUpload Whether to automatically start the upload when files are selected.
 * @param props.className Additional CSS classes to apply to the main container.
 * @param props.disabled Whether the file input should be disabled.
 * @param props.fileExtensionList Array of allowed file extensions. If omitted, all file types are accepted.
 * @param props.fileExtensionListHint Text hint displayed to inform users about the accepted file types.
 * @param props.fileUploadTrackerList State value to track the list of upload processes.
 * @param props.handleUploadFile Function to handle file uploads. Receives a `File` object as an argument.
 * @param props.inline Whether to display the component in an inline style.
 * @param props.inputId Unique identifier of the input.
 * @param props.inputName Name to pass to the underlying `<input>` element.
 * @param props.multiple Whether to allow selecting multiple files.
 * @param props.onFileDrop Callback function invoked after a FileList is detected in the dropzone.
 * @param props.onInputChange Callback function invoked after a FileList is added to the file input.
 * @param props.setFileUploadTrackerList State setter function to manage `fileUploadTrackerList`.
 * @param props.uploadCallback Callback function invoked after the upload process starts.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-fileupload--docs
 */
const FileUpload: React.FC<FileUploadProps> = ({
  autoUpload,
  className,
  disabled,
  fileExtensionList = [],
  fileExtensionListHint,
  fileUploadTrackerList,
  handleUploadFile,
  inline,
  inputId,
  inputName,
  multiple,
  onFileDrop,
  onInputChange,
  setFileUploadTrackerList,
  uploadCallback,
  ...props
}) => {
  // ----- State -----

  // A internal state to manage file uploading state
  const [managedFileUploadTrackerList, setManagedFileUploadTrackerList] =
    useState<FileUploadTracker[]>([]);

  // Whether the trackers are provided by props
  const isControlledFromParent =
    fileUploadTrackerList && setFileUploadTrackerList;

  // Define the state to use as tracker manager
  const currentFileUploadTrackerList =
    (isControlledFromParent
      ? fileUploadTrackerList
      : managedFileUploadTrackerList) || [];
  const setCurrentFileUploadTrackerList = isControlledFromParent
    ? setFileUploadTrackerList
    : setManagedFileUploadTrackerList;

  // ----- Handlers to modify the state-----

  /**
   * Given a FileList, create for each valid file in the list a FileUploadTracker object and
   * - add it to the currentFileUploadTrackerList if multiple files are accepted
   * - replace the current file (if it exists) in currentFileUploadTrackerList if single input
   */
  const handleAddFiles = (fileList?: FileList | null) => {
    let newFileUploadTrackerItems: FileUploadTracker[] = [];

    if (!fileList?.length) return newFileUploadTrackerItems;

    // Multiple files authorized
    if (multiple) {
      setCurrentFileUploadTrackerList((prev) => {
        const newMultipleItems = getNewFileUploadTrackerItems({
          currentList: prev,
          newFileList: fileList,
          acceptedExtensions: fileExtensionList,
        });
        newFileUploadTrackerItems = newMultipleItems;
        return [...prev, ...newMultipleItems];
      });

      return newFileUploadTrackerItems;
    }

    // Single file authorized
    const cleanFileUploadTrackerList = getNewFileUploadTrackerItems({
      currentList: [],
      newFileList: fileList,
      acceptedExtensions: fileExtensionList,
    });
    if (cleanFileUploadTrackerList.length > 0) {
      const newSingleItem = cleanFileUploadTrackerList[0];
      newFileUploadTrackerItems = [newSingleItem];
      setCurrentFileUploadTrackerList([newSingleItem]);
    }
    return newFileUploadTrackerItems;
  };

  const handleRemoveFileFromList = (fileUploadTracker: FileUploadTracker) => {
    setCurrentFileUploadTrackerList((prev) => [
      ...prev.filter((item) => item.file.name != fileUploadTracker.file.name),
    ]);
  };

  const handleUpdateFileTracker = (
    file: File,
    newStatus: FileUploadStatus,
    newProgressValue: number,
  ) => {
    // Make a check on the status to be sure the upload progress has not finished yet
    const previousStatus = currentFileUploadTrackerList.find(
      (item) => item.file.name === file.name,
    )?.status;
    if (previousStatus === UPLOAD_STATUSES.success) return;

    // Update the file tracker while keeping the same order
    setCurrentFileUploadTrackerList((prev) =>
      prev.map((tracker) =>
        tracker.file === file
          ? { ...tracker, status: newStatus, progressValue: newProgressValue }
          : tracker,
      ),
    );
  };

  // ----- Handlers to trigger file uploading -----

  const makeFileUpload = async (fileUploadTracker: FileUploadTracker) => {
    // Update the status to "loading"
    handleUpdateFileTracker(fileUploadTracker.file, UPLOAD_STATUSES.loading, 0);

    try {
      const signal = fileUploadTracker.controller.signal;
      const onUploadProgress = function (progressEvent: ProgressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        handleUpdateFileTracker(
          fileUploadTracker.file,
          UPLOAD_STATUSES.loading,
          percentCompleted,
        );
      };
      // Await the backend call and provide
      // - a signal (AbortSignal) to abort the request when clicking on the abort icon
      // - a function that retrieves the progress directly on the pending request and update the state in consequence
      const newStatus = await handleUploadFile(
        fileUploadTracker.file,
        signal,
        onUploadProgress,
      );

      // Update the status after backend response
      handleUpdateFileTracker(fileUploadTracker.file, newStatus, 100);
    } catch (error) {
      // Set progress to 100% and update status to "error"
      handleUpdateFileTracker(
        fileUploadTracker.file,
        UPLOAD_STATUSES.error,
        100,
      );
    }
  };

  const handleAbortUpload = (fileUploadTracker: FileUploadTracker) => {
    // Trigger an abort signal
    // This discards the `then` methods on the fetch operation, and the `catch` method is executed.
    // To know that the catch is triggered by the abort and not another error,
    // it is possible to check signal.aborted === "true"
    fileUploadTracker.controller?.abort();
  };

  // ----- Upload manager -----

  // Whether the end-user should be able to add files for uploading
  const renderFileUploadInput = useMemo(() => {
    return (
      currentFileUploadTrackerList.length === 0 ||
      currentFileUploadTrackerList.every(
        (item) => item.status === UPLOAD_STATUSES.default,
      )
    );
  }, [currentFileUploadTrackerList]);

  useEffect(() => {
    // Whether files are ready to be uploaded
    const filesArePendingToUpload =
      currentFileUploadTrackerList?.length &&
      currentFileUploadTrackerList.every(
        (item) => item.status === UPLOAD_STATUSES.default,
      );
    if (!!autoUpload && filesArePendingToUpload) {
      Promise.all(
        currentFileUploadTrackerList.map((item) => {
          makeFileUpload(item);
        }),
      ).then(() => uploadCallback?.());
    }
  }, [currentFileUploadTrackerList, autoUpload, uploadCallback]);

  return (
    <div className={className || ""} {...props}>
      {renderFileUploadInput ? (
        <FileUploadInput
          disabled={disabled}
          handleAddFiles={handleAddFiles}
          fileExtensionList={fileExtensionList}
          fileExtensionListHint={fileExtensionListHint}
          inline={inline}
          inputId={inputId}
          inputName={inputName}
          multiple={multiple}
          onFileDrop={onFileDrop}
          onInputChange={onInputChange}
        />
      ) : (
        <FileUploadLoading
          fileUploadTrackerList={currentFileUploadTrackerList}
          inline={inline}
          handleAbortUpload={handleAbortUpload}
          handleRemoveFileFromList={handleRemoveFileFromList}
          handleRetryUpload={makeFileUpload}
        />
      )}
    </div>
  );
};

FileUpload.displayName = "KaizenFileUpload";

export default FileUpload;
