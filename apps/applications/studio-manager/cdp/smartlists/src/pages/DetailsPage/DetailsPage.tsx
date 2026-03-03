import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  type SelectedDate,
  Tabs,
  type TabsProps,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useGenerateCampaignReport } from "#src/api/use-generate-campaign-report";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { CampaignReportModal } from "#src/components/CampaignReportModal/CampaignReportModal";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { URLS } from "#src/urls";
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

function Details() {
  const [inlineActions, setInlineActions] = useState<
    typeof GENERATE_REPORT_ACTION_ID | null
  >(null);
  const { t } = useTranslation("details");
  const { t: tList } = useTranslation("list");
  const { t: tCampaign } = useTranslation("campaign");
  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");

  const generateCampaignReport = useGenerateCampaignReport({
    onSuccess: (cdnUrl) => {
      downloadFileFromUrl(cdnUrl, {
        onSuccess: () => {
          toast({
            status: "positive",
            icon: "download-01",
            description: tCampaign("generateReportModal.toast.success"),
          });
        },
        onError: () => {
          toast({
            status: "critical",
            icon: "alert-circle",
            description: tCampaign("generateReportModal.toast.downloadFailed"),
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
        description: tCampaign("generateReportModal.toast.downloadFailed"),
      });
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);

  const { detailsLayoutProps } = useDetailsLayout();

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={URLS.INDEX}>
      <Breadcrumbs.Item id="breadcrumb-smartlists" text={tList("title")} />
    </Link>,
  ];

  const tabsConfig_items = [
    {
      id: "smartlist-parameters-tab",
      path: PARAMETER_TAB_PATH,
      label: t("tabs.parameters"),
    },
    {
      id: "smartlist-campaigns-tab",
      path: CAMPAIGN_TAB_PATH,
      label: t("tabs.campaigns"),
    },
    {
      id: "smartlist-automations-tab",
      path: AUTOMATION_TAB_PATH,
      label: t("tabs.automations"),
    },
  ];

  const getEndGroupActionItems = () => {
    const pathname = location.pathname;
    if (
      pathname.includes(CAMPAIGN_TAB_PATH) ||
      pathname.includes(AUTOMATION_TAB_PATH)
    ) {
      return [
        <SmartlistHeaderActionDropdown
          key="campaign-page-header-actions"
          onGenerateReport={() => setInlineActions(GENERATE_REPORT_ACTION_ID)}
        />,
      ];
    }
    return undefined;
  };

  useEffect(() => {
    const isAtBasePath = location.pathname === `/${id}`;

    if (isAtBasePath) {
      navigate("parameter", { replace: true });
    }
  }, [id, location.pathname, navigate]);

  const tabsConfig: TabsProps = {
    TabsItems: tabsConfig_items.map((tab) => (
      <NavLink to={`/${id}/${tab.path}`} id={tab.id} key={tab.id} end>
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
              description: tCampaign("generateReportModal.toast.pending"),
              duration: 3000,
            });
            handleStart(selectedDate);
            setInlineActions(null);
          }}
          onClose={() => setInlineActions(null)}
        />
      ) : null}
    </DetailsLayout>
  );
}
