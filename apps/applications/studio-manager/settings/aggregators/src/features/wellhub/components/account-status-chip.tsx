import type { FC } from "react";

import type { PartnershipAccountStatus } from "@bsport/api-book";
import { Chip, type ChipProps } from "@bsport/kaizen-primitive-core";
import type { IconName } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const STATUS_CONFIG: Record<
  PartnershipAccountStatus,
  {
    color: ChipProps["color"];
    iconLeft: IconName;
    translationKey:
      | "wellhub.table.status.active"
      | "wellhub.table.status.pending"
      | "wellhub.table.status.deactivated";
  }
> = {
  active: {
    color: "positive",
    iconLeft: "check-circle",
    translationKey: "wellhub.table.status.active",
  },
  pending: {
    color: "warning",
    iconLeft: "hourglass-03",
    translationKey: "wellhub.table.status.pending",
  },
  deactivated: {
    color: "critical",
    iconLeft: "x-circle-solid",
    translationKey: "wellhub.table.status.deactivated",
  },
};

type AccountStatusChipProps = {
  status: PartnershipAccountStatus;
};

export const AccountStatusChip: FC<AccountStatusChipProps> = ({ status }) => {
  const { t } = useTranslation("common");
  const { color, iconLeft, translationKey } = STATUS_CONFIG[status];

  return (
    <Chip
      color={color}
      iconLeft={iconLeft}
      label={t(translationKey)}
      size="lg"
      type="weak"
    />
  );
};
