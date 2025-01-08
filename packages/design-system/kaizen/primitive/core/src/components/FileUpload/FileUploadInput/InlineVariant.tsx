import classNames from "classnames";
import Icon from "#src/components/Icon";

/**
 * Inline variant for FileUploadInput, mirroring the aspect of a Button.
 */
const InlineVariant: React.FC = () => {
  // ##### TODO : internationalization
  const uploadFileLabel = "Upload file";

  return (
    <div
      className={classNames(
        "transition ease-in duration-default",
        "cursor-pointer",
        // Flex config
        "flex flex-row items-center justify-center gap-0",
        // Text
        "text-body-md font-weak leading-xs",
        "fill-onsurface-default-onstrong",
        "text-onsurface-default-onstrong",
        // Rest
        "shadow-action-call-to-action-rest",
        "bg-surface-action-main-strong-rest",
        // Hover
        "hover:shadow-action-call-to-action-hovered",
        "hover:bg-surface-action-main-strong-hovered",
        // Active
        "active:shadow-action-call-to-action-pressed",
        "active:bg-surface-action-main-strong-pressed",
        // Container
        "rounded-sm border-0 w-fit p-2xs",
      )}
    >
      <Icon size="sm" icon="upload-01" />
      <p className="mx-xs">{uploadFileLabel}</p>
    </div>
  );
};

export default InlineVariant;
