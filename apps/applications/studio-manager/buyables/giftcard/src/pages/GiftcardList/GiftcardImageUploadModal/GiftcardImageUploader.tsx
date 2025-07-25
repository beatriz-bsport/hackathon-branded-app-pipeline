import classNames from "classnames";
import React from "react";

import {
  FILE_UPLOAD_STATUSES,
  FileUpload,
  type FileUploadStatus,
} from "@bsport/kaizen-primitive-core";
import { uploadGiftcardImageAction } from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type GiftcardImageUploaderProps = {
  refreshGiftcardImageList: () => void;
  isEmpty?: boolean;
};

export const GiftcardImageUploader: React.FC<GiftcardImageUploaderProps> = ({
  isEmpty,
  refreshGiftcardImageList,
}) => {
  const { t } = useTranslation("common");

  const uploadGiftcardImage = async (
    file: File,
    signal: AbortSignal,
    onUploadProgress: (progress: ProgressEvent) => void,
  ) => {
    return uploadGiftcardImageAction(xhr, {
      file,
      signal,
      onUploadProgress,
    });
  };

  const [{ isLoading }, handleUploadFile] = useAsync<
    typeof uploadGiftcardImage,
    { status: FileUploadStatus },
    { status: FileUploadStatus }
  >({
    asyncFn: uploadGiftcardImage,
    onSuccess: () => {
      // If upload succeded, refresh the list
      refreshGiftcardImageList();
      // Return a status "success" to update state of the progress bar
      return { status: FILE_UPLOAD_STATUSES.success };
    },
    onFailure: () => {
      // Return a status "error" to update state of the progress bar
      return { status: FILE_UPLOAD_STATUSES.error };
    },
    dependencies: [refreshGiftcardImageList],
  });

  return (
    <FileUpload
      customTexts={{
        uploadFileCTA: t("imageUploadModal.uploadButton"),
      }}
      autoUpload
      inputId={`giftcard-image-uploader-${isEmpty ? "empty-list" : "list"}`}
      inline
      disabled={isLoading}
      fileExtensionList={["jpeg", "jpg", "png"]}
      handleUploadFile={handleUploadFile}
      className={classNames({ "w-full flex flex-row justify-center": isEmpty })}
    />
  );
};
