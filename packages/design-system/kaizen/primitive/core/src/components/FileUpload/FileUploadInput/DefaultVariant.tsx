import { cva, cx } from "class-variance-authority";

import Body from "#src/components/Body";
import Icon from "#src/components/Icon";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import FileDropzone from "./FileDropzone";

const fileDropzoneStyle = cva(
  [
    "group/file-upload",
    "flex flex-col items-center gap-xs p-md w-full",
    "transition-colors ease-out duration-default",
    "border-stroke-thin rounded-md border-dashed",
    "text-onsurface-default",
    // rest
    "border-stroke-action-default-rest",
    "bg-surface-default",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-md cursor-not-allowed"],
        false: [
          // Hover
          "hover:cursor-pointer",
          "hover:border-stroke-action-default-hovered",
          "hover:bg-surface-default-weak",
          // Pressed / Active
          "active:border-stroke-action-default-selected active:border-solid",
          "active:bg-surface-action-default-elevated-selected-rest",
          "active:shadow-action-default-selected",
        ],
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

type DefaultVariantProps = {
  dragAndDropFileCTAText?: string;
  fileExtensionListText?: string;
  handleDropFiles: (files: FileList) => void;
  uploadFileCTAText?: string;
  disabled?: boolean;
};

/**
 * Default variant for FileUploadInput, with a dropzone and a nice UI container.
 * @param props.dragAndDropFileCTAText [Optional] Hint to call for drag and drop action
 * @param props.handleDropFiles Function to handle the FileList retrieved from a drop event.
 * @param props.fileExtensionListText [Optional] Hint about the expected kinds of files.
 * @param props.uploadFileCTAText [Optional] Hint to call for click action on the input.
 * @param props.disabled [Optional] Whether to display disabled style
 */
const DefaultVariant = ({
  dragAndDropFileCTAText,
  fileExtensionListText,
  handleDropFiles,
  uploadFileCTAText,
  disabled,
}: DefaultVariantProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const uploadFileLabel = uploadFileCTAText || t("fileUpload.uploadFileCTA");
  const dragAndDropFileLabel =
    dragAndDropFileCTAText || t("fileUpload.dragAndDropCTA");

  return (
    <FileDropzone
      handleDropFiles={handleDropFiles}
      className={fileDropzoneStyle({ disabled: !!disabled })}
      dragOverClassName={cx(
        disabled
          ? "cursor-not-allowed"
          : [
              "cursor-pointer",
              "border-stroke-action-default-hovered",
              "bg-surface-default-weak",
            ],
      )}
      disabled={disabled}
    >
      <>
        <Icon icon="upload-cloud-02" size="lg" />
        <div className="flex flex-col items-center gap-2xs">
          <Body
            htmlVariant="p"
            size="md"
            weight="weak"
            className={cx(
              // rest
              "text-onsurface-link-rest",
              disabled
                ? ""
                : [
                    "group-hover/file-upload:text-onsurface-main-link-hovered",
                    "group-hover/file-upload:underline",
                    "group-active/file-upload:text-onsurface-main-link-pressed",
                    "group-active/file-upload:no-underline",
                  ],
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
