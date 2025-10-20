import type { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import { PUBLIC_URLS } from "#src/urls";
import { getAssetUrl } from "#src/utils/assets";
import { useTranslation } from "#src/utils/i18n";

import { ExploreCard } from "./ExploreCard";

export const ExploreSection: FC = () => {
  const { t, i18n } = useTranslation("default");

  return (
    <section
      className={[
        "flex justify-start items-stretch gap-md",
        "max-lg:flex-col",
        "lg:flex-row",
      ].join(" ")}
    >
      <div className="flex-1">
        <Title htmlVariant="h2" weight="strong" className="mb-md">
          {t("exploreSection.exploreThePlatform.title")}
        </Title>
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
      </div>

      <div className="flex-1">
        <Title htmlVariant="h2" weight="strong" className="mb-md">
          {t("exploreSection.advices.title")}
        </Title>
        <ExploreCard
          link={PUBLIC_URLS.BLOG(i18n.language)}
          imageUrl={getAssetUrl("logo-blog.png")}
          title={t("exploreSection.advices.latestNewsCard.title")}
          description={t("exploreSection.advices.latestNewsCard.description")}
        />
      </div>
    </section>
  );
};
