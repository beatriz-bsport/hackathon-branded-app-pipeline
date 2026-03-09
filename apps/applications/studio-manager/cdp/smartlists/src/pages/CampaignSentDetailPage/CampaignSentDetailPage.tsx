import { Link, useParams } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { CampaignSent } from "#src/api/types";
import { useFetchCampaignSentDetail } from "#src/api/use-fetch-campaign-sent-detail";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { CampaignSentDetails } from "#src/components/CampaignSentDetails/CampaignSentDetails";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { URLS } from "#src/urls";
import {
  getCampaignStatus,
  getFallbackCampaignContent,
  getFallbackCampaignName,
  getFallbackCampaignTitle,
} from "#src/utils/campaignUtils";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export const CampaignSentDetailPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <CampaignSentDetailPageContent />
    </QueryBoundary>
  );
};

function getCampaignOpenRate(campaignSentDetail: CampaignSent) {
  if (
    campaignSentDetail.total_read == null ||
    campaignSentDetail.total_recipients == null ||
    campaignSentDetail.total_recipients <= 0
  ) {
    return undefined;
  }

  const openRate =
    campaignSentDetail.total_read / campaignSentDetail.total_recipients;
  const openRatePercentage = openRate * 100;
  const roundedOpenRatePercentage = openRatePercentage.toFixed(2);

  return String(roundedOpenRatePercentage);
}

function getCampaignClickRate(campaignSentDetail: CampaignSent) {
  if (
    campaignSentDetail.total_click == null ||
    campaignSentDetail.total_recipients == null ||
    campaignSentDetail.total_recipients <= 0
  ) {
    return undefined;
  }

  const clickRate =
    campaignSentDetail.total_click / campaignSentDetail.total_recipients;
  const clickRatePercentage = clickRate * 100;
  const roundedClickRatePercentage = clickRatePercentage.toFixed(2);

  return String(roundedClickRatePercentage);
}

function CampaignSentDetailPageContent() {
  const { t: tList } = useTranslation("list");
  const { id, uuid } = useParams<{ id: string; uuid: string }>();
  invariant(id, "Expected id param to be defined");
  invariant(uuid, "Expected uuid param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);
  const { data: campaignSentDetail } = useFetchCampaignSentDetail({
    campaignUuid: uuid,
  });

  const { detailsLayoutProps } = useDetailsLayout();

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={URLS.INDEX}>
      <Breadcrumbs.Item id="breadcrumb-smartlists" text={tList("title")} />
    </Link>,
    <Link key="smartlists-item-campaign-breadcrumb" to={`../${id}/campaign/`}>
      <Breadcrumbs.Item
        id="breadcrumb-smartlists-campaigns"
        text={smartlist?.name ?? ""}
      />
    </Link>,
  ];

  const campaignOpenRate = getCampaignOpenRate(campaignSentDetail);
  const campaignClickRate = getCampaignClickRate(campaignSentDetail);
  const pageTitle = getFallbackCampaignName(campaignSentDetail);

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <CampaignSentDetails
          campaignUuid={uuid}
          campaignKind={campaignSentDetail.kind}
          campaignStatus={getCampaignStatus(campaignSentDetail)}
          campaignDate={campaignSentDetail.date_created}
          campaignTotalRecipients={campaignSentDetail.total_recipients}
          campaignContent={{
            subject: getFallbackCampaignTitle(campaignSentDetail),
            body: getFallbackCampaignContent(campaignSentDetail),
          }}
          performance={{
            totalOpened: campaignSentDetail.total_read ?? undefined,
            totalClicked: campaignSentDetail.total_click ?? undefined,
            // as of the 16/02/2026 - We do not have open rate in the campaign sent detail, so we will calcul it here which is a bad pattern to not reproduce
            openRate: campaignOpenRate,
            // as of the 16/02/2026 - We do not have click rate in the campaign sent detail, so we will calcul it here which is a bad pattern to not reproduce
            clickRate: campaignClickRate,
          }}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
