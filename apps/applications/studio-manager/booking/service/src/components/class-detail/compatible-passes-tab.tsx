import { type FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { type PassCategory } from "@bsport/api-buyables";
import { List, useEmptyState } from "@bsport/kaizen-primitive-core";

import { CompatiblePassDetailDrawer } from "#src/components/class-detail/compatible-pass-detail-drawer";
import { PassFlagChips } from "#src/components/class-detail/pass-flag-chips";
import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useCompatiblePasses } from "#src/hooks/use-compatible-passes";
import { PASSES_URL } from "#src/urls";
import { formatPassPrice } from "#src/utils/compatible-passes";
import { useTranslation } from "#src/utils/i18n";

// --- Inner component (suspends on new query key) ---

type CompatiblePassesListProps = {
  metaActivityId: number;
  searchQuery: string;
  categoryIds: number[];
  properties: string[];
  clearFilters: () => void;
  onCategoriesReady: (categories: PassCategory[]) => void;
};

const CompatiblePassesList: FC<CompatiblePassesListProps> = ({
  metaActivityId,
  searchQuery,
  categoryIds,
  properties,
  clearFilters,
  onCategoriesReady,
}) => {
  const { t } = useTranslation("class-detail");
  const navigate = useNavigate();

  const { groups, count, categories, isFiltered } = useCompatiblePasses(
    metaActivityId,
    { searchQuery, categoryIds, properties },
  );

  useEffect(() => {
    onCategoriesReady(categories);
  }, [categories, onCategoriesReady]);

  const [selectedPassId, setSelectedPassId] = useState<number | null>(null);

  const flatPasses = useMemo(() => groups.flatMap((g) => g.passes), [groups]);

  const freeLabel = t("classDetail.compatiblePasses.panel.free");

  const emptyConfig = useMemo(
    () => ({
      title: t("classDetail.compatiblePasses.empty.title"),
      subtitle: t("classDetail.compatiblePasses.empty.description"),
      ctaButtonConfig: {
        label: t("classDetail.compatiblePasses.empty.cta"),
        iconRight: "link-external-02",
        onClick: () => navigate(PASSES_URL),
      },
    }),
    [t, navigate],
  );

  const emptySearchConfig = useMemo(
    () => ({
      title: t("classDetail.compatiblePasses.noResults.title"),
      ctaButtonConfig: {
        label: t("classDetail.compatiblePasses.noResults.cta"),
        iconLeft: "x-close",
        onClick: clearFilters,
      },
    }),
    [t, clearFilters],
  );

  const filteredTotal = flatPasses.length;

  const { EmptyState, shouldRenderEmptyState } = useEmptyState({
    isEmpty: count === 0 && !isFiltered,
    isEmptySearch: filteredTotal === 0 && isFiltered,
    emptyConfig,
    emptySearchConfig,
  });

  if (shouldRenderEmptyState) return <EmptyState />;

  return (
    <>
      {groups.map(({ category, passes }) => {
        const label =
          category?.name ?? t("classDetail.compatiblePasses.uncategorized");
        const groupId = `compatible-passes-${category?.id ?? "uncategorized"}`;
        return (
          <List
            key={groupId}
            id={groupId}
            header={{
              id: `${groupId}-header`,
              title: `${label} (${passes.length})`,
            }}
            collapsibleProps={{ initiallyOpen: true }}
            items={passes.map((pass) => ({
              id: String(pass.id),
              title: pass.name,
              description: formatPassPrice(pass.price, freeLabel),
              customNode: <PassFlagChips pass={pass} />,
              selected: pass.id === selectedPassId ? "selected" : "unselected",
              onItemClick: () => setSelectedPassId(pass.id),
            }))}
          />
        );
      })}
      <CompatiblePassDetailDrawer
        passes={flatPasses}
        selectedPassId={selectedPassId}
        onSelect={setSelectedPassId}
      />
    </>
  );
};

// --- Outer component (owns state, never suspends) ---

type CompatiblePassesTabProps = {
  metaActivityId: number;
  searchQuery: string;
  categoryIds: number[];
  properties: string[];
  clearFilters: () => void;
  onCategoriesReady: (categories: PassCategory[]) => void;
};

export const CompatiblePassesTab: FC<CompatiblePassesTabProps> = ({
  metaActivityId,
  searchQuery,
  categoryIds,
  properties,
  clearFilters,
  onCategoriesReady,
}) => {
  return (
    // Prevent Enter from submitting the parent form when interacting with filter inputs
    <div
      className="flex flex-col"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <QueryBoundary loadingFallback={<CardLoader />}>
        <CompatiblePassesList
          metaActivityId={metaActivityId}
          searchQuery={searchQuery}
          categoryIds={categoryIds}
          properties={properties}
          clearFilters={clearFilters}
          onCategoriesReady={onCategoriesReady}
        />
      </QueryBoundary>
    </div>
  );
};
