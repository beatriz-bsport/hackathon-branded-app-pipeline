import type { FC } from "react";
import { useNavigate } from "react-router";
import { REVAMP_URLS_DEVELOPMENT } from "sm-navigation-sidebar/urls";

import { Banner } from "#src/components/Banner";
import { getAssetUrl } from "#src/utils/assets";
import { NavFlags, useNavFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";

export const InsightsBanner: FC = () => {
  const { t } = useTranslation("default");
  const navigate = useNavigate();

  // Same URL regardless of the environment
  const insightsUrl = REVAMP_URLS_DEVELOPMENT.insights;

  const isInsightsPageEnabled = useNavFlag(NavFlags.INSIGHTS_PAGE);

  if (!isInsightsPageEnabled || !insightsUrl) {
    return null;
  }

  return (
    <Banner
      ctaLabel={t("banner.insights.ctaLabel")}
      description={t("banner.insights.description")}
      identifier="insights"
      image={getAssetUrl("insights-banner.svg")}
      onCTAClick={() => navigate(insightsUrl)}
      title={t("banner.insights.title")}
    />
  );
};
