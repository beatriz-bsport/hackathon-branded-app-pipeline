import { type FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import type { Collection } from "@bsport/api-buyables/collection";
import type { Video } from "@bsport/api-buyables/video";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";

import { CollectionVideoList } from "#src/components/collection-details/collection-video-list";
import { CollectionVideoPreview } from "#src/components/collection-details/collection-video-preview";
import { CollectionAddMediaModal } from "#src/features/collection-add-media-modal/collection-add-media-modal";
import { CollectionDeleteModal } from "#src/features/collection-delete-modal/collection-delete-modal";
import { useDeleteCollection } from "#src/features/collection-delete-modal/use-delete-collection";
import { CollectionRemoveMediaModal } from "#src/features/collection-remove-media-modal/collection-remove-media-modal";
import { useCategoriesByIdQuery } from "#src/hooks/api/use-categories-by-id-query";
import { useLevelsByIdQuery } from "#src/hooks/api/use-levels-by-id-query";
import {
  type TeacherPreview,
  useTeachersByAssociatedCoachIdQuery,
} from "#src/hooks/api/use-teachers-by-associated-coach-id-query";
import { useCollectionDetailsHeader } from "#src/hooks/layout/use-collection-details-header";
import { useDisclosure } from "#src/hooks/use-disclosure";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type CollectionDetailsPageProps = {
  collection: Collection;
  videos: Video[];
};

const CollectionDetailsPage: FC<CollectionDetailsPageProps> = ({
  collection,
  videos,
}) => {
  const navigate = useNavigate();
  const { detailsLayoutProps } = useDetailsLayout();
  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();
  const headerConfig = useCollectionDetailsHeader({
    onDeleteClick: onOpenDeleteModal,
  });
  const { t } = useTranslation("collection-details");
  const {
    isOpen: isAddMediaModalOpen,
    onOpen: openAddMediaModal,
    onClose: closeAddMediaModal,
  } = useDisclosure();
  const {
    isOpen: isRemoveMediaModalOpen,
    onOpen: openRemoveMediaModal,
    onClose: closeRemoveMediaModal,
  } = useDisclosure();
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [pendingSelectedVideoId, setPendingSelectedVideoId] = useState<
    number | null
  >(null);
  const [videoToRemove, setVideoToRemove] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const associatedCoachIds = useMemo(
    () => Array.from(new Set(videos.flatMap((video) => video.coaches))),
    [videos],
  );
  const existingVideoIds = useMemo(
    () => videos.map((video) => video.id),
    [videos],
  );
  const categoriesQuery = useCategoriesByIdQuery();
  const levelsQuery = useLevelsByIdQuery();
  const teachersQuery = useTeachersByAssociatedCoachIdQuery(associatedCoachIds);
  const categoriesById = categoriesQuery.data ?? new Map<number, string>();
  const levelsById = levelsQuery.data ?? new Map<number, string>();
  const teachersByAssociatedCoachId =
    teachersQuery.data ?? new Map<number, TeacherPreview>();

  useEffect(() => {
    if (videos.length === 0) {
      setSelectedVideoId(null);
      return;
    }

    setSelectedVideoId((currentVideoId) => {
      if (
        currentVideoId !== null &&
        videos.some((video) => video.id === currentVideoId)
      ) {
        return currentVideoId;
      }

      return videos[0]?.id ?? null;
    });
  }, [videos]);

  useEffect(() => {
    if (
      pendingSelectedVideoId === null ||
      !videos.some((video) => video.id === pendingSelectedVideoId)
    ) {
      return;
    }

    setSelectedVideoId(pendingSelectedVideoId);
    setPendingSelectedVideoId(null);
  }, [pendingSelectedVideoId, videos]);

  const selectedVideo = useMemo(() => {
    return videos.find((video) => video.id === selectedVideoId) ?? null;
  }, [videos, selectedVideoId]);

  const handleRemoveVideo = (videoId: number) => {
    const video = videos.find((currentVideo) => currentVideo.id === videoId);

    if (!video) {
      return;
    }

    setVideoToRemove({ id: video.id, name: video.name });
    openRemoveMediaModal();
  };

  const { deleteCollection } = useDeleteCollection({
    onSuccess: () => {
      onCloseDeleteModal();
      navigate(URLS.INDEX);
    },
  });

  const handleCloseRemoveMediaModal = () => {
    closeRemoveMediaModal();
    setVideoToRemove(null);
  };

  return (
    <>
      <DetailsLayout {...detailsLayoutProps} withPanel>
        <DetailsLayout.Header pageTitle={collection.name} {...headerConfig} />
        <DetailsLayout.Content className="flex flex-col gap-lg max-w-none">
          <CollectionVideoPreview
            categoriesById={categoriesById}
            emptyThumbnailLabel={t("emptyThumbnailLabel")}
            levelsById={levelsById}
            teachersByAssociatedCoachId={teachersByAssociatedCoachId}
            video={selectedVideo}
          />
        </DetailsLayout.Content>
        <DetailsLayout.Panel className="flex flex-col gap-sm">
          <CollectionVideoList
            collectionDescription={collection.description}
            videos={videos}
            onAddVideo={openAddMediaModal}
            onRemoveVideo={handleRemoveVideo}
            onSelectVideo={setSelectedVideoId}
            selectedVideoId={selectedVideoId}
          />
        </DetailsLayout.Panel>
      </DetailsLayout>

      <CollectionDeleteModal
        isOpen={isDeleteModalOpen}
        closeModal={onCloseDeleteModal}
        onConfirm={() => deleteCollection({ id: collection.id })}
      />

      <CollectionAddMediaModal
        collectionId={collection.id}
        existingVideoIds={existingVideoIds}
        isOpen={isAddMediaModalOpen}
        closeModal={closeAddMediaModal}
        onVideoAdded={setPendingSelectedVideoId}
      />

      {videoToRemove ? (
        <CollectionRemoveMediaModal
          collectionId={collection.id}
          videoId={videoToRemove.id}
          videoName={videoToRemove.name}
          isOpen={isRemoveMediaModalOpen}
          closeModal={handleCloseRemoveMediaModal}
        />
      ) : null}
    </>
  );
};

export default CollectionDetailsPage;
