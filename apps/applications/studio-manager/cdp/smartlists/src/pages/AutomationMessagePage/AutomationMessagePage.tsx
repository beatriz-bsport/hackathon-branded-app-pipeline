import { Link, Navigate, useParams } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useAutomatedCampaignDetailSuspenseQuery } from "#src/api/use-automated-campaign-detail";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { CAMPAIGN_CHANNEL_PUSH, SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export function AutomationMessagePage() {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={DetailPageErrorFallback}
    >
      <AutomationMessageDetail />
    </QueryBoundary>
  );
}

function AutomationMessageDetail() {
  const { t: tList } = useTranslation("list");

  const { id, channel, messageId } = useParams<{
    id: string;
    channel: string;
    messageId: string;
  }>();
  invariant(id, "Expected id param to be defined");
  invariant(channel, "Expected channel param to be defined");
  invariant(messageId, "Expected messageId param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);
  const { data: automation } =
    useAutomatedCampaignDetailSuspenseQuery(messageId);

  const { detailsLayoutProps } = useDetailsLayout();

  if (channel !== CAMPAIGN_CHANNEL_PUSH) {
    return <Navigate to={SMARTLIST_APP_LINKS.automation(id)} replace />;
  }

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={SMARTLIST_APP_LINKS.index()}>
      <Breadcrumbs.Item id="breadcrumb-smartlists" text={tList("title")} />
    </Link>,
    <Link
      key="smartlist-detail-breadcrumb"
      to={SMARTLIST_APP_LINKS.automation(id)}
    >
      <Breadcrumbs.Item id="breadcrumb-smartlist-name" text={smartlist.name} />
    </Link>,
  ];

  const pageTitle = automation.title ?? "";

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <div>Automation Message Content</div>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
