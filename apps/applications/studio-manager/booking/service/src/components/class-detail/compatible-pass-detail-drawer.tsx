import { useQueries, useQuery } from "@tanstack/react-query";
import { type FC, useCallback, useMemo } from "react";

import {
  retrieveEstablishmentQueryOptions,
  retrieveGroupActivityQueryOptions,
} from "@bsport/api-book";
import { fetchSportCategoriesQueryOptions } from "@bsport/api-core/categories";
import { DetailDrawer } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CompatiblePassDetailContent } from "#src/components/class-detail/compatible-pass-detail-content";
import type { CompatibilityLookup, CompatiblePass } from "#src/types";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  passes: CompatiblePass[];
  selectedPassId: number | null;
  onSelect: (id: number | null) => void;
};

export const CompatiblePassDetailDrawer: FC<Props> = ({
  passes,
  selectedPassId,
  onSelect,
}) => {
  const { t } = useTranslation("class-detail");
  const isOpen = selectedPassId !== null;

  const idx = useMemo(
    () => passes.findIndex((p) => p.id === selectedPassId),
    [passes, selectedPassId],
  );

  const currentPass = passes[idx] ?? null;

  const goPrev = useCallback(() => {
    if (idx > 0) onSelect(passes[idx - 1].id);
  }, [idx, passes, onSelect]);

  const goNext = useCallback(() => {
    if (idx < passes.length - 1) onSelect(passes[idx + 1].id);
  }, [idx, passes, onSelect]);

  // useQuery (not useSuspenseQuery) — queries are gated by `enabled` so they must not suspend.
  // Name resolution — only fires when drawer is open
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: sctData, isLoading: sctLoading } = useQuery({
    ...fetchSportCategoriesQueryOptions(fetch, { company_id: companyId }),
    enabled: isOpen && companyId !== undefined,
  });

  const metaActivityResult = useQueries({
    queries: (currentPass?.metaActivities ?? []).map((id) => ({
      ...retrieveGroupActivityQueryOptions(fetch, id),
      enabled: isOpen,
    })),
    combine: (results) => ({
      names: new Map(
        results
          .map(
            (q, i) => [currentPass?.metaActivities[i], q.data?.name] as const,
          )
          .filter(
            (e): e is [number, string] =>
              e[0] !== undefined && e[1] !== undefined,
          ),
      ),
      isLoading: results.some((q) => q.isLoading),
    }),
  });

  const establishmentResult = useQueries({
    queries: (currentPass?.establishments ?? []).map((id) => ({
      ...retrieveEstablishmentQueryOptions(fetch, id),
      enabled: isOpen,
    })),
    combine: (results) => ({
      names: new Map(
        results
          .map(
            (q, i) => [currentPass?.establishments[i], q.data?.title] as const,
          )
          .filter(
            (e): e is [number, string] =>
              e[0] !== undefined && e[1] !== undefined,
          ),
      ),
      isLoading: results.some((q) => q.isLoading),
    }),
  });

  // Separate flag needed because compatibilityLookup starts as empty Maps (valid state for
  // unrestricted passes), so we can't rely on empty maps alone to detect "still loading".
  // Without this, a pass with no restrictions would be indistinguishable from one mid-fetch.
  const isCompatibilityLookupLoading =
    isOpen &&
    (sctLoading ||
      metaActivityResult.isLoading ||
      establishmentResult.isLoading);

  const compatibilityLookup = useMemo<CompatibilityLookup>(
    () => ({
      sctNames: new Map((sctData ?? []).map((c) => [c.id, c.name])),
      metaActivityNames: metaActivityResult.names,
      establishmentNames: establishmentResult.names,
    }),
    [sctData, metaActivityResult.names, establishmentResult.names],
  );

  return (
    <DetailDrawer
      id={`compatible-pass-drawer-${selectedPassId}`}
      isOpen={isOpen}
      onClose={() => onSelect(null)}
      actionsConfig={[
        {
          id: "prev",
          kind: "icon-button",
          intent: "flat",
          size: "sm",
          color: "default",
          icon: "chevron-up",
          label: t("classDetail.compatiblePasses.panel.previous"),
          onClick: goPrev,
          disabled: idx <= 0,
          tooltipProps: {
            label: t("classDetail.compatiblePasses.panel.previous"),
            placement: "bottom",
          },
        },
        {
          id: "next",
          kind: "icon-button",
          intent: "flat",
          size: "sm",
          color: "default",
          icon: "chevron-down",
          label: t("classDetail.compatiblePasses.panel.next"),
          onClick: goNext,
          disabled: idx >= passes.length - 1,
          tooltipProps: {
            label: t("classDetail.compatiblePasses.panel.next"),
            placement: "bottom",
          },
        },
      ]}
    >
      {currentPass && (
        <CompatiblePassDetailContent
          pass={currentPass}
          compatibilityLookup={compatibilityLookup}
          isCompatibilityLookupLoading={isCompatibilityLookupLoading}
        />
      )}
    </DetailDrawer>
  );
};
