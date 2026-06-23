import { useId } from "react";
import { Link, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useDisabledSmsAutomationEventKindsSuspenseQuery } from "#src/api/use-automated-campaigns";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { AutomationSmsForm } from "./AutomationSmsForm";
import { smsAutomationSchema } from "./schema";
import {
  SMS_AUTOMATION_EVENT_VALUES,
  SMS_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type SmsAutomationFormData,
} from "./types";
import { useCreateSmsAutomation } from "./use-create-sms-automation";

export const AutomationSmsCreationPage = () => {
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { t } = useTranslation();
  const { detailsLayoutProps } = useDetailsLayout();
  const baseId = useId();
  const formId = `${baseId}-automation-sms-create-form`;
  const ids = {
    breadcrumbs: {
      smartlists: `${baseId}-automation-sms-breadcrumb-smartlists`,
      smartlistName: `${baseId}-automation-sms-breadcrumb-smartlist-name`,
    },
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: smsAutomationSchema,
    defaultValues: {
      eventKind: SMS_AUTOMATION_EVENT_VALUES.ENTRY,
      triggerLimit: SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
      message: "",
    } satisfies SmsAutomationFormData,
  });

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);
  const { data: disabledEventKinds } =
    useDisabledSmsAutomationEventKindsSuspenseQuery(smartlistId);
  const { createSmsAutomation } = useCreateSmsAutomation({
    smartlistId,
  });

  const selectedEventKind = methods.watch("eventKind");

  const isSelectedTriggerDisabled = disabledEventKinds.has(selectedEventKind);

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="automation-sms-create-button"
        color="main"
        intent="call-to-action"
        label={t("automation.sms.actions.continue", { ns: "details" })}
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

  const handleSubmit = async (data: SmsAutomationFormData) => {
    await createSmsAutomation(data);
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("automation.sms.pageTitle", { ns: "details" })}
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <AutomationSmsForm
          id={formId}
          onSubmit={handleSubmit}
          disabledEventKinds={disabledEventKinds}
          {...methods}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
