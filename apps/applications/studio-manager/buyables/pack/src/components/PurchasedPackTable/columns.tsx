import {
  Avatar,
  Body,
  Button,
  DropdownMenu,
  type DropdownMenuItems,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { useNavigateToInvoice } from "#src/hooks/useNavigateToInvoice";
import { useTranslation } from "#src/utils/i18n";

import type { TableRowData } from "./types";
import {
  getNavigateToInvoiceButtonId,
  getNavigateToMemberButtonId,
  navigateToMemberDetails,
  useActionPermissions,
} from "./utils";

type TableColumn = GenericTableColumn<TableRowData>;

export const usePurchasedPackTableColumns = () => {
  const { t } = useTranslation("details");

  const { hasInvoiceAccess, hasMemberAccess } = useActionPermissions();

  const { navigateToInvoiceDetails } = useNavigateToInvoice();

  const columnDate: TableColumn = {
    id: "purchased-pack-column-issue-date",
    type: "string",
    align: "start",
    keyPath: "issueDate",
    header: t("overviewPage.table.columns.issueDate"),
  };

  const columnMember: TableColumn = {
    id: "purchased-pack-column-member",
    type: "custom",
    align: "start",
    keyPath: "",
    header: t("overviewPage.table.columns.buyer"),
    render: (row) => (
      <div className="flex flex-row gap-sm items-center">
        <Avatar
          shape="round"
          src={row.member.avatar}
          alt={row.member.name}
          initials={row.member.initials}
          size="md"
        />
        <Body
          htmlVariant="p"
          size="md"
          className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {row.member.name}
        </Body>
      </div>
    ),
  };

  const columnPrice: TableColumn = {
    id: "purchased-pack-column-price",
    type: "string",
    align: "center",
    keyPath: "price",
    header: t("overviewPage.table.columns.value"),
  };

  const columnActions: TableColumn = {
    id: "purchased-pack-column-actions",
    type: "custom",
    align: "center",
    header: "",
    render: (row) => {
      const items: DropdownMenuItems = [
        {
          type: "title",
          label: t("overviewPage.table.actions.openPrefix"),
        },
      ];

      const buttonInvoiceId = getNavigateToInvoiceButtonId(row.id);
      if (hasInvoiceAccess) {
        items.push({
          id: buttonInvoiceId,
          label: t("overviewPage.table.actions.invoice"),
        });
      }

      const buttonMemberId = getNavigateToMemberButtonId(row.id);
      if (hasMemberAccess) {
        items.push({
          id: buttonMemberId,
          label: t("overviewPage.table.actions.memberProfile"),
        });
      }

      return (
        <DropdownMenu
          items={items}
          onSelectOption={({ id, setIsPopoverOpened }) => {
            if (id === buttonMemberId) {
              navigateToMemberDetails(row.member.id);
            }

            if (id === buttonInvoiceId) {
              const { appointmentPassIds, passIds, webshopItemIds } = row;
              navigateToInvoiceDetails({
                appointmentPassIds,
                passIds,
                webshopItemIds,
              });
            }

            setIsPopoverOpened(false);
          }}
          placement="bottom-right"
          target={({ setIsPopoverOpened }) => (
            <Button
              kind="icon-button"
              intent="flat"
              icon="dots-vertical"
              onClick={() => setIsPopoverOpened(true)}
              color="default"
              label="open-menu-link-selector"
              size="md"
            />
          )}
        />
      );
    },
  };

  const columns = [columnDate, columnMember, columnPrice];

  if (hasMemberAccess || hasInvoiceAccess) {
    columns.push(columnActions);
  }

  return columns;
};
