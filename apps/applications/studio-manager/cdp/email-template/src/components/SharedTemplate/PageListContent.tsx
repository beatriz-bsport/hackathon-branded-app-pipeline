import clsx from "clsx";
import { useEffect, useState } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";

import { DuplicateTemplateModal } from "#src/components/Common/Modals/DuplicateTemplateModal";
import { PreviewTemplateModal } from "#src/components/Common/Modals/PreviewTemplateModal";
import { useFetchPaginatedTemplateList } from "#src/hooks/fetch/useFetchPaginatedTemplates";
import { useListItemFactory } from "#src/hooks/layout/useListItemFactory";
import { useEmailTemplateEmptyListState } from "#src/hooks/useEmailTemplateEmptyListState";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import type { PossibleSharedEmailTemplateType } from "#src/utils/types";

type Props = {
  searchInput: string;
  model: PossibleSharedEmailTemplateType;
};

export const SharedEmailTemplateList: React.FC<Props> = ({
  searchInput,
  model,
}: Props) => {
  const [currentInlineActions, setCurrentInlineActions] = useState<
    "duplicate" | "preview" | null
  >(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplateSummary | null>(null);
  const { emailTemplateList, paginationParams, fetchEmailTemplates, isEmpty } =
    useFetchPaginatedTemplateList({
      searchInput,
      templatesToFetch: model,
    });
  const { navigateToCustomList } = useTemplateNavigation();

  const handleDuplicateTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("duplicate");
  };

  const handlePreviewTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("preview");
  };

  const handleResetActions = () => {
    setCurrentInlineActions(null);
    setSelectedTemplate(null);
  };

  const onDuplicateSuccess = () => {
    handleResetActions();
    navigateToCustomList();
  };

  const { getFormattedListItems } = useListItemFactory({
    handlePreviewTemplate,
    handleDuplicateTemplate,
  });
  const emailTemplateListItems = getFormattedListItems({
    emailTemplateList,
    categoryId: null,
  });
  const { emptyStateConfig } = useEmailTemplateEmptyListState({
    isEmptyList: isEmpty,
  });

  useEffect(() => {
    fetchEmailTemplates();
  }, [fetchEmailTemplates]);

  return (
    <>
      <div className={clsx("flex flex-col w-full", { "self-center": isEmpty })}>
        <List
          id={`${model}-email-template-list`}
          items={emailTemplateListItems}
          emptyStateProps={emptyStateConfig}
          paginationProps={paginationParams}
        />
      </div>
      {currentInlineActions === "duplicate" && selectedTemplate ? (
        <DuplicateTemplateModal
          isOpen
          templateId={selectedTemplate.id}
          onClose={handleResetActions}
          onSuccess={onDuplicateSuccess}
        />
      ) : null}
      {currentInlineActions === "preview" && selectedTemplate ? (
        <PreviewTemplateModal
          isOpen
          templateSummary={selectedTemplate}
          onClose={handleResetActions}
          onDuplicateSuccess={onDuplicateSuccess}
        />
      ) : null}
    </>
  );
};
