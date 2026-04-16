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

import type { CollectionFormData, CollectionFormMethods } from "../types";

type CollectionFormPictureProps = {
  formId: string;
  methods: CollectionFormMethods;
};

function createUrl(file: File | Blob | null) {
  if (!file) {
    return null;
  }

  try {
    return (window.URL || window.webkitURL).createObjectURL(file);
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(err);
      return null;
    }
    throw err;
  }
}

export const CollectionFormPicture: FC<CollectionFormPictureProps> = ({
  formId,
  methods,
}) => {
  const { t } = useTranslation("collection-form");
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
        URL.revokeObjectURL(url);
      }
    };
  }, [cover]);

  return (
    <div className="w-full flex flex-col items-center gap-xs">
      {coverPreview && <Media src={coverPreview} size="xl" alt="cover" />}

      <FormField<CollectionFormData, "cover", FileUploadProps>
        name="cover"
        mapProps={({ defaultProps, field, form }) => ({
          ...defaultProps,
          handleUploadFile: async (file) => {
            const fileUrl = createUrl(file);
            form.setValue("cover", file, {
              shouldDirty: true,
            });

            await new Promise((r) => setTimeout(r, 300));

            const status = fileUrl
              ? FILE_UPLOAD_STATUSES.success
              : FILE_UPLOAD_STATUSES.error;

            // Clean up the object URL to prevent memory leak
            if (fileUrl) {
              URL.revokeObjectURL(fileUrl);
            }

            return { status };
          },
          inline: !!field.value,
          className: cx("w-full items-center flex-col", {
            flex: field.value,
          }),
        })}
      >
        {/** @ts-expect-error Pass props implicitly - FormField is forwarding the `handleUploadFile` props */}
        <FileUpload
          id={`${formId}-cover`}
          fileExtensionList={["image/*"]}
          multiple={false}
          autoUpload
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
