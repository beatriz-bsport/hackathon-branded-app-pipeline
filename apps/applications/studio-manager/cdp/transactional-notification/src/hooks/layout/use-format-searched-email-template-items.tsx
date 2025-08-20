import type {
  EmailTemplateCategory,
  EmailTemplateSummary,
} from "@bsport/store-cdp-email-template";

import { useTranslation } from "#src/utils/i18n";

/**
 * Hook for formatting email template search results into grouped options.
 *
 * This hook provides utilities to format email template search results for display
 * in autocomplete/select components. It handles grouping templates by category,
 * translating category names, and adding template counts to category titles.
 *
 * @param params - Configuration object for the hook
 * @param params.emailTemplateCategories - Array of email template categories for mapping
 * @returns Object containing formatting functions
 * @returns returns.formatSearchedEmailTemplateOptions - Function to format templates into grouped options
 */
export const useFormatSearchedEmailTemplateItems = ({
  emailTemplateCategoriesMappedById,
}: {
  emailTemplateCategoriesMappedById: Record<number, EmailTemplateCategory>;
}) => {
  const { t } = useTranslation("transactionalNotification");

  /**
   * Formats email template search results into grouped options for autocomplete components.
   *
   * This function transforms an array of email template summaries into properly
   * formatted grouped options with category titles including template counts and
   * individual template options with id, label, and description.
   *
   * @param results - Array of email template summaries to format
   * @returns Array of grouped options with titles and template options
   */
  // Group email templates by category
  const formatSearchedEmailTemplateOptions = (
    results: EmailTemplateSummary[],
  ) => {
    const categoryMap = new Map<
      string,
      Array<{ id: string; label: string; description?: string }>
    >();
    const noCategoryKey = t("notificationRuleEvents.noCategory");

    for (const template of results) {
      const category = template.category
        ? emailTemplateCategoriesMappedById[template.category]
        : undefined;
      const categoryName = category?.name ?? noCategoryKey;

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, []);
      }

      categoryMap.get(categoryName)!.push({
        id: template.id.toString(),
        label: template.title,
        description: template.subject,
      });
    }

    return Array.from(categoryMap.entries()).map(([title, options]) => ({
      title: `${title} (${options.length})`,
      options,
    }));
  };

  return {
    formatSearchedEmailTemplateOptions,
  };
};
