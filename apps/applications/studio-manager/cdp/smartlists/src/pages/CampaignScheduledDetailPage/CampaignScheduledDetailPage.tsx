import { Link, useParams } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useFetchCampaignScheduledDetail } from "#src/api/use-fetch-campaign-scheduled-detail";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { CampaignScheduledDetails } from "#src/components/CampaignScheduledDetails/CampaignScheduledDetails";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { URLS } from "#src/urls";
import { getFallbackCampaignScheduledName } from "#src/utils/campaignUtils";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export const CampaignScheduledDetailPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <CampaignScheduledDetail />
    </QueryBoundary>
  );
};

function CampaignScheduledDetail() {
  const { t: tList } = useTranslation("list");
  const { id, uuid } = useParams<{ id: string; uuid: string }>();
  invariant(id, "Expected id param to be defined");
  invariant(uuid, "Expected uuid param to be defined");

  const campaignScheduledId = Number.parseInt(uuid, 10);
  invariant(
    Number.isFinite(campaignScheduledId),
    "Expected uuid param to be a numeric scheduled campaign id",
  );

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);
  const { data: campaignScheduledDetail } =
    useFetchCampaignScheduledDetail(uuid);

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

  const pageTitle = getFallbackCampaignScheduledName(campaignScheduledDetail);

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <CampaignScheduledDetails
          campaignScheduledId={campaignScheduledId}
          campaignKind={campaignScheduledDetail.communication_kind}
          campaignDate={campaignScheduledDetail.datetime_scheduled}
          campaignContent={{
            subject: campaignScheduledDetail.title ?? "",
            body: campaignScheduledDetail.text ?? "",
            emailTemplateId: campaignScheduledDetail.email_design ?? undefined,
          }}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
