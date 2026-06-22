import { useId } from "react";
import { Link, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
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
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { AutomationEmailForm } from "../AutomationEmailCreationPage/AutomationEmailForm";
import { automatedCampaignToFormData } from "../AutomationEmailCreationPage/mappers";
import { automationEmailSchema } from "../AutomationEmailCreationPage/schema";
import { useUpdateEmailAutomation } from "./use-update-email-automation";

export function AutomationEmailEditPage() {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={DetailPageErrorFallback}
    >
      <AutomationEmailEditDetail />
    </QueryBoundary>
  );
}

function AutomationEmailEditDetail() {
  const { entityId, id: smartlistId } = useParams<{
    entityId: string;
    id: string;
  }>();
  invariant(entityId, "Expected entityId param to be defined");
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { t } = useTranslation();
  const { detailsLayoutProps } = useDetailsLayout();

  const { data: campaign } = useAutomatedCampaignDetailSuspenseQuery(entityId);
  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);

  const baseId = useId();
  const formId = `${baseId}-automation-email-edit-form`;
  const ids = {
    breadcrumbs: {
      smartlists: `${baseId}-automation-email-breadcrumb-smartlists`,
      smartlistName: `${baseId}-automation-email-breadcrumb-smartlist-name`,
    },
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: automationEmailSchema,
    defaultValues: automatedCampaignToFormData(campaign),
  });

  const { updateEmailAutomation } = useUpdateEmailAutomation({
    smartlistId,
    entityId,
  });

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="automation-email-edit-button"
        color="main"
        intent="call-to-action"
        label={t("automation.email.actions.save", { ns: "details" })}
        size="md"
        type="submit"
        form={formId}
        disabled={methods.formState.isSubmitting}
      />,
    ],
  });

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
        pageTitle={
          campaign.title ?? t("automation.email.pageTitle", { ns: "details" })
        }
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <AutomationEmailForm
          id={formId}
          onSubmit={updateEmailAutomation}
          {...methods}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
