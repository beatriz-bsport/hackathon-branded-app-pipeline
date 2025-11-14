import clsx from "clsx";
import { useEffect, useState } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";

import { DeleteTemplateModal } from "#src/components/Common/Modals/DeleteTemplateModal";
import { DuplicateTemplateModal } from "#src/components/Common/Modals/DuplicateTemplateModal";
import { PreviewTemplateModal } from "#src/components/Common/Modals/PreviewTemplateModal";
import { useFetchPaginatedTemplateList } from "#src/hooks/fetch/useFetchPaginatedTemplates";
import { useListItemFactory } from "#src/hooks/layout/useListItemFactory";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import { useTranslation } from "#src/utils/i18n";
import type { PossibleEmailTemplateType } from "#src/utils/types";

type Props = {
  searchInput: string;
  modelToFetch: PossibleEmailTemplateType;
  resetSearch?: () => void;
  resetTemplateList?: () => void;
};

export const SearchedTemplateList: React.FC<Props> = ({
  searchInput,
  modelToFetch,
  resetSearch,
  resetTemplateList,
}: Props) => {
  const [currentInlineActions, setCurrentInlineActions] = useState<
    "duplicate" | "delete" | "preview" | null
  >(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplateSummary | null>(null);
  const { navigateToCustomList } = useTemplateNavigation();
  const { t } = useTranslation("list");
  const {
    emailTemplateList,
    fuzzySearchEmailTemplate,
    totalItems,
    isEmptySearch,
  } = useFetchPaginatedTemplateList({
    searchInput,
    templatesToFetch: modelToFetch,
  });

  const handlePreviewTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("preview");
  };

  const handleDuplicateTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("duplicate");
  };

  const handleDeleteTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("delete");
  };

  const handleResetActions = () => {
    setCurrentInlineActions(null);
    setSelectedTemplate(null);
  };

  const onActionSuccess = () => {
    handleResetActions();
    resetSearch?.();
    navigateToCustomList();
    resetTemplateList?.();
  };

  const { getFormattedListItems, isMobile } = useListItemFactory({
    handlePreviewTemplate,
    handleDuplicateTemplate,
    handleDeleteTemplate,
  });

  const searchEmailTemplateList = getFormattedListItems({
    emailTemplateList,
    searchedList: true,
  });

  const isEmptyList = totalItems === 0;

  const emptyListState = {
    isEmpty: isEmptyList,
    emptyConfig: {
      title: t("templateList.emptyPage.title"),
      subtitle: t("templateList.emptyPage.description"),
      variant: "empty-state",
    },
  };

  useEffect(() => {
    if (searchInput) {
      fuzzySearchEmailTemplate();
    }
  }, [fuzzySearchEmailTemplate, searchInput]);

  return (
    <>
      <div
        className={clsx("flex flex-col w-full", {
          "self-center": isEmptySearch,
        })}
      >
        <List
          key={`search-email-template-list-${isMobile}`}
          id={`search-bsport-email-template-list`}
          items={searchEmailTemplateList}
          emptyStateProps={emptyListState}
        />
      </div>
      {currentInlineActions === "duplicate" && selectedTemplate ? (
        <DuplicateTemplateModal
          isOpen
          templateId={selectedTemplate.id}
          onClose={handleResetActions}
          onSuccess={onActionSuccess}
        />
      ) : null}
      {currentInlineActions === "delete" && selectedTemplate ? (
        <DeleteTemplateModal
          isOpen
          templateId={selectedTemplate.id}
          onClose={handleResetActions}
          onSuccess={onActionSuccess}
        />
      ) : null}
      {currentInlineActions === "preview" && selectedTemplate ? (
        <PreviewTemplateModal
          isOpen
          templateSummary={selectedTemplate}
          onClose={handleResetActions}
          onDuplicateSuccess={onActionSuccess}
        />
      ) : null}
    </>
  );
};
