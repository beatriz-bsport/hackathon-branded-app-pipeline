import classNames from "classnames";
import { useState } from "react";

type FileDropzoneProps = {
  children: React.ReactNode;
  className?: string;
  dragOverClassName?: string;
  handleDropFiles: (files: FileList) => void;
  disabled?: boolean;
};

/**
 * A Wrapper to enable file dropping.
 * @param props.children React component that is wrapped in the dropable zone.
 * @param props.className Classes to pass to the Dropzone container.
 * @param props.dragOverClassName Classes to apply to the Dropzone container when hovering with files.
 * @param props.handleDropFiles Function to handle the FileList retrieved from a drop event.
 * @param props.disabled Optional. Whether to disable listeners
 */
const FileDropzone: React.FC<FileDropzoneProps> = ({
  children,
  className,
  dragOverClassName,
  handleDropFiles,
  disabled,
}: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div
      data-component="Kaizen-FileUpload-DropZone"
      aria-disabled={disabled ? "true" : "false"}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) {
          return;
        }
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) {
          return;
        }
        if (e.dataTransfer !== null) {
          e.dataTransfer.dropEffect = "copy";
        }
        return false;
      }}
      onDrop={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) {
          return;
        }
        handleDropFiles(e.dataTransfer.files ?? []);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) {
          return;
        }
        if (
          e.relatedTarget !== null &&
          (e?.currentTarget as Node).contains(e.relatedTarget as Node) === true
        ) {
          // Means the cursor is above a "relatedTarget" which is still inside the Dropzone
          return;
        }
        setIsDragging(false);
      }}
      className={classNames(
        "w-full h-fit min-w-fit whitespace-nowrap",
        className || "",
        (isDragging && dragOverClassName) || "",
      )}
    >
      {children}
    </div>
  );
};

export default FileDropzone;
