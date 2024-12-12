import React, { useMemo } from "react";
import classNames from "classnames";

import type { FileType, FileUploadTracker } from "../constants";
import { getFormattedExtensionForInput } from "../utils";

import InlineVariant from "./InlineVariant";
import DefaultVariant from "./DefaultVariant";

type FileUploadInputProps = {
  disabled?: boolean;
  fileExtensionList?: FileType[];
  fileExtensionListHint?: string;
  handleAddFiles: (fileList: FileList | null) => FileUploadTracker[];
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
};

/**
 * React component to input and store Files in state, matching expected files extensions.
 * @param props.disabled Whether the file input should be disabled.
 * @param props.fileExtensionList Array of allowed file extensions. If omitted, all file types are accepted.
 * @param props.fileExtensionListHint Text hint displayed to inform users about the accepted file types.
 * @param props.handleAddFiles Function that add FileUploadTracker to state management.
 * @param props.inputId Unique identifier of the input.
 * @param props.inputName Name to pass to the underlying `<input>` element.
 * @param props.inline Whether to display the component in an inline style.
 * @param props.multiple Whether to allow selecting multiple files.
 * @param props.onFileDrop Callback function invoked after a FileList is detected in the dropzone.
 * @param props.onInputChange Callback function invoked after a FileList is added to the file input.
 */
const FileUploadInput: React.FC<FileUploadInputProps> = ({
  disabled,
  fileExtensionListHint,
  fileExtensionList,
  handleAddFiles,
  inline,
  inputId,
  inputName,
  multiple,
  onFileDrop,
  onInputChange,
}) => {
  const acceptedExtensions = getFormattedExtensionForInput(fileExtensionList);

  const handleAddFilesFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    const newFileUploadTrackerItems = handleAddFiles(fileList);
    onInputChange?.({ newItems: newFileUploadTrackerItems, fileList });
  };

  const fileUploadContent = useMemo(() => {
    const handleAddFilesFromDropzone = (fileList: FileList) => {
      const newFileUploadTrackerItems = handleAddFiles(fileList);
      onFileDrop?.({ newItems: newFileUploadTrackerItems, fileList });
    };
    return inline ? (
      <InlineVariant />
    ) : (
      <DefaultVariant
        fileExtensionListHint={fileExtensionListHint}
        handleDropFiles={handleAddFilesFromDropzone}
      />
    );
  }, [inline, fileExtensionList, handleAddFiles, onFileDrop]);

  return (
    <label
      htmlFor={inputId}
      className={classNames("w-full h-fit", {
        "pointer-events-none opacity-sm": disabled,
      })}
    >
      <input
        className="hidden"
        type="file"
        id={inputId}
        aria-disabled={disabled}
        disabled={disabled}
        onChange={handleAddFilesFromInput}
        multiple={multiple}
        accept={acceptedExtensions}
        aria-describedby={fileExtensionListHint}
        name={inputName || inputId}
      />
      {fileUploadContent}
    </label>
  );
};

export default FileUploadInput;
