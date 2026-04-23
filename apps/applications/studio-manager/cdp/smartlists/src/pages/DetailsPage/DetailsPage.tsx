import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useParams } from "react-router";

import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  IconName,
  type SelectedDate,
  Tabs,
  type TabsProps,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useGenerateCampaignReport } from "#src/api/use-generate-campaign-report";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { CampaignReportModal } from "#src/components/CampaignReportModal/CampaignReportModal";
import { CampaignTypeSelectorModal } from "#src/components/CampaignTypeSelector/CampaignTypeSelectorModal";
import { useCampaignTypeOptions } from "#src/components/CampaignTypeSelector/use-campaign-type-options";
import { CreateAutomationModal } from "#src/components/CreateAutomationModal";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { AutomationInfoPopover } from "#src/components/SmartlistDetailHeaderActions/AutomationInfoPopover";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import {
  AUTOMATION_TAB_PATH,
  CAMPAIGN_TAB_PATH,
  PARAMETER_TAB_PATH,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";
import { downloadFileFromUrl } from "#src/utils/utils";

import {
  GENERATE_REPORT_ACTION_ID,
  SmartlistHeaderActionDropdown,
} from "./SmartlistHeaderActionDropdown";
import {
  type DetailsTabPath,
  getDetailsActiveTabPath,
  getHeaderTabConfig,
} from "./header-actions";

const REPORT_DATE_FILTER_LUXON_FORMAT = "yyyy-MM-dd";

export const DetailsPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <Details />
    </QueryBoundary>
  );
};

export type CampaignTypeId = "email" | "sms" | "push" | "popup";

export type CampaignTypeOption = {
  id: CampaignTypeId;
  icon: IconName;
  titleKey: string;
  descriptionKey: string;
  showAddOnChip: boolean;
  onClick: () => void;
};

const CAMPAIGN_TYPE_SELECTOR_ACTION_ID = "campaign-type-selector" as const;
const CREATE_AUTOMATION_ACTION_ID = "create-automation" as const;

