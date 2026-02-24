import { Link, useParams } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

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
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
