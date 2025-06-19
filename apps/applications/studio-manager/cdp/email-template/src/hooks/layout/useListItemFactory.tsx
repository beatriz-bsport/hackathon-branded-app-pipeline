import type { ActionButton, Sortable } from "@bsport/kaizen-primitive-core";
import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";

import { useTranslation } from "#src/utils/i18n";
import { getEmailTemplateType } from "#src/utils/templates";

type UseListItemFactoryParams = {
  handlePreviewTemplate?: (template: EmailTemplateSummary) => void;
  handleDuplicateTemplate?: (template: EmailTemplateSummary) => void;
  handleDeleteTemplate?: (template: EmailTemplateSummary) => void;
};

type UseListItemFactoryReturn = {
  getFormattedListItems: ({
    categoryId,
    emailTemplateList,
  }: {
    categoryId?: number | null;
    emailTemplateList: EmailTemplateSummary[];
  }) => Sortable[];
};

export const useListItemFactory = ({
  handleDeleteTemplate,
  handleDuplicateTemplate,
  handlePreviewTemplate,
}: UseListItemFactoryParams): UseListItemFactoryReturn => {
  const { t } = useTranslation("list");

  const getPreviewActionConfig = ({
    emailTemplate,
  }: {
    emailTemplate: EmailTemplateSummary;
  }) => {
    return emailTemplate && handlePreviewTemplate
      ? {
          id: `email-template-preview-${emailTemplate.id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "eye",
          tooltipProps: {
            label: t("activeList.hover.preview"),
            placement: "bottom-right",
          },
          onClick: () => handlePreviewTemplate?.(emailTemplate),
        }
      : null;
  };

  const getDuplicateActionConfig = ({
    emailTemplate,
  }: {
    emailTemplate: EmailTemplateSummary;
  }) => {
    return emailTemplate && handleDuplicateTemplate
      ? {
          id: `email-template-duplicate-${emailTemplate.id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "copy-03",
          onClick: () => handleDuplicateTemplate?.(emailTemplate),
          tooltipProps: {
            label: t("activeList.hover.duplicate"),
            placement: "bottom-right",
          },
        }
      : null;
  };

  const getDeleteActionConfig = ({
    emailTemplate,
  }: {
    emailTemplate: EmailTemplateSummary;
  }) => {
    return emailTemplate && handleDeleteTemplate
      ? {
          id: `email-template-delete-${emailTemplate.id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "trash-01",
          onClick: () => handleDeleteTemplate?.(emailTemplate),
          tooltipProps: {
            label: t("activeList.hover.delete"),
            placement: "bottom-right",
          },
        }
      : null;
  };

  const getListItemActionByTemplateType = ({
    emailTemplate,
  }: {
    emailTemplate: EmailTemplateSummary;
  }): ActionButton[] => {
    const templateType = getEmailTemplateType({ emailTemplate });

    if (templateType === "master") {
      return [getPreviewActionConfig({ emailTemplate })].filter(
        Boolean,
      ) as ActionButton[];
    } else if (templateType === "bsport") {
      return [
        getPreviewActionConfig({ emailTemplate }),
        getDuplicateActionConfig({ emailTemplate }),
      ].filter(Boolean) as ActionButton[];
    }
    return [
      getPreviewActionConfig({ emailTemplate }),
      getDuplicateActionConfig({ emailTemplate }),
      getDeleteActionConfig({ emailTemplate }),
    ].filter(Boolean) as ActionButton[];
  };

  const getFormattedListItems = ({
    categoryId,
    emailTemplateList,
  }: {
    categoryId?: number | null;
    emailTemplateList: EmailTemplateSummary[];
  }): Sortable[] => {
    const filteredEmailTemplateList = categoryId
      ? emailTemplateList.filter(
          (_emailTemplate) => _emailTemplate.category === categoryId,
        )
      : emailTemplateList.filter((_template) => !_template.category);
    return filteredEmailTemplateList
      .sort((a, b) => a.ordering_in_category - b.ordering_in_category)
      .map((emailTemplate) => ({
        id: `email-template-${emailTemplate.id}`,
        title: emailTemplate.title,
        description: emailTemplate.subject ?? "",
        dropdownConfig: {
          visibleActionsDisplayLimit: 3,
        },
        buttons: getListItemActionByTemplateType({
          emailTemplate,
        }),
      }));
  };

  return { getFormattedListItems };
};
