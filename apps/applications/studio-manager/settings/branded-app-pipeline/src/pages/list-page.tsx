import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { OnboardingTracker } from "#src/features/onboarding-tracker/components/onboarding-tracker";
// TODO(restore before commit): re-enable the feature flag gate below
// import { BrandedAppPipelineFlags, useBrandedAppPipelineFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pageTitle")} />
      <ListLayout.Content>
        {/* TODO(remove before commit): temporarily forcing render to preview locally without Unleash */}
        <OnboardingTracker />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
