import { type FC, useMemo, useState } from "react";

import { type Video, VideoProvider } from "@bsport/api-buyables/video";
import {
  Card,
  Icon,
  List,
  type ListItemProps,
  Loader,
  Modal,
  TextField,
  Tooltip,
  cx,
} from "@bsport/kaizen-primitive-core";

import { formatVideoDuration } from "#src/utils/format-video-duration";
import { useTranslation } from "#src/utils/i18n";

import { useAddVideoToCollection } from "./use-add-video-to-collection";
import { useSearchVideosQuery } from "./use-search-videos-query";

type CollectionAddMediaModalProps = {
  collectionId: number;
  existingVideoIds: number[];
  isOpen: boolean;
  closeModal: () => void;
  onVideoAdded?: (videoId: number) => void;
};

const getMediaListItem = (
  media: Video,
  onClick: () => void,
  isSelected: boolean,
  isDisabled: boolean,
): ListItemProps => {
  const trimmedCover = media.cover_main?.trim();
  const hasCover = Boolean(trimmedCover);
  const isEbook = media.provider_identifier === VideoProvider.EBOOK_PROVIDER;
  const durationLabel = isEbook
    ? undefined
    : formatVideoDuration(media.duration_second);

  const mediaIcon = (
    <Icon
      icon={isEbook ? "book-closed" : "video-recorder"}
      size="sm"
      className="text-onsurface-weak"
    />
  );

  return {
    id: `add-media-video-${media.id}`,
    title: media.name,
    description: durationLabel,
    isActive: isSelected,
    disabled: isDisabled,
    onItemClick: onClick,
    avatar: {
      shape: "squared",
      size: "md",
      src: hasCover ? trimmedCover : undefined,
      alt: media.name,
      iconName: hasCover ? undefined : "image-03",
      className: cx(
        "shrink-0",
        hasCover
          ? "border-none opacity-80"
          : "border-none bg-surface-default-weaker text-onsurface-weaker",
      ),
    },
    customNode: durationLabel ? (
      <Tooltip label={durationLabel} placement="bottom">
        <span className="inline-flex">{mediaIcon}</span>
      </Tooltip>
    ) : (
      mediaIcon
    ),
  };
};

export const CollectionAddMediaModal: FC<CollectionAddMediaModalProps> = ({
  collectionId,
  existingVideoIds,
  isOpen,
  closeModal,
  onVideoAdded,
}) => {
  const { t } = useTranslation("collection-details");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const handleCloseModal = () => {
    closeModal();
    setSearchTerm("");
    setSelectedVideoId(null);
  };

  const { addVideoToCollection, isLoading: isAddingVideo } =
    useAddVideoToCollection({
      onSuccess: (videoId) => {
        onVideoAdded?.(videoId);
        handleCloseModal();
      },
    });
  const {
    hasSearchTerm,
    videos,
    isLoading: isLoadingVideos,
  } = useSearchVideosQuery({
    existingVideoIds,
    isEnabled: isOpen,
    searchTerm,
  });

  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedVideoId) ?? null,
    [selectedVideoId, videos],
  );

  const handleAddVideo = () => {
    if (!selectedVideo) {
      return;
    }

    addVideoToCollection({ id: collectionId, video: selectedVideo.id });
  };

  const items = useMemo(
    () =>
      videos.map((video) =>
        getMediaListItem(
          video,
          () => setSelectedVideoId(video.id),
          selectedVideoId === video.id,
          isAddingVideo,
        ),
      ),
    [isAddingVideo, selectedVideoId, videos],
  );

  return (
    <Modal
      open={isOpen}
      title={t("addMediaModal.title")}
      size="sm"
      cancelButton={{
        label: t("addMediaModal.cancel"),
        onClick: handleCloseModal,
        disabled: isAddingVideo,
      }}
      confirmButton={{
        label: t("addMediaModal.add"),
        onClick: handleAddVideo,
        disabled: !selectedVideo || isAddingVideo,
      }}
      onCloseButtonClick={handleCloseModal}
      onClickOutside={handleCloseModal}
    >
      <div
        className={cx(
          "flex min-h-0 flex-col gap-md",
          hasSearchTerm ? "h-[280px]" : undefined,
        )}
      >
        <TextField
          id="collection-add-media-search"
          type="search"
          fullWidth
          value={searchTerm}
          placeholder={t("addMediaModal.searchPlaceholder")}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
          onClear={() => {
            setSearchTerm("");
            setSelectedVideoId(null);
          }}
        />
        {hasSearchTerm ? (
          <Card padding="none" className="min-h-0 flex-1 overflow-y-auto">
            {isLoadingVideos ? (
              <div className="grid h-full min-h-[200px] place-content-center">
                <Loader size="xl" />
              </div>
            ) : (
              <List
                id="collection-add-media-results"
                items={items}
                emptyStateProps={{
                  isEmpty: items.length === 0,
                  emptyConfig: {
                    title: t("addMediaModal.emptySearch"),
                    className: "px-md",
                  },
                }}
              />
            )}
          </Card>
        ) : null}
      </div>
    </Modal>
  );
};