function Details() {
  const [inlineActions, setInlineActions] = useState<
    | typeof GENERATE_REPORT_ACTION_ID
    | typeof CAMPAIGN_TYPE_SELECTOR_ACTION_ID
    | typeof CREATE_AUTOMATION_ACTION_ID
    | null
  >(null);
  const { t } = useTranslation(["details", "list", "campaign"]);
  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");
  const campaignTypeOptions = useCampaignTypeOptions({ smartlistId: id });

  const generateCampaignReport = useGenerateCampaignReport({
    onSuccess: (cdnUrl) => {
      downloadFileFromUrl(cdnUrl, {
        onSuccess: () => {
          toast({
            status: "positive",
            icon: "download-01",
            description: t("generateReportModal.toast.success", {
              ns: "campaign",
            }),
            buttonIcon: "x-close",
          });
        },
        onError: () => {
          toast({
            status: "critical",
            icon: "alert-circle",
            description: t("generateReportModal.toast.downloadFailed", {
              ns: "campaign",
            }),
            buttonIcon: "x-close",
          });
        },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleStart = async (selectedDate: SelectedDate) => {
    if (!Array.isArray(selectedDate) || selectedDate.length < 2) {
      console.warn(
        "Could not generate report : no date selected in the DatePicker",
      );
      return;
    }

    const startDate = selectedDate[0]?.toFormat(
      REPORT_DATE_FILTER_LUXON_FORMAT,
    );
    const endDate = selectedDate[1]?.toFormat(REPORT_DATE_FILTER_LUXON_FORMAT);

    if (!startDate || !endDate) {
      console.warn("Could not generate report : no formatted date");
      return;
    }

    try {
      await generateCampaignReport.mutateAsync({
        smartlistId: id,
        startDate,
        endDate,
      });
    } catch (err) {
      console.error(err);
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("generateReportModal.toast.downloadFailed", {
          ns: "campaign",
        }),
        buttonIcon: "x-close",
      });
    }
  };

  const location = useLocation();
  const { navigateToSmartlistParameters } = useSmartlistNavigation();
  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);
  const { detailsLayoutProps } = useDetailsLayout();

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={SMARTLIST_APP_LINKS.index()}>
      <Breadcrumbs.Item
        id="breadcrumb-smartlists"
        text={t("title", { ns: "list" })}
      />
    </Link>,
  ];

  const tabsConfig_items: Array<{
    id: string;
    path: DetailsTabPath;
    label: string;
  }> = [
    {
      id: "smartlist-parameters-tab",
      path: PARAMETER_TAB_PATH,
      label: t("tabs.parameters", { ns: "details" }),
    },
    {
      id: "smartlist-campaigns-tab",
      path: CAMPAIGN_TAB_PATH,
      label: t("tabs.campaigns", { ns: "details" }),
    },
    {
      id: "smartlist-automations-tab",
      path: AUTOMATION_TAB_PATH,
      label: t("tabs.automations", { ns: "details" }),
    },
  ];

  const activeTabPath = getDetailsActiveTabPath(location.pathname);
  const headerTabConfig = getHeaderTabConfig(activeTabPath);

  const getEndGroupActionItems = () => {
    if (headerTabConfig.showDropdown) {
      const actions = [
        <SmartlistHeaderActionDropdown
          key="campaign-page-header-actions"
          onGenerateReport={() => setInlineActions(GENERATE_REPORT_ACTION_ID)}
        />,
      ];

      if (headerTabConfig.callToAction === "automation") {
        actions.unshift(
          <AutomationInfoPopover key="automation-info-popover" />,
        );
      }

      return actions;
    }
  };

  const getCallToActionButton = () => {
    switch (headerTabConfig.callToAction) {
      case "campaign":
        return (
          <Button
            color="main"
            intent="call-to-action"
            label={t("actions.createCampaign", { ns: "campaign" })}
            iconLeft="plus"
            size="md"
            onClick={() => setInlineActions(CAMPAIGN_TYPE_SELECTOR_ACTION_ID)}
          />
        );
      case "automation":
        return (
          <Button
            color="main"
            intent="call-to-action"
            label={t("actions.createAutomation", { ns: "details" })}
            iconLeft="plus"
            size="md"
            onClick={() => setInlineActions(CREATE_AUTOMATION_ACTION_ID)}
          />
        );
      case null:
        return;
    }
  };

  useEffect(() => {
    const isAtBasePath = location.pathname === SMARTLIST_APP_LINKS.details(id);

    if (isAtBasePath) {
      navigateToSmartlistParameters(id, { replace: true });
    }
  }, [id, location.pathname, navigateToSmartlistParameters]);

  const tabsConfig: TabsProps = {
    TabsItems: tabsConfig_items.map((tab) => (
      <NavLink
        to={SMARTLIST_APP_LINKS.detailsTab(id, tab.path)}
        id={tab.id}
        key={tab.id}
        end
      >
        {({ isActive }) => (
          <Tabs.Item id={tab.id} label={tab.label} isActive={isActive} />
        )}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  const pageTitle = smartlist?.name ?? "";

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        pageTabs={tabsConfig}
        BreadcrumbsItems={breadcrumbsItems}
        endGroupActions={getEndGroupActionItems()}
        callToActionButton={getCallToActionButton()}
      />
      <DetailsLayout.Content>
        <Outlet context={{ smartlistId: id, smartlist }} />
      </DetailsLayout.Content>
      {inlineActions === GENERATE_REPORT_ACTION_ID ? (
        <CampaignReportModal
          isOpen={true}
          onConfirm={(selectedDate) => {
            toast({
              status: "default",
              icon: "send-01",
              description: t("generateReportModal.toast.pending", {
                ns: "campaign",
              }),
              duration: 3000,
              buttonIcon: "x-close",
            });
            handleStart(selectedDate);
            setInlineActions(null);
          }}
          onClose={() => setInlineActions(null)}
        />
      ) : null}
      {inlineActions === CAMPAIGN_TYPE_SELECTOR_ACTION_ID ? (
        <CampaignTypeSelectorModal
          isOpen
          onClose={() => setInlineActions(null)}
          campaignTypeOptions={campaignTypeOptions}
        />
      ) : null}
      {inlineActions === CREATE_AUTOMATION_ACTION_ID ? (
        <CreateAutomationModal isOpen onClose={() => setInlineActions(null)} />
      ) : null}
    </DetailsLayout>
  );
}
