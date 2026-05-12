export type UploadSourceType = "youtube" | "vimeo" | "ebook";

export type UploadVideoFormData = {
  sourceType: UploadSourceType | null;
  url: string;
  hours: number | null;
  minutes: number | null;
  file: File | null;
};
