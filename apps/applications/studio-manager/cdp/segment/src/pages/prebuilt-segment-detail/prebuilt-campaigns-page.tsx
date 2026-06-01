import { useState } from "react";
import { useOutletContext } from "react-router";

import { Button, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { CampaignSentList } from "#src/components/CampaignSentList/CampaignSentList";
import { CampaignTypeSelectorModal } from "#src/components/CampaignTypeSelector/CampaignTypeSelectorModal";
import { usePrebuiltCampaignTypeOptions } from "#src/components/CampaignTypeSelector/use-campaign-type-options";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { useTranslation } from "#src/utils/i18n";

import {
  type PrebuiltSegmentDetailOutletContext,
  PrebuiltSegmentTabLayout,
} from "./prebuilt-segment-detail-page";

const CAMPAIGN_TYPE_SELECTOR_ACTION_ID = "campaign-type-selector" as const;

export const PrebuiltCampaignsPage = () => {
  const { t } = useTranslation(["list", "campaign"]);
  const isMobile = !useMatchMedia("md");
  const { prebuiltSegmentId } =
    useOutletContext<PrebuiltSegmentDetailOutletContext>();
  const [inlineAction, setInlineAction] = useState<
    typeof CAMPAIGN_TYPE_SELECTOR_ACTION_ID | null
  >(null);

  const campaignTypeOptions = usePrebuiltCampaignTypeOptions({
    prebuiltSegmentId,
  });

  return (
    <PrebuiltSegmentTabLayout
      layout="details"
      prebuiltSegmentId={prebuiltSegmentId}
    >
      <div className="flex flex-col gap-md">
        <div className="flex justify-end">
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
        </div>
        <QueryBoundary>
          <CampaignSentList
            segmentIdentifier={prebuiltSegmentId}
            emptyStateDescription={t(
              "prebuilt.details.campaigns.emptyState.description",
              { ns: "list" },
            )}
          />
        </QueryBoundary>
        {inlineAction === CAMPAIGN_TYPE_SELECTOR_ACTION_ID ? (
          <CampaignTypeSelectorModal
            isOpen
            onClose={() => setInlineAction(null)}
            campaignTypeOptions={campaignTypeOptions}
          />
        ) : null}
      </div>
    </PrebuiltSegmentTabLayout>
  );
};

export default PrebuiltCampaignsPage;
