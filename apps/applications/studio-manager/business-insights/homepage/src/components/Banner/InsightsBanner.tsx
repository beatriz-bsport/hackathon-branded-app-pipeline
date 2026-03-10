import type { FC } from "react";
import { useNavigate } from "react-router";

import insightsBannerUrl from "#src/assets/insights-banner.svg";
import { URLS } from "#src/urls";
import { NavFlags, useNavFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";

import { Banner } from "./Banner";

export const InsightsBanner: FC = () => {
  const { t } = useTranslation("default");
  const navigate = useNavigate();

  const isInsightsPageEnabled = useNavFlag(NavFlags.INSIGHTS_PAGE);

  if (!isInsightsPageEnabled) {
    return null;
  }

  return (
    <Banner
      ctaLabel={t("banner.insights.ctaLabel")}
      description={t("banner.insights.description")}
      identifier="insights"
      image={insightsBannerUrl}
      onCTAClick={() => navigate(URLS.INSIGHTS)}
      title={t("banner.insights.title")}
    />
  );
};
