import { type EmailTemplateSummary } from "@bsport/store-cdp-email-template";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchEmailTemplateCategories } from "#src/hooks/api/use-fetch-email-template-categories";
import {
  type EmailTemplateSearchParams,
  useSearchEmailTemplate,
} from "#src/hooks/api/use-search-email-templates";
import { useTranslation } from "#src/utils/i18n";

type EmailTemplateSelectorProps = {
  defaultTemplateId?: number;
  onSelectTemplate?: (selectedTemplate: EmailTemplateSummary) => void;
};

export const EmailTemplateSelector = ({
  defaultTemplateId,
  onSelectTemplate,
}: EmailTemplateSelectorProps) => {
  const { t } = useTranslation("transactionalNotification");
  const { emailTemplateCategoriesMappedById } =
    useFetchEmailTemplateCategories();

  const { emailTemplates, fetchEmailTemplates } = useSearchEmailTemplate();

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
        : t("notificationRuleEvents.noCategory");

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
    <BackendSelector<EmailTemplateSearchParams, EmailTemplateSummary>
      className="w-full"
      key={defaultTemplateId}
      storeConfig={{
        searchFn: (query, params) => fetchEmailTemplates(query, params),
        data: emailTemplates,
      }}
      optionsFormatter={(results) => groupEmailTemplates(results)}
      textfieldProps={{
        iconLeft: "mail-01",
        id: "email-template-selector-textfield",
        label: t(
          "notificationRuleEventDetails.details.emailNotification.select.label",
        ),
        placeholder: t(
          "notificationRuleEventDetails.details.emailNotification.select.placeholder",
        ),
      }}
      loadingMessage={t(
        "notificationRuleEventDetails.details.emailTemplateSelector.searchingMessage",
      )}
      defaultValues={
        defaultTemplateId ? [defaultTemplateId.toString()] : undefined
      }
      onSelect={(selected) => {
        const selectedTemplate = emailTemplates.find(
          (template) => template.id.toString() === selected,
        );
        if (selectedTemplate && onSelectTemplate) {
          onSelectTemplate(selectedTemplate);
        }
      }}
    />
  );
};
