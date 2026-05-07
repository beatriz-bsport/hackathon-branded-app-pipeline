import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  requestUploadInstructionAPI,
  setExternalUrlAPI,
  setProviderIdentifierAPI,
  videoKeys,
} from "@bsport/api-buyables/video";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { UploadVideoFormData } from "./types";
import {
  buildUploadBody,
  extractVimeoId,
  getDurationInSeconds,
  getFileExtension,
  getVideoProviderIdentifier,
} from "./utils";

const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000;

type UploadMediaParams = {
  videoId: number;
  data: UploadVideoFormData;
};

async function uploadFileToStorage({
  file,
  instruction,
}: {
  file: File;
  instruction: Awaited<ReturnType<typeof requestUploadInstructionAPI>>;
}) {
  const body = buildUploadBody({
    body_type: instruction.body_type,
    fields: instruction.fields,
    file,
  });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(instruction.method, instruction.url);
    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();

        return;
      }

      console.error(`Storage upload failed (${xhr.status}):`, xhr.responseText);
      reject(new Error("Unable to upload file to storage"));
    };
    xhr.onerror = () => {
      reject(new Error("Network error while uploading file to storage"));
    };
    xhr.ontimeout = () => {
      console.error(`Upload timed out after ${UPLOAD_TIMEOUT_MS}ms`);
      reject(new Error("Upload timed out"));
    };
    xhr.send(body);
  });
}

export const useUploadMedia = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("media-list");

  const { mutate: uploadMedia, isPending: isLoading } = useMutation({
    mutationFn: async ({ videoId, data }: UploadMediaParams) => {
      if (!data.sourceType) {
        throw new Error("Missing upload source type");
      }

      if (data.sourceType === "ebook") {
        if (!data.file) {
          throw new Error("Missing ebook file");
        }

        const fileExtension = getFileExtension(data.file);
        const instruction = await requestUploadInstructionAPI(fetch, {
          id: videoId,
          file_extension: fileExtension,
        });

        await uploadFileToStorage({
          file: data.file,
          instruction,
        });

        await setProviderIdentifierAPI(fetch, {
          id: videoId,
          provider_identifier: getVideoProviderIdentifier(data.sourceType),
        });

        return setExternalUrlAPI(fetch, {
          id: videoId,
          data: {
            file_extension: fileExtension,
          },
        });
      }

      const url =
        data.sourceType === "vimeo"
          ? extractVimeoId(data.url.trim())
          : data.url.trim();

      if (!url) {
        throw new Error("Missing upload url");
      }

      await setProviderIdentifierAPI(fetch, {
        id: videoId,
        provider_identifier: getVideoProviderIdentifier(data.sourceType),
      });

      return setExternalUrlAPI(fetch, {
        id: videoId,
        data: {
          url,
          duration_second: getDurationInSeconds(data),
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      toast({
        status: "positive",
        icon: "check-circle",
        title: t("uploadModal.submitResponse.success"),
        buttonIcon: "x-close",
      });
      onSuccess?.();
    },
    onError: async () => {
      await queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("uploadModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return {
    uploadMedia,
    isLoading,
  };
};
