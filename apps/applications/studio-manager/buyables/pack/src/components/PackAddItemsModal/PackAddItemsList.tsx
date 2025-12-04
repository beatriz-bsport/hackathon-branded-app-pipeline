import React from "react";

import { List } from "@bsport/kaizen-primitive-core";

import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import { useGetListItemConfig } from "#src/hooks/useGetListItemConfig";
import { type VariantAndData, formatData } from "#src/utils/stores-interface";

type PackAddItemsListProps = {
  fieldIdPrefix: string;
  listConfig: {
    page: number;
    pageSize?: number;
    setPage?: (nextPage: number) => void;
    setPageSize?: (nextPageSize: number) => void;
    total: number;
    isLoading: boolean;
  };
} & VariantAndData;

export const PackAddItemsList: React.FC<PackAddItemsListProps> = ({
  fieldIdPrefix,
  listConfig,
  variant,
  data,
}) => {
  const {
    preselectedItems,
    setPreselectedItems,
    removePreselectedItem,
    addPreselectedItem,
  } = useSelectedItemsContext();

  const getItem = useGetListItemConfig({
    variant,
    getExtraConfig: (data) => {
      return {
        rightTitle: data.price,
        onItemClick: () => {
          if (preselectedItems.includes(data.id)) {
            removePreselectedItem({ id: data.id });
          } else {
            addPreselectedItem({ id: data.id });
          }
        },
        onCheckboxChange: (checked) => {
          if (checked) {
            addPreselectedItem({ id: data.id });
          } else {
            removePreselectedItem({ id: data.id });
          }
        },
        className: "hover:cursor-pointer",
      };
    },
  });

  const params = { variant, data } as VariantAndData;
  const formattedData = formatData(params);

  return (
    <List
      id={`${fieldIdPrefix}-items`}
      items={formattedData.map(getItem)}
      isSelectable
      checkedIds={preselectedItems.map((id) => String(id))}
      setCheckedIds={setPreselectedItems}
      loadingProps={{
        isLoading: listConfig.isLoading,
      }}
      paginationProps={{
        currentPage: listConfig.page,
        rowsPerPage: listConfig.pageSize,
        totalItems: listConfig.total,
        onPageChange: listConfig.setPage,
        onRowsPerPageChange: listConfig.setPageSize,
        showRowsPerPageSelector: false,
      }}
    />
  );
};
