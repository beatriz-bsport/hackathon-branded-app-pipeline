import type { FC } from "react";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { InsightsBanner } from "#src/components/Banner";
import { ExploreSection } from "#src/components/ExploreSection";
import { Header } from "#src/components/Header";
import { InsightsPanel } from "#src/components/InsightsPanel";
import { KeyMetrics } from "#src/components/KeyMetrics";
import { UpcomingActivities } from "#src/components/UpcomingActivities";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("default");
  return (
    <DetailsLayout>
      <DetailsLayout.Header pageTitle={t("pageTitle")} />
      <DetailsLayout.Content className="pt-md pb-xl px-md md:px-lg gap-xl flex flex-col overflow-x-hidden">
        <section className="flex flex-col gap-lg w-full">
          <Header />
          <InsightsBanner />
        </section>
        <KeyMetrics />
        <UpcomingActivities />
        <InsightsPanel />
        <ExploreSection />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export default ListPage;
