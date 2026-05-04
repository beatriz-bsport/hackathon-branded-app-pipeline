import { type FC, useState } from "react";
import { useNavigate } from "react-router";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { VideoTable } from "#src/components/video-table/video-table";
import { MediaDeleteModal } from "#src/features/media-delete-modal/media-delete-modal";
import { useDeleteVideo } from "#src/features/media-delete-modal/use-delete-video";
import { useCategoriesByIdQuery } from "#src/hooks/api/use-categories-by-id-query";
import { useDuplicateVideo } from "#src/hooks/api/use-duplicate-video";
import { useVideosQuery } from "#src/hooks/api/use-videos-query";
import { useBuildPageTabs } from "#src/hooks/layout/use-build-page-tabs";
import {
  type MediaActiveFilters,
  useMediaFilters,
} from "#src/hooks/use-media-filters";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type MediaListPageContentProps = {
  activeFilters: MediaActiveFilters;
  isFiltered: boolean;
  onClearFilters: () => void;
};

const MediaListPageContent: FC<MediaListPageContentProps> = ({
  activeFilters,
  isFiltered,
  onClearFilters,
}) => {
  const { t } = useTranslation("media-list");
  const navigate = useNavigate();
  const { videos, isEmpty, paginationProps } = useVideosQuery(activeFilters);
  const { duplicateVideo } = useDuplicateVideo();
  const categoriesQuery = useCategoriesByIdQuery();
  const categoriesById = categoriesQuery.data ?? new Map<number, string>();
  const [deletedVideo, setDeletedVideo] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const isEmptySearch = isEmpty && isFiltered;
  const { deleteVideo } = useDeleteVideo({
    onSuccess: () => setDeletedVideo(null),
  });

  return (
    <>
      <VideoTable
        videos={videos}
        categoriesById={categoriesById}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        emptySearchConfig={{
          title: t("filters.emptySearch.title"),
          subtitle: t("filters.emptySearch.subtitle"),
          ctaButtonConfig: {
            label: t("filters.emptySearch.cta"),
            onClick: onClearFilters,
            iconLeft: "x",
          },
        }}
        onRowClick={(id) => navigate(URLS.MEDIA_DETAILS(id))}
        onDuplicate={(video) => duplicateVideo(video.id)}
        onDelete={(video) =>
          setDeletedVideo({ id: video.id, name: video.name })
        }
      />
      {deletedVideo !== null ? (
        <MediaDeleteModal
          videoName={deletedVideo.name}
          closeModal={() => setDeletedVideo(null)}
          onConfirm={() => deleteVideo({ id: deletedVideo.id })}
        />
      ) : null}
    </>
  );
};

const MediaListPage: FC = () => {
  const { t } = useTranslation(["shared-list", "media-list"]);
  const pageTabs = useBuildPageTabs();

  const {
    activeFilters,
    filterConfig,
    filterRef,
    searchQuery,
    onSearchChange,
    onSearchClear,
    isFiltered,
    resetFilters,
  } = useMediaFilters();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pageTitle", { ns: "shared-list" })}
        pageTabs={pageTabs}
        searchConfig={{
          id: "media-list-search",
          inputValue: searchQuery,
          debounceValue: 500,
          onInputValueChange: onSearchChange,
          onClear: onSearchClear,
          tooltipConfig: {
            label: t("search.tooltip", { ns: "media-list" }),
          },
        }}
        filterConfig={filterConfig}
        filterRef={filterRef}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <MediaListPageContent
            activeFilters={activeFilters}
            isFiltered={isFiltered}
            onClearFilters={resetFilters}
          />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MediaListPage;
