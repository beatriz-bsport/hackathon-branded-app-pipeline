import { useEffect, useId, useState } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";
import { Button, Media, TextField, Title } from "@bsport/kaizen-primitive-core";

import { createFileUrl } from "#src/utils/files";
import { useTranslation } from "#src/utils/i18n";

import { PopupFormData } from "./shared-types";

type PopupFormProps = Omit<ControlledFormProps<PopupFormData>, "children">;

export const PopupForm: React.FC<PopupFormProps> = ({
  id,
  onSubmit,
  ...methods
}: PopupFormProps) => {
  const fieldIdPrefix = useId();
  const { t } = useTranslation("campaign");
  const { watch, getFieldState, formState } = methods;

  const linkValue = watch("link");
  const linkFieldState = getFieldState("link", formState);
  const isLinkValid = linkValue && !linkFieldState.error;

  const imageError = formState.errors.image;

  const onLinkButtonClick = () => {
    window.open(linkValue, "_blank", "noopener,noreferrer");
  };

  const image = watch("image");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const url = createFileUrl(image ?? null);
    setImagePreview(url);

    return () => {
      if (url) {
        // Object URLs created with createObjectURL are never revoked by default
        URL.revokeObjectURL(url);
      }
    };
  }, [image]);

  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <Title htmlVariant={"h2"}>
        {t("popup.creation.messageSectionTitle")}
      </Title>
      <FormField<PopupFormData, "name">
        name="name"
        mapProps={({ defaultProps, form, field }) => ({
          ...defaultProps,
          onClear: () => {
            form.setValue("name", "", { shouldDirty: true });
            // We trigger validation after clearing the value
            field.onBlur();
          },
        })}
      >
        <TextField
          id="message_name"
          label={t("popup.creation.form.name.label")}
          required={true}
          fullWidth={true}
        />
      </FormField>
      <div className="flex flex-row gap-xs items-end">
        <div className="flex-1">
          <FormField<PopupFormData, "link">
            name="link"
            mapProps={({ defaultProps, form, field }) => ({
              ...defaultProps,
              onClear: () => {
                form.setValue("link", "", { shouldDirty: true });
                // We trigger validation after clearing the value
                field.onBlur();
              },
            })}
          >
            <TextField
              id="message_link"
              label={t("popup.creation.form.link.label")}
              required={true}
              fullWidth={true}
            />
          </FormField>
        </div>
        <Button
          color="main"
          intent="default"
          label={t("popup.creation.form.link.buttonLabel")}
          size="md"
          disabled={!isLinkValid}
          onClick={onLinkButtonClick}
        />
      </div>
      <div className="w-full flex flex-col items-center gap-xs">
        {imagePreview && (
          <Media
            src={imagePreview}
            size="xl"
            alt={t("popup.creation.form.image.previewAlt")}
          />
        )}
        <FormMediaField<PopupFormData, "image">
          autoUpload
          id={`${fieldIdPrefix}-image-upload`}
          className="w-full"
          fieldName="image"
          inputName="edit-class-image-uploader"
          fileExtensionList={["png", "jpg", "jpeg", "svg"]}
          customTexts={{
            uploadFileCTA: t("popup.creation.form.image.uploadLabel"),
            dragAndDropFileCTA: t("popup.creation.form.image.dragAndDropLabel"),
            fileExtensionList: t("popup.creation.form.image.fileTypes"),
          }}
          status={imageError ? "error" : "default"}
          statusText={imageError?.message}
        />
      </div>
    </ControlledForm>
  );
};
