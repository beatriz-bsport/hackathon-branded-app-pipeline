import { useEffect, useState } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import {
  Body,
  Button,
  FILE_UPLOAD_STATUSES,
  FileUpload,
  FileUploadProps,
  FileUploadTracker,
  Media,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { createFileUrl } from "#src/utils/files";
import { useTranslation } from "#src/utils/i18n";

import { PopupFormData } from "./shared-types";

type PopupFormProps = Omit<ControlledFormProps<PopupFormData>, "children">;

export const PopupForm: React.FC<PopupFormProps> = ({
  id,
  onSubmit,
  ...methods
}: PopupFormProps) => {
  const { t } = useTranslation("campaign");
  const { watch, getFieldState, formState } = methods;

  const linkValue = watch("link");
  const linkFieldState = getFieldState("link", formState);
  const isLinkValid = linkValue && !linkFieldState.error;

  const onLinkButtonClick = () => {
    window.open(linkValue, "_blank", "noopener,noreferrer");
  };

  const image = watch("image");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const url = createFileUrl(image);
    setImagePreview(url);

    return () => {
      if (url) {
        // Object URLs created with createObjectURL are never revoked by default
        URL.revokeObjectURL(url);
      }
    };
  }, [image]);

  const [fileUploadTrackerList, setFileUploadTrackerList] = useState<
    FileUploadTracker[]
  >([]);

  const animationDurationMs = 300;

  const uploadCallback = async () => {
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
        setFileUploadTrackerList([]);
      }, animationDurationMs * 2),
    );
  };

  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <div hidden>
        <TextField
          id="campaign_name"
          label={t("popup.creation.form.campaignName.label")}
          required={true}
          fullWidth={true}
        />
      </div>
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
        <FormField<PopupFormData, "image", FileUploadProps>
          name="image"
          mapProps={({ defaultProps, field, form }) => ({
            ...defaultProps,
            handleUploadFile: async (file) => {
              form.setValue("image", file, { shouldDirty: true });

              await new Promise((r) => setTimeout(r, animationDurationMs));

              // Finalize loading status
              return {
                status: file
                  ? FILE_UPLOAD_STATUSES.success
                  : FILE_UPLOAD_STATUSES.error,
              };
            },
            inline: !!field.value,
            className: "flex w-full items-center flex-col",
          })}
        >
          {/** @ts-expect-error Pass props implicitely - FormField is forwarding the `handleUploadFile` props */}
          <FileUpload
            id="message_image"
            uploadCallback={uploadCallback}
            fileExtensionList={["png", "jpg", "jpeg", "svg"]}
            multiple={false}
            autoUpload
            customTexts={{
              uploadFileCTA: t("popup.creation.form.image.uploadLabel"),
              dragAndDropFileCTA: t(
                "popup.creation.form.image.dragAndDropLabel",
              ),
              fileExtensionList: t("popup.creation.form.image.fileTypes"),
            }}
            fileUploadTrackerList={fileUploadTrackerList}
            setFileUploadTrackerList={setFileUploadTrackerList}
            className="w-full"
          />
        </FormField>
        {!imagePreview && (
          <Body htmlVariant="p" weight="weaker" color="weak" size="sm">
            {t("popup.creation.form.image.uploadInstructions")}
          </Body>
        )}
      </div>
    </ControlledForm>
  );
};
