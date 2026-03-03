import type { FC } from "react";

import { Chip, ChipProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardPurchaseStatus } from "./types";

type GiftcardPurchaseStatusChipProps = {
  status: GiftcardPurchaseStatus;
};

export const GiftcardPurchaseStatusChip: FC<
  GiftcardPurchaseStatusChipProps
> = ({ status }) => {
  const { t } = useTranslation("giftcard-details");

  let label: string = "";
  let color: ChipProps["color"] = "default";

  switch (status) {
    case "active":
      label = t("purchases.status.active");
      color = "main";
      break;

    case "cancelled":
      label = t("purchases.status.cancelled");
      color = "critical";
      break;

    case "expired":
      label = t("purchases.status.expired");
      color = "warning";
      break;

    case "redeemed":
      label = t("purchases.status.redeemed");
      color = "info";
      break;

    case "unclaimed":
    default:
      label = t("purchases.status.unclaimed");
      color = "default";
      break;
  }

  return <Chip color={color} size="lg" type="weak" label={label} />;
};
