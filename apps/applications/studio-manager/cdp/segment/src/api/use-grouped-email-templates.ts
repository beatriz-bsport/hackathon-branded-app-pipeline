import { useQueries } from "@tanstack/react-query";

import {
  type EmailTemplateDetail,
  emailTemplateCategoriesQueryOptions,
  emailTemplateSearchQueryOptions,
} from "@bsport/api-cdp/email-template";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type EmailTemplateCategory = {
  id: number;
  name: string;
};

type GroupedOption = {
  id: string;
  label: string;
  description?: string;
};

type EmailTemplateGroup = {
  title: string;
  options: GroupedOption[];
};

/**
 * Pure combine function extracted for referential stability.
 * Groups email templates by category, falling back to `noCategoryLabel`.
 */
const buildGroupedEmailTemplates = (
  templates: EmailTemplateDetail[],
  categoriesById: Record<number, EmailTemplateCategory>,
  noCategoryLabel: string,
): EmailTemplateGroup[] => {
  const groups = templates.reduce<EmailTemplateGroup[]>((acc, template) => {
    const category = template?.category
      ? categoriesById[template.category]
      : undefined;
    const categoryName = category ? category.name : noCategoryLabel;

    let currentGroup = acc.find((group) => group.title === categoryName);
    if (!currentGroup) {
      currentGroup = { title: categoryName, options: [] };
      acc.push(currentGroup);
    }
    currentGroup.options.push({
      id: template.id.toString(),
      label: template.title,
      description: template.subject,
    });
    return acc;
  }, []);

  return groups.map((group) => ({
    ...group,
    title: `${group.title} (${group.options.length})`,
  }));
};

/**
 * Hook that fetches email templates and their categories in parallel,
 * then combines them into grouped options ready for BackendSelector.
 *
 * Mirrors the composition pattern used in `useTagRules`.
 */
export const useGroupedEmailTemplates = ({
  searchInput,
  id__in,
}: {
  searchInput: string;
  id__in?: string;
}) => {
  const { t } = useTranslation("campaign");

  return useQueries({
    queries: [
      emailTemplateSearchQueryOptions(fetch, { searchInput, id__in }),
      emailTemplateCategoriesQueryOptions(fetch),
    ],
    combine: ([searchResult, categoriesResult]) => {
      const templates = searchResult.data?.results ?? [];
      const categories = categoriesResult.data?.results ?? [];

      const categoriesById = Object.fromEntries(
        categories.map((category) => [category.id, category]),
      ) as Record<number, EmailTemplateCategory>;

      const noCategoryLabel = t(
        "email.creation.form.emailTemplate.emailTemplateNoCategory",
      );

      return {
        data: templates,
        isLoading: searchResult.isLoading || categoriesResult.isLoading,
        optionsFormatter: (results: EmailTemplateDetail[]) =>
          buildGroupedEmailTemplates(results, categoriesById, noCategoryLabel),
      };
    },
  });
};
