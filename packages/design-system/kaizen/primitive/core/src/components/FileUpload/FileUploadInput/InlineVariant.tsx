import { cva } from "class-variance-authority";
import React from "react";

import Icon from "#src/components/Icon";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const inlineVariantStyle = cva(
  [
    "transition ease-in duration-default",
    // Flex config
    "flex flex-row items-center justify-center gap-0",
    // Text
    "text-body-md font-weak leading-xs",
    "fill-onsurface-default-onstrong",
    "text-onsurface-default-onstrong",
    // Rest
    "shadow-action-call-to-action-rest",
    "bg-surface-action-main-strong-rest",
    // Container
    "rounded-sm border-0 w-fit p-xs",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-md cursor-not-allowed"],
        false: [
          // Hover
          "hover:cursor-pointer hover:shadow-action-call-to-action-hovered",
          "hover:bg-surface-action-main-strong-hovered",
          // Active
          "active:shadow-action-call-to-action-pressed",
          "active:bg-surface-action-main-strong-pressed",
        ],
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

/**
 * Inline variant for FileUploadInput, mirroring the aspect of a Button.
 * @param props.buttonTitle Optional. Text to override the default title of the button.
 * @param props.disabled Optional. Whether to apply disabled style.
 */
const InlineVariant: React.FC<{ buttonTitle?: string; disabled?: boolean }> = ({
  buttonTitle,
  disabled,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const uploadFileLabel = buttonTitle || t("fileUpload.uploadFileCTA");

  return (
    <div
      aria-disabled={disabled ? "true" : "false"}
      className={inlineVariantStyle({ disabled: !!disabled })}
    >
      <Icon size="sm" icon="upload-01" />
      <p className="mx-xs">{uploadFileLabel}</p>
    </div>
  );
};

export default InlineVariant;
