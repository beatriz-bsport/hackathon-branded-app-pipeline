import React from "react";
import {
  FileUpload,
  FILE_UPLOAD_STATUSES,
} from "@bsport/kaizen-primitive-core";
import { uploadGiftcardImage } from "#src/features/api";
import classNames from "classnames";

type GiftcardImageUploaderProps = {
  fetchGiftcardImageList: () => void;
  isEmpty?: boolean;
};

export const GiftcardImageUploader: React.FC<GiftcardImageUploaderProps> = ({
  isEmpty,
  fetchGiftcardImageList,
}) => {
  const handleUploadFile = async (
    file: File,
    signal: AbortSignal,
    onUploadProgress: (progress: ProgressEvent) => void,
  ) => {
    const response = await uploadGiftcardImage({
      file,
      signal,
      onUploadProgress,
    });
    if (response.status === "success") {
      // If upload succeded, refresh the list
      await fetchGiftcardImageList();
      return { status: FILE_UPLOAD_STATUSES.success };
    }
    if (response.status === "abort") {
      return { status: FILE_UPLOAD_STATUSES.error };
    }
    // TODO : return custom message based on response.error_code
    return { status: FILE_UPLOAD_STATUSES.error };
  };

  return (
    <FileUpload
      autoUpload
      inputId={`giftcard-image-uploader-${isEmpty ? "empty-list" : "list"}`}
      inline
      fileExtensionList={["jpeg", "jpg", "png"]}
      handleUploadFile={handleUploadFile}
      className={classNames({ "w-full flex flex-row justify-center": isEmpty })}
    />
  );
};
