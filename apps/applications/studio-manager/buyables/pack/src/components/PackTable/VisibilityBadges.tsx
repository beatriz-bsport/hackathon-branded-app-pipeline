import React from "react";

import { useTranslation } from "#src/utils/i18n";

import { VisibilityBadge } from "./VisibilityBadge";

type VisibilityBadgesProps = {
  hiddenToStaff: boolean;
  isMobile?: boolean;
  limitedTime: boolean;
  unlisted: boolean;
};

export const VisibilityBadges: React.FC<VisibilityBadgesProps> = ({
  hiddenToStaff,
  isMobile = false,
  limitedTime,
  unlisted,
}) => {
  const { t } = useTranslation("list");

  return (
    <div className="flex flex-row gap-2xs">
      {unlisted && (
        <VisibilityBadge
          icon="shopping-cart-cross"
          isMobile={isMobile}
          label={t("table.values.unlisted")}
          tooltip={t("table.tooltips.unlisted")}
        />
      )}
      {hiddenToStaff && (
        <VisibilityBadge
          icon="eye-off"
          isMobile={isMobile}
          label={t("table.values.hiddenToStaff")}
          tooltip={t("table.tooltips.hiddenToStaff")}
        />
      )}
      {limitedTime && (
        <VisibilityBadge
          icon="clock-stopwatch"
          isMobile={isMobile}
          label={t("table.values.limitedTime")}
          tooltip={t("table.tooltips.limitedTime")}
        />
      )}
    </div>
  );
};
