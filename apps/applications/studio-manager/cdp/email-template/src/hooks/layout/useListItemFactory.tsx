import type { ActionButton, Sortable } from "@bsport/kaizen-primitive-core";
import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";

import { useTranslation } from "#src/utils/i18n";
import { getEmailTemplateType } from "#src/utils/templates";

import { useTemplateNavigation } from "../useTemplateNavigation";

type UseListItemFactoryParams = {
  handlePreviewTemplate?: (template: EmailTemplateSummary) => void;
  handleDuplicateTemplate?: (template: EmailTemplateSummary) => void;
  handleDeleteTemplate?: (template: EmailTemplateSummary) => void;
};

export const useListItemFactory = ({
  handleDeleteTemplate,
  handleDuplicateTemplate,
  handlePreviewTemplate,
}: UseListItemFactoryParams) => {
  const { t } = useTranslation("list");

  const { navigateToTemplateDetails } = useTemplateNavigation();

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

  const getFilteredEmailTemplateList = ({
    categoryId,
    emailTemplateList,
    searchedList = false,
  }: {
    categoryId?: number | null;
    emailTemplateList: EmailTemplateSummary[];
    searchedList?: boolean;
  }): EmailTemplateSummary[] => {
    if (!emailTemplateList || emailTemplateList.length === 0) return [];

    if (searchedList) return emailTemplateList;

    if (categoryId === undefined || categoryId === null) {
      return emailTemplateList.filter((_template) => !_template.category);
    }
    return emailTemplateList.filter(
      (_emailTemplate) => _emailTemplate.category === categoryId,
    );
  };

  /*
   * @debt(1,1,1): We do not have a proper sorting, ordering mechanism in place yet in the backend.
   * This is a temporary solution to sort the email templates based on their ordering_in_category property.
   * The sorting/ordering should always be handled by the backend. Please try to not reproduce this logic if possible.
   * Debt ticket : https://linear.app/bsport/issue/CDP-640/debt-add-backend-orderingsorting-on-email-templates
   *
   * Also normally we should be implementing a pinning mechanism for templates that should solve that (as the ordering
   * of the pinned items should also be done in the backend directly)
   */
  const getSortedEmailTemplateList = ({
    emailTemplateList,
    searchedList = false,
  }: {
    emailTemplateList: EmailTemplateSummary[];
    searchedList?: boolean;
  }): EmailTemplateSummary[] => {
    if (!emailTemplateList || emailTemplateList.length === 0) return [];

    if (searchedList) return emailTemplateList;

    return emailTemplateList.sort(
      (a, b) => a.ordering_in_category - b.ordering_in_category,
    );
  };

  const getFormattedListItems = ({
    categoryId,
    emailTemplateList,
    searchedList = false,
  }: {
    categoryId?: number | null;
    emailTemplateList: EmailTemplateSummary[];
    searchedList?: boolean;
  }): Sortable[] => {
    const filteredEmailTemplateList = getFilteredEmailTemplateList({
      categoryId,
      emailTemplateList,
      searchedList,
    });

    const sortedEmailTemplateList = getSortedEmailTemplateList({
      emailTemplateList: filteredEmailTemplateList,
      searchedList,
    });

    return sortedEmailTemplateList.map((emailTemplate) => ({
      id: `email-template-${emailTemplate.id}`,
      title: emailTemplate.title,
      description: emailTemplate.subject ?? "",
      dropdownConfig: {
        visibleActionsDisplayLimit: 3,
      },
      buttons: getListItemActionByTemplateType({
        emailTemplate,
      }),
      onItemClick: () => navigateToTemplateDetails(emailTemplate.id),
    }));
  };

  return { getFormattedListItems };
};
