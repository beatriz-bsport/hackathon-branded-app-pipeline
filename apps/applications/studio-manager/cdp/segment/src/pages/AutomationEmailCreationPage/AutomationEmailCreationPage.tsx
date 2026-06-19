import { useId } from "react";
import { Link, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { EMAIL_TYPE_MARKETING } from "#src/components/EmailCampaignForm/constants";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { AutomationEmailForm } from "./AutomationEmailForm";
import { automationEmailSchema } from "./schema";
import {
  type AutomationEmailFormData,
  EMAIL_AUTOMATION_EVENT_VALUES,
  EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES,
} from "./types";
import { useCreateEmailAutomation } from "./use-create-email-automation";

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
  const formId = `${baseId}-automation-email-create-form`;

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);
  const { createEmailAutomation } = useCreateEmailAutomation({ smartlistId });

  const methods = useFormController({
    mode: "onBlur",
    schema: automationEmailSchema,
    defaultValues: {
      emailType: EMAIL_TYPE_MARKETING,
      eventKind: EMAIL_AUTOMATION_EVENT_VALUES.ENTRY,
      triggerLimit: EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
      isTextOnly: true,
      emailSubject: "",
      emailBody: "",
      emailTemplateId: undefined,
      emailTemplateDesign: undefined,
      emailTemplateHtml: undefined,
    } satisfies AutomationEmailFormData,
  });

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

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="automation-email-create-button"
        color="main"
        intent="call-to-action"
        label={t("automation.email.actions.continue", { ns: "details" })}
        size="md"
        type="submit"
        form={formId}
        disabled={methods.formState.isSubmitting}
      />,
    ],
  });

  const handleSubmit = async (data: AutomationEmailFormData) => {
    await createEmailAutomation(data);
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("automation.email.pageTitle", { ns: "details" })}
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <AutomationEmailForm id={formId} onSubmit={handleSubmit} {...methods} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}
