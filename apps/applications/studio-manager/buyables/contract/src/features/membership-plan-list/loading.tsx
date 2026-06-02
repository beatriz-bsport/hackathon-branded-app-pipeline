import type { FC } from "react";

import { useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { MembershipPlanMobileList } from "./membership-plan-mobile-list";
import { MembershipPlanTable } from "./membership-plan-table";
import type { MembershipPlanListProps } from "./types";

/**
 * Loading skeleton for the membership plan list, meant to be used as the
 * suspense boundary fallback. Renders the table on desktop and the list on
 * mobile so the transition into the loaded state is seamless.
 */
export const MembershipPlanListLoading: FC = () => {
  const { t } = useTranslation("contract-details");
  const isMobile = !useMatchMedia("sm");

  const sharedProps: MembershipPlanListProps = {
    rows: [],
    isEmpty: false,
    emptyConfig: {},
    loadingProps: {
      isLoading: true,
      message: t("overview.membershipPlanList.loading"),
    },
  };

  return isMobile ? (
    <MembershipPlanMobileList {...sharedProps} />
  ) : (
    <MembershipPlanTable {...sharedProps} />
  );
};
