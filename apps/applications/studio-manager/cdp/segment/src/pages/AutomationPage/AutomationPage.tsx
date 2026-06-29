import { useState } from "react";
import { Outlet, useOutletContext } from "react-router";

import { Button, Title, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { CreateAutomationModal } from "#src/components/CreateAutomationModal";
import { CardLoader, QueryBoundary } from "#src/components/QueryBoundary";
import { AutomationInfoPopover } from "#src/components/SmartlistDetailHeaderActions/AutomationInfoPopover";
import { useCampaignGenerationReport } from "#src/hooks/use-campaign-generation-report";
import { SmartlistHeaderActionDropdown } from "#src/pages/DetailsPage/SmartlistHeaderActionDropdown";
import type { DetailsPageOutletContext } from "#src/pages/DetailsPage/details-page-outlet-context";
import { SmartlistTabLayout } from "#src/pages/DetailsPage/smartlist-tab-layout";
import { useTranslation } from "#src/utils/i18n";

import { MessagesSection } from "./MessagesSection";
import { TagRulesSection } from "./TagRulesSection";

const CREATE_AUTOMATION_ACTION_ID = "create-automation" as const;

export const AutomationPage = () => {
  const { t } = useTranslation("details");
  const isMobile = !useMatchMedia("md");
  const { smartlistId } = useOutletContext<DetailsPageOutletContext>();
  const { openReportModal, reportModal } = useCampaignGenerationReport({
    smartlistId,
  });
  const [inlineAction, setInlineAction] = useState<
    typeof CREATE_AUTOMATION_ACTION_ID | null
  >(null);

  return (
    <SmartlistTabLayout
      layout="details"
      smartlistId={smartlistId}
      endGroupActions={[
        <AutomationInfoPopover key="automation-info-popover" />,
        <SmartlistHeaderActionDropdown
          key="automation-page-header-actions"
          onGenerateReport={openReportModal}
        />,
      ]}
      callToActionButton={
        <Button
          color="main"
          intent="call-to-action"
          label={
            isMobile ? "" : t("actions.createAutomation", { ns: "details" })
          }
          aria-label={t("actions.createAutomation", { ns: "details" })}
          iconLeft="plus"
          size="md"
          onClick={() => setInlineAction(CREATE_AUTOMATION_ACTION_ID)}
        />
      }
    >
      <div className="flex flex-col gap-lg p-0 md:p-md">
        <section className="flex flex-col gap-sm">
          <Title htmlVariant="h2" weight="stronger">
            {t("automation.messages.title")}
          </Title>
        </section>

        <QueryBoundary>
          <MessagesSection compact={isMobile} />
        </QueryBoundary>

        <section className="flex flex-col gap-sm">
          <Title htmlVariant="h2" weight="stronger">
            {t("automation.tagRules.title")}
          </Title>
        </section>

        <QueryBoundary loadingFallback={<CardLoader size="lg" />}>
          <TagRulesSection compact={isMobile} />
        </QueryBoundary>

        <Outlet />
      </div>
      {reportModal}
      {inlineAction === CREATE_AUTOMATION_ACTION_ID ? (
        <CreateAutomationModal isOpen onClose={() => setInlineAction(null)} />
      ) : null}
    </SmartlistTabLayout>
  );
};
