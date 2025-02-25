import type { ProgressBarStatuses } from "../ProgressBar";
import {
  UPLOAD_STATUSES,
  MIME_TYPE_MAP,
  type FileUploadTracker,
  type FileUploadStatus,
  type FileType,
  type MimeCategory,
} from "./constants";

// ----- File Upload utils -----

/**
 * Return the extension of the filename in lowercase.
 * @param fileName `name` of a File.
 */
const getFileExtension = (fileName: string) => {
  const fileNameParts = fileName.split(".");
  return fileNameParts.length > 1
    ? (fileNameParts.pop() || "").toLowerCase()
    : "";
};

/**
 * Check whether a file extension is included in a list of accepted extensions through MIME type,
 * like `image/*`, `audio/*` or `video/*`.
 * @param acceptedExtensions List of accepted extensions, which may containg MIME type.
 * @param fileExtension Extension of the file.
 */
const isFileExtensionInAcceptedMimeTypes = ({
  acceptedExtensions,
  fileExtension,
}: {
  acceptedExtensions: string[];
  fileExtension: string;
}) => {
  return Object.keys(MIME_TYPE_MAP).some(
    (mimeType) =>
      acceptedExtensions.includes(mimeType) &&
      MIME_TYPE_MAP[mimeType as MimeCategory].includes(
        fileExtension as FileType,
      ),
  );
};

/**
 * Return a list of Files matching the accepted extensions.
 * @param acceptedExtensions List of accepted extensions for the files to upload.
 * @param fileList FileList to filter.
 */
export const filterFileListWithRightExtensions = ({
  acceptedExtensions,
  fileList,
}: {
  acceptedExtensions: FileType[];
  fileList: FileList;
}) => {
  if (!fileList.length) return [];

  const acceptedExtensionsInLowercase = acceptedExtensions.map((extension) =>
    extension.toLowerCase(),
  );
  return Array.from(fileList).filter((file) => {
    const fileExtension = getFileExtension(file.name);
    const isMimeTypeAccepting = isFileExtensionInAcceptedMimeTypes({
      acceptedExtensions: acceptedExtensionsInLowercase,
      fileExtension: fileExtension,
    });
    return (
      acceptedExtensionsInLowercase.includes(fileExtension) ||
      isMimeTypeAccepting ||
      acceptedExtensionsInLowercase.length === 0 // No extension is equivalent to wildcard
    );
  });
};

/**
 * Return a concatenated FileUploadTracker list based on previous list and a new FileList.
 * @param currentList FileUploadTracker list used as base.
 * @param newFileList FileList aimed to be added to the FileUploadTracker list.
 * @param acceptedExtensions List of accepted extensions for the files to upload.
 */
export const getNewFileUploadTrackerItems = ({
  currentList,
  newFileList,
  acceptedExtensions,
}: {
  currentList: FileUploadTracker[];
  newFileList: FileList;
  acceptedExtensions: FileType[];
}) => {
  // Filter out files with wrong extension
  const newFileListWithRightExtensions = filterFileListWithRightExtensions({
    acceptedExtensions,
    fileList: newFileList,
  });

  const currentFileNameList = currentList.map((item) => item.file.name);
  const newItems: FileUploadTracker[] = newFileListWithRightExtensions
    .filter((file) => !currentFileNameList?.includes(file.name)) // Filter our dupplicate
    .map((file) => {
      // Create a fileUploadTracker for each file in a default state
      const controller = new AbortController();
      return {
        file,
        progressValue: 0,
        status: UPLOAD_STATUSES.default as FileUploadStatus,
        controller: controller,
      };
    });
  return newItems;
};

// ----- File Upload Input Utils -----

/**
 * Return a string that contains formatted extensions and that should be provided to `accept` prop
 * @param fileExtensionList List of accepted extensions to be formatted
 */
export const getFormattedExtensionForInput = (
  fileExtensionList?: FileType[],
) => {
  // Append a  `.` to non-MIME type extension
  const formattedExtensionList = (fileExtensionList ?? []).map((extension) =>
    Object.keys(MIME_TYPE_MAP).includes(extension)
      ? extension
      : `.${extension}`,
  );
  // Join extension for the `accept` prop : ".jpg, .png, video/*" is a valid prop for instance
  return formattedExtensionList.join(", ");
};

// ----- File Upload Loading Utils -----

/**
 * Return the ProgressBar display configuration given the status and the progress.
 * @param status Upload status progress of a file.
 * @param uploadProgressValue Percentage of the request progress.
 */
export function getProgressInformation({
  status,
  uploadProgressValue,
  customMessage,
}: {
  status: FileUploadStatus;
  uploadProgressValue?: number;
  customMessage?: string;
}): {
  progressBarStatus: ProgressBarStatuses;
  progressBarValue: number;
  progressMessage: string;
} {
  if (status === UPLOAD_STATUSES.success) {
    // ##### TODO : internationalization
    return {
      progressBarStatus: "positive",
      progressBarValue: 100,
      progressMessage: customMessage || "Uploaded successfully.",
    };
  }

  if (status === UPLOAD_STATUSES.error) {
    // ##### TODO : internationalization
    return {
      progressBarStatus: "critical",
      progressBarValue: 100,
      progressMessage: customMessage || "Could not upload this file.",
    };
  }

  return {
    progressBarStatus: "main",
    progressBarValue: uploadProgressValue ?? 0,
    progressMessage: customMessage || "",
  };
}
