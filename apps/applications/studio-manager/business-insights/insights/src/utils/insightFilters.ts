import { INSIGHT_ITEMS, INSIGHT_SECTIONS } from "#src/constants";
import type { TFunction } from "#src/utils/i18n";

export interface InsightRow {
  id: string;
  section: string;
  title: string;
  description: string;
  link: string;
}

/**
 * Converts raw insight items to display-ready rows with translations
 */
export const createInsightRows = (t: TFunction): InsightRow[] => {
  return INSIGHT_ITEMS.map((item) => ({
    ...item,
    title: t(`items.${item.id}.title`),
    description: t(`items.${item.id}.description`),
    link: item.link,
  }));
};

/**
 * Filters insights by section
 */
export const filterBySection = (
  rows: InsightRow[],
  selectedSection: string | null,
): InsightRow[] => {
  return selectedSection
    ? rows.filter((row) => row.section === selectedSection)
    : rows;
};

/**
 * Filters insights by search term (searches both title and description)
 */
export const filterBySearch = (
  rows: InsightRow[],
  searchTerm: string,
): InsightRow[] => {
  if (!searchTerm.trim()) {
    return rows;
  }

  const searchLower = searchTerm.toLowerCase();
  return rows.filter(
    (row) =>
      row.title.toLowerCase().includes(searchLower) ||
      row.description.toLowerCase().includes(searchLower),
  );
};

type SectionKey = "member" | "financial" | "booking" | "teacher" | "marketing";

/**
 * Creates a chip configuration for an insight row
 */
export const createChipForRow = (row: InsightRow, t: TFunction) => {
  const section = INSIGHT_SECTIONS.find((s) => s.id === row.section);

  // Get the section label with proper typing
  const getSectionLabel = (sectionId: string): string => {
    const validSections: SectionKey[] = [
      "member",
      "financial",
      "booking",
      "teacher",
      "marketing",
    ];

    if (validSections.includes(sectionId as SectionKey)) {
      // Use direct key mapping for type safety
      switch (sectionId as SectionKey) {
        case "member":
          return t("sections.member");
        case "financial":
          return t("sections.financial");
        case "booking":
          return t("sections.booking");
        case "teacher":
          return t("sections.teacher");
        case "marketing":
          return t("sections.marketing");
        default:
          return sectionId;
      }
    }
    return sectionId; // Fallback to raw section id
  };

  return {
    size: "lg" as const,
    type: "weak" as const,
    color: "default" as const,
    label: getSectionLabel(row.section),
    iconLeft: section?.icon || "user-01",
  };
};
