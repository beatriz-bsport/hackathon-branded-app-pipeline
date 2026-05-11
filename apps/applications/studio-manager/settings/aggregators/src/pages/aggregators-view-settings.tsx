import { type FC } from "react";

import { ListLayout, Loader } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { MyClubsSection } from "#src/features/myclubs/components/myclubs-section";
import { UscSection } from "#src/features/usc/components/usc-section";
import { WellhubSection } from "#src/features/wellhub/components/wellhub-section";
import { useTranslation } from "#src/utils/i18n";

const AggregatorsViewSettingsPage: FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("name")} />
      <ListLayout.Content className="pt-md pb-xl px-md md:px-lg gap-xl flex flex-col">
        <QueryBoundary
          loadingFallback={<Loader className="w-full h-full" size="xl" />}
        >
          <MyClubsSection />
          <WellhubSection />
          <UscSection />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default AggregatorsViewSettingsPage;
