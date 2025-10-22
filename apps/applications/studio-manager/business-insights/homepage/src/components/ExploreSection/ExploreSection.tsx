import type { FC } from "react";

import { HomepageSection } from "#src/components/HomepageSection";
import { PUBLIC_URLS } from "#src/urls";
import { getAssetUrl } from "#src/utils/assets";
import { useTranslation } from "#src/utils/i18n";

import { ExploreCard } from "./ExploreCard";

export const ExploreSection: FC = () => {
  const { t, i18n } = useTranslation("default");

  return (
    <div
      className={[
        "flex justify-start items-stretch",
        "max-lg:flex-col max-lg:gap-xl",
        "lg:flex-row lg:gap-md",
      ].join(" ")}
    >
      <HomepageSection
        title={t("exploreSection.exploreThePlatform.title")}
        className="flex-1"
      >
        <ExploreCard
          link={PUBLIC_URLS.PRODUCT_UPDATES}
          imageUrl={getAssetUrl("logo-bsport.png")}
          title={t(
            "exploreSection.exploreThePlatform.productUpdatesCard.title",
          )}
          description={t(
            "exploreSection.exploreThePlatform.productUpdatesCard.description",
          )}
        />
      </HomepageSection>

      <HomepageSection
        title={t("exploreSection.advices.title")}
        className="flex-1"
      >
        <ExploreCard
          link={PUBLIC_URLS.BLOG(i18n.language)}
          imageUrl={getAssetUrl("logo-blog.png")}
          title={t("exploreSection.advices.latestNewsCard.title")}
          description={t("exploreSection.advices.latestNewsCard.description")}
        />
      </HomepageSection>
    </div>
  );
};
