import { useState } from "react";

import {
  type Sortable,
  SortableList,
  type SortableListProps,
} from "@bsport/kaizen-primitive-core";
import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";

import { useEmailTemplateOrdering } from "#src/hooks/actions/useEmailTemplateOrdering";
import { useListItemFactory } from "#src/hooks/layout/useListItemFactory";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  emailTemplateList: EmailTemplateSummary[];
  handlePreviewTemplate: (template: EmailTemplateSummary) => void;
  handleDuplicateTemplate: (template: EmailTemplateSummary) => void;
  handleDeleteTemplate: (template: EmailTemplateSummary) => void;
};

export const NoCategoryList: React.FC<Props> = ({
  emailTemplateList,
  handleDuplicateTemplate,
  handleDeleteTemplate,
  handlePreviewTemplate,
}: Props) => {
  const { getFormattedListItems, isMobile } = useListItemFactory({
    handlePreviewTemplate,
    handleDeleteTemplate,
    handleDuplicateTemplate,
  });
  const noCategoryEmailTemplateList = getFormattedListItems({
    categoryId: null,
    emailTemplateList,
  });
  const [orderedEmailTemplateList, setOrderedEmailTemplateList] = useState<
    Sortable[]
  >(noCategoryEmailTemplateList ?? []);
  const { t } = useTranslation("list");
  const { reorderEmailTemplates } = useEmailTemplateOrdering();

  const noCategoryListHeader: SortableListProps["header"] = {
    id: "email-template-list-header-no-category",
    title: t("templateList.noCategory", {
      emailTemplateCount: noCategoryEmailTemplateList.length || 0,
    }),
  };

  const noCategoryEmptyState = {
    isEmpty: noCategoryEmailTemplateList.length === 0,
    emptyConfig: {
      title: t("templateList.emptyPage.custom.title"),
      subtitle: t("templateList.emptyPage.custom.description"),
      variant: "empty-state",
    },
  };

  return (
    <div className="flex flex-col w-full self-center">
      <SortableList
        key={`no-category-sortable-${isMobile}`}
        id="custom-email-template-sortable-list-no-category"
        header={noCategoryListHeader}
        items={orderedEmailTemplateList}
        emptyStateProps={noCategoryEmptyState}
        onSortChange={(reorderedTemplates: Sortable[]) => {
          setOrderedEmailTemplateList(reorderedTemplates);
          reorderEmailTemplates(reorderedTemplates);
        }}
      />
    </div>
  );
};
