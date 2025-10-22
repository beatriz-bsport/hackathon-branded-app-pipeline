import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

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
    <ListLayout>
      <ListLayout.Header pageTitle={t("pageTitle")} />
      <ListLayout.Content className="py-md px-lg gap-xl flex flex-col">
        <section className="flex flex-col gap-lg">
          <Header />
          <InsightsBanner />
        </section>
        <KeyMetrics />
        <UpcomingActivities />
        <InsightsPanel />
        <ExploreSection />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
