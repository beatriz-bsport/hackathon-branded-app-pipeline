export const ALLOWED_EBOOK_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
] as const;

export type AllowedEbookMimeType = (typeof ALLOWED_EBOOK_FILE_TYPES)[number];

/** Extensions for `FileUpload.fileExtensionList` (matches ALLOWED_EBOOK_FILE_TYPES). */
export const ALLOWED_EBOOK_FILE_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
] as const;
