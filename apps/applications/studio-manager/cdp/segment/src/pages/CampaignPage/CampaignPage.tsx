import { useState } from "react";
import { useOutletContext, useParams } from "react-router";

import { Button, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { CampaignScheduledList } from "#src/components/CampaignScheduledList/CampaignScheduledList";
import { CampaignSentList } from "#src/components/CampaignSentList/CampaignSentList";
import { CampaignTypeSelectorModal } from "#src/components/CampaignTypeSelector/CampaignTypeSelectorModal";
import { useCampaignTypeOptions } from "#src/components/CampaignTypeSelector/use-campaign-type-options";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { useCampaignGenerationReport } from "#src/hooks/use-campaign-generation-report";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { SmartlistHeaderActionDropdown } from "#src/pages/DetailsPage/SmartlistHeaderActionDropdown";
import type { DetailsPageOutletContext } from "#src/pages/DetailsPage/details-page-outlet-context";
import { SmartlistTabLayout } from "#src/pages/DetailsPage/smartlist-tab-layout";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

const LEGACY_POPUP_SETTINGS = "/settings/mobile-personalisation/popups";
const CAMPAIGN_TYPE_SELECTOR_ACTION_ID = "campaign-type-selector" as const;

export const CampaignPage = () => {
  const { t } = useTranslation(["details", "campaign"]);
  const isMobile = !useMatchMedia("md");
  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");
  const { smartlistId } = useOutletContext<DetailsPageOutletContext>();
  const { navigateToSmartlistCampaignSentDetails } = useSmartlistNavigation();
  const campaignTypeOptions = useCampaignTypeOptions({ smartlistId });
  const { openReportModal, reportModal } = useCampaignGenerationReport({
    smartlistId: id,
  });
  const [inlineAction, setInlineAction] = useState<
    typeof CAMPAIGN_TYPE_SELECTOR_ACTION_ID | null
  >(null);

  return (
    <SmartlistTabLayout
      layout="details"
      smartlistId={smartlistId}
      endGroupActions={[
        <SmartlistHeaderActionDropdown
          key="campaign-page-header-actions"
          onGenerateReport={openReportModal}
        />,
      ]}
      callToActionButton={
        <Button
          color="main"
          intent="call-to-action"
          label={
            isMobile ? "" : t("actions.createCampaign", { ns: "campaign" })
          }
          aria-label={t("actions.createCampaign", { ns: "campaign" })}
          iconLeft="plus"
          size="md"
          onClick={() => setInlineAction(CAMPAIGN_TYPE_SELECTOR_ACTION_ID)}
        />
      }
    >
      <div className="flex flex-col gap-md">
        <QueryBoundary>
          <CampaignScheduledList />
        </QueryBoundary>
        <QueryBoundary>
          <CampaignSentList
            smartlistId={id}
            onRowClick={({ campaign }) =>
              navigateToSmartlistCampaignSentDetails(id, campaign.uuid)
            }
            onOpenPopUpsClick={() => {
              window.location.href = LEGACY_POPUP_SETTINGS;
            }}
          />
        </QueryBoundary>
      </div>
      {reportModal}
      {inlineAction === CAMPAIGN_TYPE_SELECTOR_ACTION_ID ? (
        <CampaignTypeSelectorModal
          isOpen
          onClose={() => setInlineAction(null)}
          campaignTypeOptions={campaignTypeOptions}
        />
      ) : null}
    </SmartlistTabLayout>
  );
};
