import React, { useMemo } from "react";
import {
  Body,
  Loader,
  Table,
  type TableProps,
} from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";
import type { Giftcard } from "#src/features/api";
import {
  getTableColumns,
  type GetTableColumnsParams,
} from "./giftcard-columns";
import type { TableRowData } from "./constants";
import classNames from "classnames";

type GiftcardTableProps = Omit<GetTableColumnsParams, "t"> & {
  giftcardList: Array<Giftcard>;
  paginationProps: TableProps<TableRowData>["paginationProps"];
  isLoading?: boolean;
  isEmpty?: boolean;
  onAddGiftcardClick?: () => void;
};

export const GiftcardTable: React.FC<GiftcardTableProps> = ({
  giftcardList,
  handleArchive,
  handleDuplicate,
  handleRestore,
  mode,
  paginationProps,
  isLoading,
  isEmpty,
  onAddGiftcardClick,
}) => {
  const { t } = useTranslation("common");

  const tableColumns = useMemo(
    () =>
      getTableColumns({
        handleArchive,
        handleDuplicate,
        handleRestore,
        mode,
        t,
      }),
    [mode],
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-md">
        <Loader size="xl" />
        <Body htmlVariant="p">{t("giftcardTable.loading")}</Body>
      </div>
    );
  }

  // Format giftcards to match GiftcardTable data
  const tableRows = giftcardList.map((giftcard) => ({
    id: giftcard.id,
    iconSrc: giftcard.cover,
    isShared: giftcard.is_shared_giftcard,
    isUnavailable: giftcard.manager_only, // TODO : What field corresponds to unavailable ?
    name: giftcard.name,
    price: `$${giftcard.price}`, // TODO : use util to get right currency display
    validity: giftcard.expiration_days
      ? t("giftcardTable.values.expireInXDays", {
          expiration: giftcard.expiration_days,
        })
      : "Unlimited",
  }));

  // Configure empty state based on the mode
  const emptyConfig =
    mode === "archived"
      ? {
          title: t("archivedListPage.empty.title"),
        }
      : {
          title: t("listPage.empty.title"),
          subtitle: t("listPage.empty.subtitle"),
          ctaButtonConfig: {
            label: t("listPage.header.buttons.addGiftcard"),
            iconLeft: "plus" as const,
            onClick: onAddGiftcardClick,
          },
        };

  return (
    <div
      className={classNames("w-full h-full flex flex-col flex-1", {
        "max-w-[320px]": !!isEmpty,
      })}
    >
      <Table
        columns={tableColumns}
        rowHeight="sm"
        rows={tableRows}
        paginationProps={paginationProps}
        emptyStateProps={{
          isEmpty: !!isEmpty,
          emptyConfig: emptyConfig,
        }}
      />
    </div>
  );
};
