import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import {
  Body,
  Chip,
  type FilterProps,
  List,
  ListLayout,
} from "@bsport/kaizen-primitive-core";

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
  },
  {
    id: "recurring",
    section: "financial",
  },
] as const;

const InsightsPage = () => {
  const navigate = useNavigate();
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
            section: row.section,
            onClick: () => {
              if (row.id === "trial") navigate("/insights/trial_analysis");
              if (row.id === "recurring")
                navigate("/insights/recurring_revenue");
            },
          }))}
          ListItem={({ title, description, section, onClick }) => (
            <div
              className="flex items-start justify-between gap-sm p-sm cursor-pointer hover:bg-gray-50 border-b-stroke-thin border-b-stroke-divider last:border-none"
              onClick={onClick}
              role="button"
              tabIndex={0}
            >
              <div className="flex-1 min-w-0">
                <Body htmlVariant="p" size="lg" weight="strong">
                  {title}
                </Body>
                <Body htmlVariant="p" color="weak">
                  {description}
                </Body>
              </div>
              <div className="shrink-0">
                <Chip
                  size="lg"
                  type="weak"
                  color="default"
                  label={t(`sections.${section}`)}
                  iconLeft={
                    SECTIONS.find((s) => s.id === section)?.icon || "user-01"
                  }
                />
              </div>
            </div>
          )}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default InsightsPage;
