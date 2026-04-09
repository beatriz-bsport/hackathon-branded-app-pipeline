import { Link, useParams } from "react-router";

import {
  Body,
  Breadcrumbs,
  Card,
  DetailsLayout,
  Title,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export const AutomationSmsCreationPage = () => {
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { t } = useTranslation();
  const { detailsLayoutProps } = useDetailsLayout();

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={SMARTLIST_APP_LINKS.index()}>
      <Breadcrumbs.Item text={t("title", { ns: "list" })} />
    </Link>,
    <Link
      key="smartlist-detail-breadcrumb"
      to={SMARTLIST_APP_LINKS.automation(smartlistId)}
    >
      <Breadcrumbs.Item text={smartlist.name} />
    </Link>,
  ];

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle="SMS Automation"
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Card className="flex flex-col gap-md" padding="lg">
          <div className="flex flex-col gap-xs">
            <Title htmlVariant="h3" weight="stronger">
              SMS creation flow coming soon
            </Title>
            <Body size="md" color="weak">
              This placeholder route is now wired from the automation modal. The
              SMS step-by-step experience will be added here next.
            </Body>
          </div>
        </Card>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
