import type { FC } from "react";

import type { PartnershipAccountStatus } from "@bsport/api-book";
import { Chip, type ChipProps } from "@bsport/kaizen-primitive-core";
import type { IconName } from "@bsport/kaizen-primitive-core";

import type { AggregatorNamespace } from "#src/features/partnership-aggregator/types";
import { type TFunction, useTranslation } from "#src/utils/i18n";

const STATUS_CONFIG: Record<
  PartnershipAccountStatus,
  { color: ChipProps["color"]; iconLeft: IconName }
> = {
  active: { color: "positive", iconLeft: "check-circle" },
  pending: { color: "warning", iconLeft: "hourglass-03" },
  deactivated: { color: "critical", iconLeft: "x-circle-solid" },
};

const STATUS_LABEL_KEYS = {
  myclubs: {
    active: "myclubs.table.status.active",
    pending: "myclubs.table.status.pending",
    deactivated: "myclubs.table.status.deactivated",
  },
  wellhub: {
    active: "wellhub.table.status.active",
    pending: "wellhub.table.status.pending",
    deactivated: "wellhub.table.status.deactivated",
  },
  usc: {
    active: "usc.table.status.active",
    pending: "usc.table.status.pending",
    deactivated: "usc.table.status.deactivated",
  },
} as const satisfies Record<
  AggregatorNamespace,
  Record<PartnershipAccountStatus, Parameters<TFunction>[0]>
>;

type AccountStatusChipProps = {
  status: PartnershipAccountStatus;
  namespace: AggregatorNamespace;
};

export const AccountStatusChip: FC<AccountStatusChipProps> = ({
  status,
  namespace,
}) => {
  const { t } = useTranslation("common");
  const { color, iconLeft } = STATUS_CONFIG[status];

  return (
    <Chip
      color={color}
      iconLeft={iconLeft}
      label={t(STATUS_LABEL_KEYS[namespace][status])}
      size="lg"
      type="weak"
    />
  );
};
