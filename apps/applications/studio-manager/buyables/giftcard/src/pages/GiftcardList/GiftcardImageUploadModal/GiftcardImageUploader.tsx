import classNames from "classnames";
import React from "react";

import {
  FILE_UPLOAD_STATUSES,
  FileUpload,
} from "@bsport/kaizen-primitive-core";
import { uploadGiftcardImageAction } from "@bsport/store-buyables-giftcard";

import { xhr } from "#src/utils/fetch";

type GiftcardImageUploaderProps = {
  refreshGiftcardImageList: () => void;
  isEmpty?: boolean;
};

export const GiftcardImageUploader: React.FC<GiftcardImageUploaderProps> = ({
  isEmpty,
  refreshGiftcardImageList,
}) => {
  const handleUploadFile = async (
    file: File,
    signal: AbortSignal,
    onUploadProgress: (progress: ProgressEvent) => void,
  ) => {
    const response = await uploadGiftcardImageAction(xhr, {
      file,
      signal,
      onUploadProgress,
    });

    return response.fold(
      () => {
        // If upload succeded, refresh the list
        refreshGiftcardImageList();
        // Return a status "success" to update state of the progress bar
        return { status: FILE_UPLOAD_STATUSES.success };
      },
      () => {
        // Return a status "error" to update state of the progress bar
        return { status: FILE_UPLOAD_STATUSES.error };
      },
    );
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
