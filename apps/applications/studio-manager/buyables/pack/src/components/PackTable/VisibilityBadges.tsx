import React from "react";

import { useTranslation } from "#src/utils/i18n";

import { VisibilityBadge } from "./VisibilityBadge";

type VisibilityBadgesProps = {
  hiddenForUsers: boolean;
  hiddenForStaff: boolean;
  limitedTime: boolean;
};

export const VisibilityBadges: React.FC<VisibilityBadgesProps> = ({
  hiddenForUsers,
  hiddenForStaff,
  limitedTime,
}) => {
  const { t } = useTranslation("list");

  return (
    <div className="flex flex-row gap-2xs">
      {hiddenForUsers && (
        <VisibilityBadge
          tooltip={t("table.tooltips.unavailableForUsers")}
          icon="package-x"
        />
      )}
      {hiddenForStaff && (
        <VisibilityBadge
          tooltip={t("table.tooltips.invisibleForStaff")}
          icon="eye-off"
        />
      )}
      {limitedTime && (
        <VisibilityBadge
          tooltip={t("table.tooltips.availableForALimitedTime")}
          icon="clock-stopwatch"
        />
      )}
    </div>
  );
};
