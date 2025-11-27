import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  DATETIME_FORMATS,
  useFormatDatetime,
} from "@bsport/datetime-formatting";
import type {
  ActionButton,
  ListItemProps,
} from "@bsport/kaizen-primitive-core";
import type { PurchasedPack } from "@bsport/store-buyables-pack";

import { useNavigateToInvoice } from "#src/hooks/useNavigateToInvoice";
import { useTranslation } from "#src/utils/i18n";

import type { TableRowData } from "./types";
import {
  getNavigateToInvoiceButtonId,
  getNavigateToMemberButtonId,
  navigateToMemberDetails,
  useActionPermissions,
} from "./utils";

/**
 * Format rows
 * - as list items for mobile view
 * - as table rows for desktop view
 */
export const usePurchasedPackRows = (purchasedPacks: PurchasedPack[]) => {
  const { formatDateTime } = useFormatDatetime();
  const { hasInvoiceAccess, hasMemberAccess } = useActionPermissions();
  const { t, i18n } = useTranslation("details");
  const { isLoading: isLoadingInvoice, navigateToInvoiceDetails } =
    useNavigateToInvoice();

  const rows: Array<TableRowData> = purchasedPacks.map((item) => {
    const {
      first_name,
      last_name,
      id: memberId,
      name: memberName,
      photo,
    } = item.member ?? {};

    const initials =
      `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

    return {
      id: `purchased-pack-${item.id}`,
      appointmentPassIds: item.private_consumer_passes,
      passIds: item.consumer_payment_packs,
      webshopItemIds: item.provision_updates,
      issueDate: formatDateTime(item.date, DATETIME_FORMATS.FULL_DATETIME, {
        locale: i18n.language,
      }),
      issueDateShort: formatDateTime(
        item.date,
        DATETIME_FORMATS.MEDIUM_DATETIME,
        { locale: i18n.language },
      ),
      member: {
        id: memberId,
        name: memberName,
        initials: initials,
        avatar: photo,
      },
      price: getCurrencyDisplayWithPrice(parseFloat(item.price)),
    };
  });

  const getMobileRows = (): ListItemProps[] => {
    const items: ListItemProps[] = rows.map((item) => {
      const buttons: ActionButton[] = [];

      const buttonBaseConfig = {
        size: "md",
        color: "default",
        intent: "flat",
      } as const;

      if (hasInvoiceAccess) {
        buttons.push({
          id: getNavigateToInvoiceButtonId(item.id),
          label: t("overviewPage.table.actions.invoice"),
          onClick: () => navigateToInvoiceDetails(item),
          disabled: isLoadingInvoice,
          ...buttonBaseConfig,
        });
      }

      if (hasMemberAccess) {
        buttons.push({
          id: getNavigateToMemberButtonId(item.id),
          label: t("overviewPage.table.actions.memberProfile"),
          onClick: () => navigateToMemberDetails(item.member.id),
          ...buttonBaseConfig,
        });
      }

      return {
        id: item.id,
        title: item.member.name,
        description: `${item.price}, ${item.issueDateShort}`,
        buttons,
        dropdownConfig: { visibleActionsDisplayLimit: 0 },
      };
    });

    return items;
  };

  return {
    rows,
    getMobileRows,
  };
};
