import type { FC } from "react";

import { useTranslation } from "#src/utils/i18n";

import { VisibilityBadge } from "./VisibilityBadge";

type VisibilityBadgesProps = {
  hiddenToUsers: boolean;
  shared: boolean;
};

/**
 * Will be exported as a business component shared with Packs
 */
export const VisibilityBadges: FC<VisibilityBadgesProps> = ({
  hiddenToUsers,
  shared,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-row gap-2xs">
      {shared && null}
      {/* Uncomment when the Shared chip has been defined
        <VisibilityBadge
          icon="building-02"
          label={t("giftcardTable.values.shared")}
          tooltip={t("giftcardTable.tooltips.shared")}
        />
      )} */}
      {hiddenToUsers && (
        <VisibilityBadge
          icon="shopping-cart-cross"
          label={t("giftcardTable.values.unlisted")}
          tooltip={t("giftcardTable.tooltips.unlisted")}
        />
      )}
    </div>
  );
};
