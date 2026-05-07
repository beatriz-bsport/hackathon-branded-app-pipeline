import { type FC, useState } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { EbookStep } from "./steps/ebook-step";
import { SourceSelectionStep } from "./steps/source-selection-step";
import { YoutubeVimeoStep } from "./steps/youtube-vimeo-step";
import type { UploadSourceType, UploadVideoFormData } from "./types";
import { useUploadMedia } from "./use-upload-media";
import {
  getDurationInSeconds,
  isAllowedEbookMimeType,
  isValidVimeoUrl,
  isValidYoutubeUrl,
} from "./utils";

type MediaUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoId: number | null;
};

type FormErrors = {
  source?: string;
  url?: string;
  duration?: string;
  file?: string;
};

const DEFAULT_ERRORS: FormErrors = {};

export const MediaUploadModal: FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  const { t } = useTranslation("media-list");

  const [sourceType, setSourceType] = useState<UploadSourceType | null>(null);
  const [url, setUrl] = useState("");
  const [hours, setHours] = useState<number | null>(0);
  const [minutes, setMinutes] = useState<number | null>(0);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>(DEFAULT_ERRORS);
  const [isDetailsStep, setIsDetailsStep] = useState(false);

  const { uploadMedia, isLoading } = useUploadMedia({
    onSuccess: () => {
      closeModal();
    },
  });

  const closeModal = () => {
    setSourceType(null);
    setUrl("");
    setHours(0);
    setMinutes(0);
    setFile(null);
    setErrors(DEFAULT_ERRORS);
    setIsDetailsStep(false);
    onClose();
  };

  const isDirty =
    sourceType !== null ||
    url !== "" ||
    hours !== 0 ||
    minutes !== 0 ||
    file !== null;

  const handleClickOutside = () => {
    if (isDirty || isLoading) return;
    closeModal();
  };

  const validateDetails = (): FormErrors => {
    if (!sourceType) return {};

    if (sourceType === "ebook") {
      if (!file) return { file: t("uploadModal.validation.fileRequired") };
      if (!isAllowedEbookMimeType(file.type))
        return { file: t("uploadModal.validation.fileTypeInvalid") };
      return {};
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) return { url: t("uploadModal.validation.urlRequired") };

    if (sourceType === "youtube" && !isValidYoutubeUrl(trimmedUrl))
      return { url: t("uploadModal.validation.youtubeUrlInvalid") };
    if (sourceType === "vimeo" && !isValidVimeoUrl(trimmedUrl))
      return { url: t("uploadModal.validation.vimeoUrlInvalid") };

    if (getDurationInSeconds({ hours, minutes }) <= 0)
      return { duration: t("uploadModal.validation.durationRequired") };

    return {};
  };

  const handleConfirm = () => {
    if (!isDetailsStep) {
      if (sourceType === null) {
        setErrors({ source: t("uploadModal.validation.sourceRequired") });
        return;
      }
      setIsDetailsStep(true);
      return;
    }

    if (!videoId) return;

    const detailsErrors = validateDetails();
    if (Object.keys(detailsErrors).length > 0) {
      setErrors(detailsErrors);
      return;
    }

    uploadMedia({
      videoId,
      data: {
        sourceType,
        url,
        hours,
        minutes,
        file,
      } satisfies UploadVideoFormData,
    });
  };

  const renderContent = () => {
    if (!isDetailsStep) {
      return (
        <SourceSelectionStep
          value={sourceType}
          onChange={(value) => {
            setSourceType(value);
            setErrors(DEFAULT_ERRORS);
            setUrl("");
            setHours(0);
            setMinutes(0);
            setFile(null);
          }}
          error={errors.source}
        />
      );
    }

    if (sourceType === "youtube" || sourceType === "vimeo") {
      return (
        <YoutubeVimeoStep
          sourceType={sourceType}
          url={url}
          onUrlChange={(value) => {
            setUrl(value);
            setErrors((prev) => ({ ...prev, url: undefined }));
          }}
          urlError={errors.url}
          hours={hours}
          onHoursChange={(value) => {
            setHours(value);
            setErrors((prev) => ({ ...prev, duration: undefined }));
          }}
          minutes={minutes}
          onMinutesChange={(value) => {
            setMinutes(value);
            setErrors((prev) => ({ ...prev, duration: undefined }));
          }}
          durationError={errors.duration}
        />
      );
    }

    return (
      <EbookStep
        file={file}
        onFileChange={(value) => {
          setFile(value);
          setErrors((prev) => ({ ...prev, file: undefined }));
        }}
        fileError={errors.file}
      />
    );
  };

  return (
    <Modal
      open={isOpen}
      size="sm"
      title={
        isDetailsStep && sourceType === "ebook"
          ? t("uploadModal.ebookTitle")
          : t("uploadModal.title")
      }
      onClose={closeModal}
      onClickOutside={handleClickOutside}
      confirmButton={{
        label: !isDetailsStep
          ? t("uploadModal.buttons.addMedia")
          : sourceType === "ebook"
            ? t("uploadModal.buttons.upload")
            : t("uploadModal.buttons.add"),
        onClick: handleConfirm,
        iconLeft: isLoading ? "loading" : undefined,
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("uploadModal.buttons.cancel"),
        onClick: isDetailsStep ? () => setIsDetailsStep(false) : closeModal,
        disabled: isLoading,
      }}
    >
      {renderContent()}
    </Modal>
  );
};
