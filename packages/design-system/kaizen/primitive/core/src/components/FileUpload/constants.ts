// ----- Status to track the upload process -----

export type FileUploadStatus = "default" | "loading" | "success" | "error";

export const UPLOAD_STATUSES: Record<string, FileUploadStatus> = {
  default: "default",
  loading: "loading",
  success: "success",
  error: "error",
};

// ----- Files extensions and MIME types accepted by the file input -----

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
  "tiff",
  "ico",
] as const;

const AUDIO_EXTENSIONS = [
  "mp3",
  "wav",
  "ogg",
  "m4a",
  "aac",
  "flac",
  "wma",
] as const;

const VIDEO_EXTENSIONS = [
  "mp4",
  "mov",
  "avi",
  "mkv",
  "webm",
  "wmv",
  "flv",
] as const;

const MIME_CATEGORIES = ["image/*", "audio/*", "video/*"] as const;

export const FILE_TYPES = [
  ...IMAGE_EXTENSIONS,
  ...AUDIO_EXTENSIONS,
  ...VIDEO_EXTENSIONS,
  ...MIME_CATEGORIES,
] as const;

export type FileType = (typeof FILE_TYPES)[number];

export type MimeCategory = (typeof MIME_CATEGORIES)[number];

export const MIME_TYPE_MAP: Record<MimeCategory, readonly FileType[]> = {
  "image/*": IMAGE_EXTENSIONS,
  "audio/*": AUDIO_EXTENSIONS,
  "video/*": VIDEO_EXTENSIONS,
};

// ----- State of a file during the upload process -----

export type FileUploadTracker = {
  file: File;
  status: FileUploadStatus;
  progressValue: number;
  controller: AbortController;
};
