import {
  type UploadInstruction,
  VideoProvider,
} from "@bsport/api-buyables/video";

import {
  ALLOWED_EBOOK_FILE_TYPES,
  type AllowedEbookMimeType,
} from "./constants";
import type { UploadSourceType, UploadVideoFormData } from "./types";

/** `File.type` is typed as string; narrow against allowed ebook MIME types. */
export function isAllowedEbookMimeType(
  mime: string,
): mime is AllowedEbookMimeType {
  return (ALLOWED_EBOOK_FILE_TYPES as readonly string[]).includes(mime);
}

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

export function extractYoutubeId(url: string): string | null {
  try {
    const { hostname, pathname, searchParams } = new URL(url);
    const host = hostname.toLowerCase();

    if (!YOUTUBE_HOSTS.has(host)) {
      return null;
    }

    if (host === "youtu.be" || host === "www.youtu.be") {
      return pathname.split("/").filter(Boolean)[0] ?? null;
    }

    return searchParams.get("v");
  } catch {
    return null;
  }
}

export function extractVimeoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();

    if (!VIMEO_HOSTS.has(host)) {
      return null;
    }

    const id =
      parsedUrl.pathname
        .split("/")
        .filter(Boolean)
        .findLast((part) => /^\d+$/.test(part)) ?? null;

    if (!id) {
      return null;
    }

    const hash = parsedUrl.searchParams.get("h");

    return hash ? `${id}?h=${hash}` : id;
  } catch {
    return null;
  }
}

export function getVideoProviderIdentifier(
  sourceType: UploadSourceType,
): VideoProvider {
  switch (sourceType) {
    case "youtube":
      return VideoProvider.YOUTUBE_URL_PROVIDER;
    case "vimeo":
      return VideoProvider.VIMEO_URL_PROVIDER;
    case "ebook":
      return VideoProvider.EBOOK_PROVIDER;
  }
}

export function getDurationInSeconds({
  hours,
  minutes,
}: Pick<UploadVideoFormData, "hours" | "minutes">): number {
  return (hours ?? 0) * 3600 + (minutes ?? 0) * 60;
}

export function getFileExtension(file: File): string | undefined {
  const parts = file.name.split(".");

  if (parts.length < 2) {
    return undefined;
  }

  const extension = parts.pop()?.trim().toLowerCase();

  return extension || undefined;
}

export function isValidYoutubeUrl(url: string): boolean {
  return Boolean(extractYoutubeId(url));
}

export function isValidVimeoUrl(url: string): boolean {
  return Boolean(extractVimeoId(url));
}

export function buildUploadBody({
  body_type,
  fields,
  file,
}: Pick<UploadInstruction, "body_type" | "fields"> & {
  file: File;
}): XMLHttpRequestBodyInit {
  if (body_type === "formData" || body_type === "form_data") {
    const formData = new FormData();

    Object.entries(fields ?? {}).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    return formData;
  }

  return file;
}
