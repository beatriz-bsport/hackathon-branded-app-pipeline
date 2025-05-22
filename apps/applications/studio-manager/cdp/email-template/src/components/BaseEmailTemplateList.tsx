import { useCallback, useMemo } from "react";

import {
  type ActionButton,
  List,
  type ListItemProps,
} from "@bsport/kaizen-primitive-core";

import useEmailTemplateEmptyListState from "#src/hooks/useEmailTemplateEmptyListState";
import type { EmailTemplate } from "#src/pages/EmailTemplateSummaryPage";

type Props = {
  model: "master" | "bsport";
  emailTemplateList: EmailTemplate[];
  handleAddTemplate: () => void;
  handleAddCategory: () => void;
  handlePreviewTemplate: (template: EmailTemplate) => void;
  handleDuplicateTemplate: (template: EmailTemplate) => void;
};

const BaseEmailTemplateList: React.FC<Props> = ({
  model,
  emailTemplateList,
  handleAddCategory,
  handleAddTemplate,
  handlePreviewTemplate,
  handleDuplicateTemplate,
}: Props) => {
  const getListItemsActions = useCallback(
    ({ emailTemplate }: { emailTemplate: EmailTemplate }): ActionButton[] => {
      const { id } = emailTemplate;
      const previewAction: ActionButton[] = [
        {
          id: `email-template-preview-action-${id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "eye",
          onClick: () => {
            handlePreviewTemplate(emailTemplate);
          },
        },
      ];
      if (model === "master") {
        return previewAction;
      }
      return [
        ...previewAction,
        {
          id: `email-template-duplicate-action-${id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "file-06",
          onClick: () => {
            handleDuplicateTemplate(emailTemplate);
          },
        },
      ];
    },
    [model, handlePreviewTemplate, handleDuplicateTemplate],
  );

  const emailTemplateListItems: ListItemProps[] = useMemo(
    () =>
      emailTemplateList.map((emailTemplate) => ({
        id: `email-template-${emailTemplate.id}`,
        title: emailTemplate.title,
        description: emailTemplate.subject,
        buttons: getListItemsActions({
          emailTemplate,
        }),
      })),
    [emailTemplateList, getListItemsActions],
  );

  const isEmptyList = emailTemplateListItems?.length === 0;
  const { emptyStateConfig } = useEmailTemplateEmptyListState({
    isEmptyList,
    handleAddTemplate,
    handleAddCategory,
  });
  const paginationProps = {
    currentPage: 1,
    rowsPerPage: 10,
    totalItems: emailTemplateListItems?.length,
    showRowsPerPageSelector: true,
  };

  return (
    <div className={`flex flex-col w-full ${isEmptyList && "self-center"}`}>
      <List
        id={`${model}-email-template-list`}
        items={emailTemplateListItems}
        emptyStateProps={emptyStateConfig}
        paginationProps={paginationProps}
      />
    </div>
  );
};

export default BaseEmailTemplateList;
