import { useId } from "react";
import { Link, useParams } from "react-router";

import {
  Body,
  Breadcrumbs,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export const AutomationEmailCreationPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={DetailPageErrorFallback}
    >
      <AutomationEmailCreationDetail />
    </QueryBoundary>
  );
};

function AutomationEmailCreationDetail() {
  const { t } = useTranslation();

  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { detailsLayoutProps } = useDetailsLayout();
  const baseId = useId();

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);

  const ids = {
    breadcrumbs: {
      smartlists: `${baseId}-automation-email-breadcrumb-smartlists`,
      smartlistName: `${baseId}-automation-email-breadcrumb-smartlist-name`,
    },
  };

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={SMARTLIST_APP_LINKS.index()}>
      <Breadcrumbs.Item
        id={ids.breadcrumbs.smartlists}
        text={t("title", { ns: "list" })}
      />
    </Link>,
    <Link
      key="smartlist-detail-breadcrumb"
      to={SMARTLIST_APP_LINKS.automation(smartlistId)}
    >
      <Breadcrumbs.Item
        id={ids.breadcrumbs.smartlistName}
        text={smartlist.name}
      />
    </Link>,
  ];

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t(
          "actions.createAutomationModal.messageChannel.email.title",
          { ns: "details" },
        )}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Body size="md" color="weak">
          Email automation creation coming soon.
        </Body>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
