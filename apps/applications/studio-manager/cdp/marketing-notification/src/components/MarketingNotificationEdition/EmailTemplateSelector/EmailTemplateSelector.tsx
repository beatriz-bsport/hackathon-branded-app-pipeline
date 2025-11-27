import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type {
  EmailTemplateSummary,
  FetchEmailTemplateSummaryParams,
} from "@bsport/store-cdp-email-template";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchEmailTemplateCategories } from "#src/hooks/api/use-fetch-email-template-categories";
import { useFetchEmailTemplateSummaries } from "#src/hooks/api/use-fetch-email-template-summaries";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

export type EmailTemplateSelectorProps = {
  disabled?: boolean;
  defaultTemplateId?: number;
  onSelectTemplate?: (selectedTemplate: EmailTemplateSummary | null) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const EmailTemplateSelector = ({
  disabled = false,
  defaultTemplateId,
  textfieldProps,
  onSelectTemplate,
}: EmailTemplateSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { emailTemplateCategoriesMappedById } =
    useFetchEmailTemplateCategories();
  const { emailTemplatesById, searchedEmailTemplates } =
    useGetMarketingNotificationDependenciesData();

  const { handleSearchEmailTemplates } = useFetchEmailTemplateSummaries();

  // Group email templates by category
  const groupEmailTemplates = (results: EmailTemplateSummary[]) => {
    const categories = results.reduce<
      Array<{
        title: string;
        options: Array<{ id: string; label: string; description?: string }>;
      }>
    >((acc, template) => {
      const category = template?.category
        ? emailTemplateCategoriesMappedById[template.category]
        : undefined;
      const categoryName = category
        ? category.name
        : t("steps.content.selector.emailTemplates.noCategory");

      let group = acc.find((g) => g.title === categoryName);
      if (!group) {
        group = {
          title: categoryName,
          options: [],
        };
        acc.push(group);
      }
      group.options.push({
        id: template.id.toString(),
        label: template.title,
        description: template.subject,
      });
      return acc;
    }, []);
    const updateCategoriesTitle = categories.map((category) => ({
      ...category,
      title: category.title + " (" + category.options.length + ")",
    }));
    return updateCategoriesTitle;
  };

  return (
    <BackendSelector<FetchEmailTemplateSummaryParams, EmailTemplateSummary>
      className="w-full"
      key={defaultTemplateId}
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) => handleSearchEmailTemplates(query, params),
        data: searchedEmailTemplates,
      }}
      optionsFormatter={(results) => groupEmailTemplates(results)}
      textfieldProps={{
        iconLeft: "mail-01",
        id: "email-template-selector-textfield",
        label: t("steps.content.selector.emailTemplates.label"),
        placeholder: t("steps.content.selector.emailTemplates.placeholder"),
        ...textfieldProps,
      }}
      loadingMessage={t("steps.content.selector.emailTemplates.loading")}
      defaultValues={
        defaultTemplateId ? [defaultTemplateId.toString()] : undefined
      }
      onSelect={(selected) => {
        if (typeof selected !== "string") {
          return null;
        }
        const selectedTemplateId = parseInt(selected);
        const selectedTemplate = emailTemplatesById[selectedTemplateId];
        if (selectedTemplate && onSelectTemplate) {
          onSelectTemplate(selectedTemplate);
        }
      }}
      onClear={() => {
        if (onSelectTemplate) {
          onSelectTemplate(null);
        }
      }}
    />
  );
};
