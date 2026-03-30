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

import { AutomationPushForm } from "../AutomationPushCreationPage/AutomationPushForm";
import { automatedCampaignToFormData } from "../AutomationPushCreationPage/mappers";
import { pushAutomationSchema } from "../AutomationPushCreationPage/schema";
import { useUpdatePushAutomation } from "./use-update-push-automation";

export function AutomationPushEditPage() {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={DetailPageErrorFallback}
    >
      <AutomationPushEditDetail />
    </QueryBoundary>
  );
}

function AutomationPushEditDetail() {
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
  const formId = `${baseId}-automation-push-edit-form`;
  const ids = {
    breadcrumbs: {
      smartlists: `${baseId}-automation-push-breadcrumb-smartlists`,
      smartlistName: `${baseId}-automation-push-breadcrumb-smartlist-name`,
    },
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: pushAutomationSchema,
    defaultValues: automatedCampaignToFormData(campaign),
  });

  const { updatePushAutomation } = useUpdatePushAutomation({
    smartlistId,
    entityId,
  });

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="automation-push-edit-button"
        color="main"
        intent="call-to-action"
        label={t("automation.push.actions.save", { ns: "details" })}
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
          campaign.title ?? t("automation.push.pageTitle", { ns: "details" })
        }
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <AutomationPushForm
          id={formId}
          onSubmit={updatePushAutomation}
          {...methods}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
