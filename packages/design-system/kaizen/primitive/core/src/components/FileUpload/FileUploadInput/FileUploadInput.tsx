import { cva } from "class-variance-authority";
import React, { useMemo } from "react";

import type { FileType, FileUploadTracker } from "../constants";
import { getFormattedExtensionForInput } from "../utils";
import DefaultVariant from "./DefaultVariant";
import InlineVariant from "./InlineVariant";

const defaultClasses = ["h-fit", "inline-block"] as const;

const variants = {
  disabled: {
    true: ["pointer-events-none", "opacity-sm"],
    false: "",
  },
} as const;

const fileUploadInput = cva(defaultClasses, {
  variants,
});

type FileUploadInputProps = {
  className?: string;
  customTexts: {
    uploadFileCTA?: string;
    dragAndDropFileCTA?: string;
    fileExtensionList?: string;
  };
  disabled?: boolean;
  fileExtensionList?: FileType[];
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
 * @param props.className
 * @param props.customTexts Dictionnary of custom hints to customize texts in the UI.
 * @param props.disabled Whether the file input should be disabled.
 * @param props.fileExtensionList Array of allowed file extensions. If omitted, all file types are accepted.
 * @param props.handleAddFiles Function that add FileUploadTracker to state management.
 * @param props.inputId Unique identifier of the input.
 * @param props.inputName Name to pass to the underlying `<input>` element.
 * @param props.inline Whether to display the component in an inline style.
 * @param props.multiple Whether to allow selecting multiple files.
 * @param props.onFileDrop Callback function invoked after a FileList is detected in the dropzone.
 * @param props.onInputChange Callback function invoked after a FileList is added to the file input.
 */
const FileUploadInput: React.FC<FileUploadInputProps> = ({
  className,
  customTexts,
  disabled,
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
    const {
      uploadFileCTA,
      dragAndDropFileCTA,
      fileExtensionList: fileExtensionListText,
    } = customTexts;
    return inline ? (
      <InlineVariant buttonTitle={uploadFileCTA} />
    ) : (
      <DefaultVariant
        dragAndDropFileCTAText={dragAndDropFileCTA}
        fileExtensionListText={fileExtensionListText}
        handleDropFiles={handleAddFilesFromDropzone}
        uploadFileCTAText={uploadFileCTA}
      />
    );
  }, [inline, customTexts, handleAddFiles, onFileDrop]);

  const { fileExtensionList: fileExtensionListText } = customTexts;

  return (
    <label
      data-component="Kaizen-FileUpload-Input"
      htmlFor={inputId}
      className={fileUploadInput({ className })}
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
        aria-describedby={fileExtensionListText}
        name={inputName || inputId}
      />
      {fileUploadContent}
    </label>
  );
};

export default FileUploadInput;
