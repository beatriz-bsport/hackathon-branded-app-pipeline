import { useMemo, useRef, useState } from "react";

import {
  type FilterProps,
  List,
  ListLayout,
} from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const SECTIONS = [
  { id: "member", icon: "user-01" },
  { id: "financial", icon: "coins-stacked-01" },
  { id: "booking", icon: "calendar" },
  { id: "teacher", icon: "spacing-width-02" },
  { id: "marketing", icon: "announcement-01" },
] as const;

const ALL_ROWS = [
  {
    id: "trial",
    section: "member",
    link: LEGACY_URLS.TRIAL_ANALYSIS,
  },
  {
    id: "recurring",
    section: "financial",
    link: LEGACY_URLS.RECURRING_REVENUE,
  },
] as const;

const InsightsPage = () => {
  const { t } = useTranslation("insights");
  const [selected, setSelected] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const filterRef = useRef<{ resetFilters: () => void }>(null);

  const rows = useMemo(() => {
    let filteredRows = ALL_ROWS.map((row) => ({
      ...row,
      title: t(`items.${row.id}.title`),
      description: t(`items.${row.id}.description`),
    })).filter((r) => (selected ? r.section === selected : true));

    // Apply search filter
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase();
      filteredRows = filteredRows.filter(
        (row) =>
          row.title.toLowerCase().includes(searchLower) ||
          row.description.toLowerCase().includes(searchLower),
      );
    }

    return filteredRows;
  }, [selected, searchInput, t]);

  const filterConfig: FilterProps = useMemo(() => {
    const fields = {
      filter: {
        id: "filter",
        label: t("filter.filterLabel"),
        availableFilters: ["is"],
        values: SECTIONS.map((section) => ({
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
            chip: {
              size: "lg",
              type: "weak",
              color: "default",
              label: t(`sections.${row.section}`),
              iconLeft:
                SECTIONS.find((s) => s.id === row.section)?.icon || "user-01",
            },
            onClick: () => window.location.assign(row.link),
          }))}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default InsightsPage;
