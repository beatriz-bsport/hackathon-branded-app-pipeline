import { ListLayout, type TabsProps } from "@bsport/kaizen-primitive-core";

import { CreateSmartlistModal } from "#src/components/CreateSmartlistModal";
import { DeleteSmartlistModal } from "#src/components/DeleteSmartlistModal";
import { DuplicateSmartlistModal } from "#src/components/DuplicateSmartlistModal";
import { EditSmartlistModal } from "#src/components/EditSmartlistModal";
import { SmartlistList } from "#src/components/SmartlistList";
import { useTranslation } from "#src/utils/i18n";

import { useSegmentListAction } from "./use-segment-list-action";
import { useSegmentListData } from "./use-segment-list-data";

type Props = {
  pageTabs?: TabsProps;
};

export const SegmentListPageContent: React.FC<Props> = ({
  pageTabs,
}: Props) => {
  const { t } = useTranslation("list");
  const {
    filters: {
      currentPage,
      currentPageSize,
      searchTerm,
      onSearchChange,
      onSearchClear,
      onPageSettingsChange,
    },
    smartlistQuery: { smartlists, isLoading, totalItems, refetch },
  } = useSegmentListData();
  const {
    inlineAction,
    closeInlineAction,
    openCreate,
    openEdit,
    openDuplicate,
    openDelete,
  } = useSegmentListAction();

  const isEmpty = totalItems === 0 && searchTerm.trim().length === 0;
  const isEmptySearch = searchTerm.trim().length > 0 && smartlists.length === 0;

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("title")}
        pageTabs={pageTabs}
        callToActionButton={
          <ListLayout.Button
            color="main"
            intent="call-to-action"
            label={t("addSmartlist")}
            iconLeft="plus"
            onClick={openCreate}
          />
        }
        searchConfig={{
          id: "smartlists-search",
          inputValue: searchTerm,
          onInputValueChange: onSearchChange,
          onClear: onSearchClear,
          tooltipConfig: {
            label: t("search"),
          },
        }}
      />
      <ListLayout.Content>
        <SmartlistList
          smartlists={smartlists}
          paginationProps={{
            currentPage,
            totalItems,
            rowsPerPage: currentPageSize,
            onPageSettingsChange,
          }}
          loadingProps={{
            isLoading,
          }}
          emptyStateConfig={{
            isEmpty,
            isEmptySearch,
            onSearchClear,
            onCreateClick: openCreate,
          }}
          actions={{
            onEdit: openEdit,
            onDuplicate: openDuplicate,
            onDelete: openDelete,
          }}
        />
        {inlineAction.kind === "duplicate" ? (
          <DuplicateSmartlistModal
            isOpen
            onClose={closeInlineAction}
            onDuplicate={refetch}
            smartlist={inlineAction.smartlist}
          />
        ) : null}
        {inlineAction.kind === "edit" ? (
          <EditSmartlistModal
            isOpen
            onClose={closeInlineAction}
            onEdit={refetch}
            onUndo={refetch}
            smartlist={inlineAction.smartlist}
          />
        ) : null}
        {inlineAction.kind === "create" ? (
          <CreateSmartlistModal
            isOpen
            onClose={closeInlineAction}
            onCreate={refetch}
          />
        ) : null}
        {inlineAction.kind === "delete" ? (
          <DeleteSmartlistModal
            isOpen
            onClose={closeInlineAction}
            onDelete={refetch}
            smartlist={inlineAction.smartlist}
          />
        ) : null}
      </ListLayout.Content>
    </ListLayout>
  );
};
