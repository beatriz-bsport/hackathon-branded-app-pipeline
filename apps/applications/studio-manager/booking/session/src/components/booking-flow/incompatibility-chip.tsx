import { useQuery } from "@tanstack/react-query";
import { type FC, useMemo, useState } from "react";

import {
  IncompatibilityErrorCode,
  incompatibilityReasonsQueryOptions,
} from "@bsport/api-buyables";
import { Chip } from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const INCOMPATIBILITY_ERROR_CODES = [
  IncompatibilityErrorCode.ACTIVITY_INCOMPATIBLE,
  IncompatibilityErrorCode.SCT_INCOMPATIBLE,
  IncompatibilityErrorCode.ESTABLISHMENT_INCOMPATIBLE,
  IncompatibilityErrorCode.CAN_NOT_BOOK_ENOUGH_CREDIT,
  IncompatibilityErrorCode.DATES_NOT_COMPATIBLE,
  IncompatibilityErrorCode.LATER_FIRST_BOOKING,
  IncompatibilityErrorCode.LATER_FIRST_ATTENDANCE,
  IncompatibilityErrorCode.HAS_EXPIRED,
  IncompatibilityErrorCode.CAN_NOT_BOOK_DISABLED,
  IncompatibilityErrorCode.INCOMPATIBLE_WITH_OFF_PEAK_SCHEDULE,
  IncompatibilityErrorCode.CAN_NOT_BOOK_MAXOUT_DAY,
  IncompatibilityErrorCode.CAN_NOT_BOOK_MAXOUT_WEEK,
  IncompatibilityErrorCode.CAN_NOT_BOOK_MAXOUT_MONTH,
  IncompatibilityErrorCode.CAN_NOT_BOOK_MAXOUT_YEAR,
] as const;

type IncompatibilityErrorCodeType =
  (typeof INCOMPATIBILITY_ERROR_CODES)[number];

const isKnownCode = (
  code: IncompatibilityErrorCode,
): code is IncompatibilityErrorCodeType =>
  (INCOMPATIBILITY_ERROR_CODES as readonly IncompatibilityErrorCode[]).includes(
    code,
  );

export const IncompatibilityChip: FC<{
  consumerPaymentPackId: number;
  sessionId: number;
}> = ({ consumerPaymentPackId, sessionId }) => {
  const { t } = useTranslation("sessionManagement");
  const [hovered, setHovered] = useState(false);

  const { data } = useQuery({
    ...incompatibilityReasonsQueryOptions(
      fetch,
      consumerPaymentPackId,
      sessionId,
    ),
    enabled: hovered,
    staleTime: 10 * 60 * 1000, // 10 minutes, as the incompatibility reasons are unlikely to change often
  });

  const reasons = useMemo(() => {
    if (!data) return [];
    return Object.values(data.incompatibilities_to_offer)
      .flat()
      .map((code) =>
        isKnownCode(code)
          ? t(`bookingFlow.incompatibilities.${code}`)
          : t("bookingFlow.incompatibilities.generic"),
      );
  }, [data, t]);

  // TODO: Add a loader in the tooltip
  const tooltipLabel = reasons.length > 0 ? reasons.join("; ") : "...";

  return (
    <div
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <ResponsiveTooltip label={tooltipLabel} placement="bottom">
        <Chip
          type="weak"
          color="default"
          size="lg"
          label={t("bookingFlow.passSelection.incompatible")}
          iconLeft="slash-circle-01"
        />
      </ResponsiveTooltip>
    </div>
  );
};
