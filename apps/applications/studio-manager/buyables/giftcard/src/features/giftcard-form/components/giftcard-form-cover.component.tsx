import { type FC, useEffect, useState } from "react";

import { FormField } from "@bsport/form";
import {
  Body,
  FILE_UPLOAD_STATUSES,
  FileUpload,
  type FileUploadProps,
  Media,
  cx,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormData, GiftcardFormMethods } from "../types";

type GiftcardFormCoverProps = {
  formId: string;
  methods: GiftcardFormMethods;
  isSharedGiftcard?: boolean;
};

function createUrl(file: File | Blob | null) {
  if (!file) {
    return null;
  }

  try {
    return (window.URL || window.webkitURL).createObjectURL(file);
  } catch (err) {
    // Expected TypeError:
    // TypeError: Failed to execute 'createObjectURL' on 'URL': Overload resolution failed.
    if (err instanceof TypeError) {
      console.error(err);
      return null;
    } else {
      throw err; // For others errors
    }
  }
}

export const GiftcardFormCover: FC<GiftcardFormCoverProps> = ({
  formId,
  methods,
  isSharedGiftcard,
}) => {
  const { t } = useTranslation("giftcard-details");
  const cover = methods.watch("cover");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof cover === "string") {
      setCoverPreview(cover);
      return;
    }

    const url = createUrl(cover);
    setCoverPreview(url);

    return () => {
      if (url) {
        // Object URLs created with createObjectURL are never revoked by default
        URL.revokeObjectURL(url);
      }
    };
  }, [cover]);

  return (
    <div className="w-full flex flex-col items-center gap-xs">
      {coverPreview && <Media src={coverPreview} size="xl" alt="cover" />}

      <FormField<GiftcardFormData, "cover", FileUploadProps>
        name="cover"
        mapProps={({ defaultProps, field, form }) => ({
          ...defaultProps,
          handleUploadFile: async (file) => {
            // Create a url to preview the file
            const fileUrl = createUrl(file);
            form.setValue("cover", file, {
              shouldDirty: true,
            });

            // Add loading animation (the cover is updated asynchronously)
            await new Promise((r) => setTimeout(r, 300));

            // Finalize loading status
            return {
              status: fileUrl
                ? FILE_UPLOAD_STATUSES.success
                : FILE_UPLOAD_STATUSES.error,
            };
          },
          inline: !!field.value,
          className: cx("w-full items-center flex-col", {
            flex: field.value,
          }),
        })}
      >
        {/** @ts-expect-error Pass props implicitely - FormField is forwarding the `handleUploadFile` props */}
        <FileUpload
          id={`${formId}-cover`}
          fileExtensionList={["image/*"]}
          multiple={false}
          autoUpload
          disabled={isSharedGiftcard}
          customTexts={{
            fileExtensionList: t("formFields.cover.extensions"),
          }}
        />
      </FormField>

      {!coverPreview && (
        <Body color="weak" size="sm">
          {t("formFields.cover.helperText")}
        </Body>
      )}
    </div>
  );
};
