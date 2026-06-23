import { type FC, useState } from "react";

import type { Contract } from "@bsport/api-buyables/contract";
import type { ContractPause } from "@bsport/api-buyables/contract-pause";
import {
  List,
  type PaginationProps,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { QueryBoundary } from "#src/components/query-boundary";
import { ContractPauseModal } from "#src/features/contract-pause-modal/contract-pause-modal";
import { useContractPausesSuspenseQuery } from "#src/hooks/api/use-contract-pauses-query";
import { useListItemDetailDrawer } from "#src/hooks/layout/use-list-item-detail-drawer";
import { useTranslation } from "#src/utils/i18n";

import { CancelContractPauseModal } from "./cancel-pause-modal";
import { ContractPauseDetailDrawer } from "./contract-pause-detail-drawer";
import { useContractPauseListRows } from "./rows";

type ContractPauseListProps = { contract: Contract };

const ContractPauseListInner: FC<ContractPauseListProps> = ({ contract }) => {
  const { t } = useTranslation("contract-features");

  const [pauseToEdit, setPauseToEdit] = useState<ContractPause | null>(null);
  const [pauseToCancel, setPauseToCancel] = useState<number | null>(null);

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const { data } = useContractPausesSuspenseQuery({
    contract: contract.id,
    page: currentPage,
    page_size: currentPageSize,
  });

  const { onItemClick, selectedItem, ...detailDrawerParams } =
    useListItemDetailDrawer<ContractPause>(data.results);

  const rows = useContractPauseListRows({
    contractPauses: data.results,
    onEditClick: setPauseToEdit,
    onCancelClick: setPauseToCancel,
    onItemClick,
    selectedItem,
  });

  const paginationProps: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems: data.count,
    onPageSettingsChange: (page, pageSize) => {
      if (pageSize !== currentPageSize) {
        setPageSettings(DEFAULT_PAGE, pageSize);
      } else {
        setPageSettings(page, pageSize);
      }
    },
    showRowsPerPageSelector: true,
  };

  const emptyConfig: UseEmptyStateProps = {
    isEmpty: data.count === 0,
    emptyConfig: {
      title: t("pauseList.empty"),
    },
  };

  return (
    <>
      <List
        id="contract-pause-list"
        emptyStateProps={emptyConfig}
        paginationProps={paginationProps}
        items={rows}
        className={emptyConfig.isEmpty ? "my-auto" : ""}
      />

      <ContractPauseModal
        // Remount when changing pause to reset the internal form state
        key={
          pauseToEdit ? `edit-pause-${pauseToEdit.id}` : "initial-pause-modal"
        }
        contractId={contract.id}
        contractName={contract.name}
        closeModal={() => setPauseToEdit(null)}
        isOpen={pauseToEdit != null}
        initial={
          pauseToEdit
            ? {
                fromDate: pauseToEdit.from_date,
                untilDate: pauseToEdit.until_date,
                name: pauseToEdit.name,
                pauseId: pauseToEdit.id,
              }
            : undefined
        }
      />

      <CancelContractPauseModal
        closeModal={() => setPauseToCancel(null)}
        contractId={contract.id}
        contractPauseId={pauseToCancel}
        isOpen={pauseToCancel != null}
      />

      <ContractPauseDetailDrawer
        {...detailDrawerParams}
        selectedItem={selectedItem}
      />
    </>
  );
};

export const ContractPauseList: FC<ContractPauseListProps> = ({ contract }) => {
  const { t } = useTranslation("contract-features");
  return (
    <QueryBoundary
      loadingFallback={
        <List
          items={[]}
          id="contract-pause-list-loading"
          loadingProps={{ isLoading: true, message: t("pauseList.loading") }}
          className="my-auto"
        />
      }
    >
      <ContractPauseListInner contract={contract} />
    </QueryBoundary>
  );
};
