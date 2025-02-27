import classNames from "classnames";

import Icon from "#src/components/Icon";
import Body from "#src/components/Body";

import FileDropzone from "./FileDropzone";
import { useTranslation, useKaizenI18nInstance } from "#src/i18n";

type DefaultVariantProps = {
  dragAndDropFileCTAText?: string;
  fileExtensionListText?: string;
  handleDropFiles: (files: FileList) => void;
  uploadFileCTAText?: string;
};

/**
 * Default variant for FileUploadInput, with a dropzone and a nice UI container.
 * @param props.dragAndDropFileCTAText [Optional] Hint to call for drag and drop action
 * @param props.handleDropFiles Function to handle the FileList retrieved from a drop event.
 * @param props.fileExtensionListText [Optional] Hint about the expected kinds of files.
 * @param props.uploadFileCTAText [Optional] Hint to call for click action on the input.
 */
const DefaultVariant = ({
  dragAndDropFileCTAText,
  fileExtensionListText,
  handleDropFiles,
  uploadFileCTAText,
}: DefaultVariantProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const uploadFileLabel = uploadFileCTAText || t("fileUpload.uploadFileCTA");
  const dragAndDropFileLabel =
    dragAndDropFileCTAText || t("fileUpload.dragAndDropCTA");

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
          {fileExtensionListText && (
            <Body
              htmlVariant="span"
              color="weaker"
              size="sm"
              className="text-center"
            >
              {fileExtensionListText}
            </Body>
          )}
        </div>
      </>
    </FileDropzone>
  );
};

export default DefaultVariant;
