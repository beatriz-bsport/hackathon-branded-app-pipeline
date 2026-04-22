import { type ReactElement, useEffect, useState } from "react";

import { type FieldValues, FormField, useFormContext } from "@bsport/form";
import {
  Body,
  FILE_UPLOAD_STATUSES,
  FileUpload,
  type FileUploadProps,
  Media,
  cx,
} from "@bsport/kaizen-primitive-core";

import type { MediaFieldPath } from "#src/utils/form-types";

type FormMediaFieldProps<
  TFormValues extends FieldValues,
  TFieldName extends MediaFieldPath<TFormValues> = MediaFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
  alt?: string;
  helperText?: string;
} & Pick<
  FileUploadProps,
  | "className"
  | "customTexts"
  | "fileExtensionList"
  | "autoUpload"
  | "inputName"
  | "onFileDrop"
  | "onInputChange"
  | "uploadCallback"
  | "disabled"
>;

function createObjectUrl(value: File | Blob | null | undefined): string | null {
  if (!value || typeof value === "string") return null;
  try {
    return (window.URL || window.webkitURL).createObjectURL(value);
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(err);
      return null;
    }
    throw err;
  }
}

export const FormMediaField = <
  TFormValues extends FieldValues,
  TFieldName extends MediaFieldPath<TFormValues> = MediaFieldPath<TFormValues>,
>({
  id,
  fieldName,
  alt,
  helperText,
  fileExtensionList = ["image/*"],
  autoUpload = true,
  ...forwardedProps
}: FormMediaFieldProps<TFormValues, TFieldName>): ReactElement => {
  const form = useFormContext<TFormValues>();
  const value = form.watch(fieldName) as File | string | null | undefined;
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
      return;
    }

    const url = createObjectUrl(value);
    setPreview(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [value]);

  return (
    <div className="w-full flex flex-col items-center gap-xs">
      {preview && (
        <Media src={preview} size="xl" alt={alt ?? String(fieldName)} />
      )}

      <FormField<TFormValues, TFieldName, FileUploadProps>
        name={fieldName}
        mapProps={({ field, form: fieldForm }) => ({
          handleUploadFile: async (file) => {
            if (!file) return { status: FILE_UPLOAD_STATUSES.error };
            fieldForm.setValue(fieldName, file as never, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
            return { status: FILE_UPLOAD_STATUSES.success };
          },
          inline: !!field.value,
          className: cx("w-full items-center flex-col", {
            flex: !!field.value,
          }),
        })}
      >
        {/** @ts-expect-error Pass props implicitly - FormField forwards handleUploadFile + inline */}
        <FileUpload
          id={id}
          fileExtensionList={fileExtensionList}
          multiple={false}
          autoUpload={autoUpload}
          onRemoveFile={() =>
            form.setValue(fieldName, null as never, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
          {...forwardedProps}
        />
      </FormField>

      {!preview && helperText && (
        <Body color="weak" size="sm">
          {helperText}
        </Body>
      )}
    </div>
  );
};

FormMediaField.displayName = "KaizenFormMediaField";
