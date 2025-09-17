import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import {
  type FilterProps,
  List,
  ListLayout,
} from "@bsport/kaizen-primitive-core";

import { INSIGHT_SECTIONS } from "#src/constants";
import { InsightFlags, useInsightFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";
import {
  createChipForRow,
  createInsightRows,
  filterBySearch,
  filterBySection,
} from "#src/utils/insightFilters";
import { useHasSubscriptionInvoicesPermission } from "#src/utils/permissions";

/**
 * Main insights page displaying a list of available business insight dashboards.
 * Provides filtering by section and search functionality.
 */
const InsightsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("insights");
  const [selected, setSelected] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const filterRef = useRef<{ resetFilters: () => void }>(null);

  // Check permissions to filter available insights
  const hasSubscriptionInvoicesPermission =
    useHasSubscriptionInvoicesPermission();

  // Check feature flags
  const isTrialAnalysisEnabled = useInsightFlag(InsightFlags.TRIAL_ANALYSIS);

  const rows = useMemo(() => {
    const baseRows = createInsightRows(
      t,
      hasSubscriptionInvoicesPermission,
      isTrialAnalysisEnabled,
    );
    const sectionFiltered = filterBySection(baseRows, selected);
    const searchFiltered = filterBySearch(sectionFiltered, searchInput);

    return searchFiltered;
  }, [
    selected,
    searchInput,
    t,
    hasSubscriptionInvoicesPermission,
    isTrialAnalysisEnabled,
  ]);

  const filterConfig: FilterProps = useMemo(() => {
    const fields = {
      filter: {
        id: "filter",
        label: t("filter.filterLabel"),
        availableFilters: ["is"],
        values: INSIGHT_SECTIONS.map((section) => ({
          id: section.id,
          label: t(`sections.${section.id}`),
        })),
        multiSelect: false,
      },
    };

    const filters = [
      {
        id: "is",
        label: t("filter.isLabel"),
      },
    ];

    return {
      fields,
      filters,
      selectFieldLabel: t("filter.selectFieldLabel"),
      onFilterChange: (filters) => {
        const nonEmptyFilterField = filters.filter((value) => !!value.field);
        const nextSection =
          nonEmptyFilterField.length > 0
            ? nonEmptyFilterField[0].valueIds[0]
            : null;
        setSelected(nextSection);
      },
      singleField: true,
    };
  }, [t]);

  const clearSearchInput = () => setSearchInput("");

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pageTitle")}
        pageStatusBadge={{
          size: "sm",
          color: "main",
          text: "New",
        }}
        filterConfig={filterConfig}
        filterRef={filterRef}
        searchConfig={{
          id: "insights-search",
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
          tooltipConfig: {},
        }}
      />
      <ListLayout.Content>
        <List
          id="insights-list"
          items={rows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            chips: [createChipForRow(row, t)],
            chipsDirection: "end",
            onClick: () => navigate(row.link),
            className: "hover:cursor-pointer",
          }))}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default InsightsPage;
