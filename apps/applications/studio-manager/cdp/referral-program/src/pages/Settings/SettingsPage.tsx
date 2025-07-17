import { useEffect } from "react";

import {
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { ReferralProgramForm } from "#src/components/Settings/ReferralProgramForm";
import { ReferralProgramHelper } from "#src/components/Settings/ReferralProgramHelper";
import { useUpdateReferralProgram } from "#src/hooks/actions/useUpdateReferralProgram";
import { useFetchCompanyReferralProgram } from "#src/hooks/api/use-fetch-referral-program";
import { useCompanyData } from "#src/hooks/layout/useCompanyData";
import { useTranslation } from "#src/utils/i18n";
import { ReferralProgramFormData } from "#src/utils/types";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation("settings");
  const {
    companyCurrency,
    companyId,
    isReferralProgramActivated,
    headerBadgeConfiguration,
    setIsReferralProgramActivated,
  } = useCompanyData();
  const { detailsLayoutProps } = useDetailsLayout();
  const { isLoading, referralProgram, fetchReferralProgram } =
    useFetchCompanyReferralProgram();
  const { updateReferralProgram } = useUpdateReferralProgram({
    onSuccess: () => {
      fetchReferralProgram();
    },
  });

  useEffect(() => {
    fetchReferralProgram();
  }, []);

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("title")}
        pageStatusBadge={headerBadgeConfiguration}
      />
      <DetailsLayout.Content>
        {companyId !== null &&
        isReferralProgramActivated !== null &&
        companyCurrency !== null &&
        !isLoading ? (
          <div className="flex flex-col gap-xl">
            <ReferralProgramHelper
              companyId={companyId}
              isProgramActivated={isReferralProgramActivated}
              onToggleSuccess={() =>
                setIsReferralProgramActivated((prev) => !prev)
              }
            />
            {isReferralProgramActivated ? (
              <ReferralProgramForm
                onSaveProgram={(data: ReferralProgramFormData) => {
                  updateReferralProgram({
                    companyId,
                    data,
                    referralProgramId: referralProgram.id,
                  });
                }}
                companyCurrency={companyCurrency}
                referralProgram={referralProgram}
              />
            ) : null}
          </div>
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
