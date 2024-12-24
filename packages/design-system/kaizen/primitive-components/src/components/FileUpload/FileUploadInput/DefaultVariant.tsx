import classNames from "classnames";

import Icon from "#src/components/Icon";
import Body from "#src/components/Body";

import FileDropzone from "./FileDropzone";

type DefaultVariantProps = {
  handleDropFiles: (files: FileList) => void;
  fileExtensionListHint?: string;
};

/**
 * Default variant for FileUploadInput, with a dropzone and a nice UI container.
 * @param props.handleDropFiles Function to handle the FileList retrieved from a drop event.
 * @param props.fileExtensionListHint Text to provide information about the expected kinds of files.
 */
const DefaultVariant: React.FC<DefaultVariantProps> = ({
  handleDropFiles,
  fileExtensionListHint,
}) => {
  // ##### TODO : internationalization
  const uploadFileLabel = "Upload a file";
  const dragAndDropFileLabel = "or drag and drop it here";

  return (
    <FileDropzone
      handleDropFiles={handleDropFiles}
      className={classNames(
        "group/file-upload",
        "flex flex-col items-center gap-xs p-md w-full",
        "transition-colors ease-out duration-default",
        "border-stroke-thin rounded-md border-dashed",
        "text-onsurface-default",
        // rest
        "border-stroke-action-default-rest",
        "bg-surface-default",
        // hover
        "hover:cursor-pointer",
        "hover:border-stroke-action-default-hovered",
        "hover:bg-surface-default-weak",
        // press / active
        "active:border-stroke-action-default-selected active:border-solid",
        "active:bg-surface-action-default-elevated-selected-rest",
        "active:shadow-action-default-selected",
      )}
      dragOverClassName={classNames(
        "cursor-pointer",
        "border-stroke-action-default-hovered",
        "bg-surface-default-weak",
      )}
    >
      <>
        <Icon icon="upload-cloud-02" size="lg" />
        <div className="flex flex-col items-center gap-2xs">
          <Body
            htmlVariant="p"
            size="md"
            weight="weak"
            className={classNames(
              // rest
              "text-onsurface-link-rest",
              // hover
              "group-hover/file-upload:text-onsurface-main-link-hovered group-hover/file-upload:underline",
              // press / active
              "group-active/file-upload:text-onsurface-main-link-pressed group-active/file-upload:no-underline",
            )}
          >
            {uploadFileLabel}
          </Body>
          <Body
            htmlVariant="span"
            color="default"
            size="sm"
            className="text-center"
          >
            {dragAndDropFileLabel}
          </Body>
          {fileExtensionListHint && (
            <Body
              htmlVariant="span"
              color="weaker"
              size="sm"
              className="text-center"
            >
              {fileExtensionListHint}
            </Body>
          )}
        </div>
      </>
    </FileDropzone>
  );
};

export default DefaultVariant;
