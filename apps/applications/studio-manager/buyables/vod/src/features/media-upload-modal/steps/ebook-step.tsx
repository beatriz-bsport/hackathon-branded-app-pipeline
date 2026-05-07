import { type FC, useState } from "react";

import {
  Body,
  FILE_UPLOAD_STATUSES,
  FileUpload,
  type FileUploadProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { ALLOWED_EBOOK_FILE_EXTENSIONS } from "../constants";

type FileExtensionListEntry = NonNullable<
  FileUploadProps["fileExtensionList"]
>[number];

type EbookStepProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  fileError?: string;
};

export const EbookStep: FC<EbookStepProps> = ({
  file,
  onFileChange,
  fileError,
}) => {
  const { t } = useTranslation("media-list");
  const [resetKey, setResetKey] = useState(0);

  const handleClear = () => {
    onFileChange(null);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="flex w-full flex-col gap-sm">
      <FileUpload
        key={resetKey}
        id="upload-video-ebook-file"
        className="w-full"
        handleUploadFile={async (uploadedFile) => {
          onFileChange(uploadedFile);
          return { status: FILE_UPLOAD_STATUSES.success };
        }}
        onRemoveFile={handleClear}
        inline={Boolean(file)}
        fileExtensionList={
          ALLOWED_EBOOK_FILE_EXTENSIONS as unknown as FileExtensionListEntry[]
        }
        multiple={false}
        autoUpload
        customTexts={{
          uploadFileCTA: t("uploadModal.fields.file.uploadCta"),
          dragAndDropFileCTA: t("uploadModal.fields.file.dragAndDropCta"),
          fileExtensionList: t("uploadModal.fields.file.extensions"),
        }}
      />

      {fileError && (
        <Body htmlVariant="p" size="sm" color="critical">
          {fileError}
        </Body>
      )}
    </div>
  );
};
