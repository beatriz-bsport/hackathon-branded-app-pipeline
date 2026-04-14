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
import {
  selectDisabledSmsAutomationEventKinds,
  useAutomatedCampaignsSuspenseQuery,
} from "#src/api/use-automated-campaigns";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { AutomationSmsForm } from "../AutomationSmsCreationPage/AutomationSmsForm";
import { automatedCampaignToFormData } from "../AutomationSmsCreationPage/mappers";
import { smsAutomationSchema } from "../AutomationSmsCreationPage/schema";
import { useUpdateSmsAutomation } from "./use-update-sms-automation";

export function AutomationSmsEditPage() {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={DetailPageErrorFallback}
    >
      <AutomationSmsEditDetail />
    </QueryBoundary>
  );
}

function AutomationSmsEditDetail() {
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
  const { data: disabledEventKinds } = useAutomatedCampaignsSuspenseQuery(
    smartlistId,
    (automatedCampaigns) => {
      return selectDisabledSmsAutomationEventKinds(
        automatedCampaigns.filter(
          (automatedCampaign) => automatedCampaign.id !== Number(entityId),
        ),
      );
    },
  );

  const baseId = useId();
  const formId = `${baseId}-automation-sms-edit-form`;
  const ids = {
    breadcrumbs: {
      smartlists: `${baseId}-automation-sms-breadcrumb-smartlists`,
      smartlistName: `${baseId}-automation-sms-breadcrumb-smartlist-name`,
    },
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: smsAutomationSchema,
    defaultValues: automatedCampaignToFormData(campaign),
  });

  const { updateSmsAutomation } = useUpdateSmsAutomation({
    smartlistId,
    entityId,
  });

  const selectedEventKind = methods.watch("eventKind");
  const isSelectedTriggerDisabled = disabledEventKinds.has(selectedEventKind);

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="automation-sms-edit-button"
        color="main"
        intent="call-to-action"
        label={t("automation.sms.actions.save", { ns: "details" })}
        size="md"
        type="submit"
        form={formId}
        disabled={methods.formState.isSubmitting || isSelectedTriggerDisabled}
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
          campaign.title ?? t("automation.sms.pageTitle", { ns: "details" })
        }
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <AutomationSmsForm
          id={formId}
          onSubmit={updateSmsAutomation}
          disabledEventKinds={disabledEventKinds}
          {...methods}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
