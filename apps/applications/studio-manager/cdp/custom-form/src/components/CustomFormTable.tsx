import { useState } from "react";

import {
  type PaginationProps,
  Table,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import type { CustomForm } from "@bsport/store-cdp-custom-form";

import { useRestoreAction } from "#src/hooks/actions/useRestoreAction";
import { useTranslation } from "#src/utils/i18n";

import { CustomFormList, type EmptyConfig } from "./CustomFormList";
import { DisableFormModal } from "./Modal/DisableFormModal";
import { DuplicateFormModal } from "./Modal/DuplicateFormModal";
import {
  type CustomFormTableRowData,
  type TableColumnsParams,
  useCustomFormTableColumns,
} from "./columns";

type BaseCustomFormTableProps = {
  customFormsItems: CustomFormTableRowData[];
  customForms?: CustomForm[];
  isEmpty: boolean;
  isEmptySearch: boolean;
  isLoading: boolean;
  paginationProps?: PaginationProps;
  refreshCustomForms: () => void;
  resetCustomForms: () => void;
  onCreateForm?: () => void;
} & TableColumnsParams;

export const CustomFormTable: React.FC<BaseCustomFormTableProps> = ({
  isEmpty,
  isEmptySearch,
  isLoading,
  mode,
  paginationProps,
  customFormsItems,
  customForms = [],
  refreshCustomForms,
  resetCustomForms,
  onCreateForm,
}: BaseCustomFormTableProps) => {
  const [currentInlineAction, setCurrentInlineAction] = useState<
    "archive" | "duplicate" | null
  >(null);
  const [selectedFormName, setSelectedFormName] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const { restoreFormAction } = useRestoreAction({
    onRestoreSuccess: refreshCustomForms,
    onDisableSuccess: refreshCustomForms,
  });
  const { t } = useTranslation("common");

  const handleArchiveForm = ({
    formId,
    formName,
  }: {
    formId: number;
    formName: string;
  }) => {
    setCurrentInlineAction("archive");
    setSelectedFormId(formId);
    setSelectedFormName(formName);
  };

  const handleDuplicateForm = ({
    formId,
    formName,
  }: {
    formId: number;
    formName: string;
  }) => {
    setCurrentInlineAction("duplicate");
    setSelectedFormId(formId);
    setSelectedFormName(formName);
  };

  const tableColumns = useCustomFormTableColumns({
    handleArchive: handleArchiveForm,
    handleDuplicate: handleDuplicateForm,
    handleRestore: restoreFormAction,
    mode,
  });

  const handleCloseModal = () => {
    setCurrentInlineAction(null);
    setSelectedFormId(null);
    setSelectedFormName(null);
  };

  const emptyConfig: EmptyConfig =
    mode === "active" && onCreateForm
      ? {
          title: t("table.empty.activeList.title"),
          subtitle: t("table.empty.activeList.subtitle"),
          ctaButtonConfig: {
            label: t("activeList.actions.addForm"),
            iconLeft: "plus" as const,
            onClick: () => onCreateForm(),
          },
        }
      : {
          title: t("table.empty.archivedList.title"),
          subtitle: t("table.empty.archivedList.subtitle"),
        };

  const loadingConfig = {
    isLoading: isLoading,
    message: t(
      mode === "archived"
        ? "table.loading.archivedList"
        : "table.loading.activeList",
    ),
  };

  const isMobile = !useMatchMedia("sm");

  return (
    <>
      {isMobile ? (
        <CustomFormList
          mode={mode}
          customForms={customForms}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          isLoading={isLoading}
          loadingMessage={loadingConfig.message}
          handleArchive={handleArchiveForm}
          handleDuplicate={handleDuplicateForm}
          handleRestore={restoreFormAction}
          emptyConfig={emptyConfig}
        />
      ) : (
        <Table
          columns={tableColumns}
          rowHeight="lg"
          rows={customFormsItems}
          loadingProps={loadingConfig}
          paginationProps={paginationProps}
          emptyStateProps={{
            isEmpty: !!isEmpty,
            emptyConfig: emptyConfig,
            isEmptySearch: !!isEmptySearch,
            emptySearchConfig: emptyConfig,
          }}
        />
      )}

      {currentInlineAction === "archive" &&
      selectedFormId &&
      selectedFormName ? (
        <DisableFormModal
          isOpen
          formId={selectedFormId}
          formName={selectedFormName}
          onClose={handleCloseModal}
          onDisableSuccess={refreshCustomForms}
          onRestoreSuccess={refreshCustomForms}
        />
      ) : null}

      {currentInlineAction === "duplicate" &&
      selectedFormId &&
      selectedFormName ? (
        <DuplicateFormModal
          isOpen
          formId={selectedFormId}
          formName={selectedFormName}
          onClose={handleCloseModal}
          onSuccess={resetCustomForms}
        />
      ) : null}
    </>
  );
};
