import {
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { ReferralProgramHelper } from "#src/components/Settings/ReferralProgramHelper";
import { useCompanyData } from "#src/hooks/layout/useCompanyData";
import { useTranslation } from "#src/utils/i18n";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation("settings");
  const {
    companyId,
    isReferralProgramActivated,
    headerBadgeConfiguration,
    setIsReferralProgramActivated,
  } = useCompanyData();
  const { detailsLayoutProps } = useDetailsLayout();

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("title")}
        pageStatusBadge={headerBadgeConfiguration}
      />
      <DetailsLayout.Content>
        {companyId !== null && isReferralProgramActivated !== null ? (
          <ReferralProgramHelper
            companyId={companyId}
            isProgramActivated={isReferralProgramActivated}
            onToggleSuccess={() =>
              setIsReferralProgramActivated((prev) => !prev)
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Loader size="md" />
          </div>
        )}
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export default SettingsPage;
