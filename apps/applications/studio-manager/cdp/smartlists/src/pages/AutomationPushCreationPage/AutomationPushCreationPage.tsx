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
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { AutomationPushForm } from "./components/AutomationPushForm";
import { pushAutomationSchema } from "./schema";
import {
  PUSH_AUTOMATION_EVENT_VALUES,
  type PushAutomationFormData,
} from "./types";
import { useCreatePushAutomation } from "./use-create-push-automation";

export const AutomationPushCreationPage = () => {
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { t } = useTranslation("details");
  const { t: tList } = useTranslation("list");

  const { detailsLayoutProps } = useDetailsLayout();

  const baseId = useId();
  const formId = `${baseId}-automation-push-create-form`;
  const ids = {
    breadcrumbs: {
      smartlists: `${baseId}-automation-push-breadcrumb-smartlists`,
      smartlistName: `${baseId}-automation-push-breadcrumb-smartlist-name`,
    },
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: pushAutomationSchema,
    defaultValues: {
      automationName: "",
      eventKind: PUSH_AUTOMATION_EVENT_VALUES.ENTRY,
      title: "",
      message: "",
    } satisfies PushAutomationFormData,
  });

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);

  const { createPushAutomation } = useCreatePushAutomation({
    smartlistId,
  });

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="automation-push-create-button"
        color="main"
        intent="call-to-action"
        label={t("automation.push.actions.continue")}
        size="md"
        type="submit"
        form={formId}
        disabled={methods.formState.isSubmitting}
      />,
    ],
  });

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={URLS.INDEX}>
      <Breadcrumbs.Item id={ids.breadcrumbs.smartlists} text={tList("title")} />
    </Link>,
    <Link key="smartlist-detail-breadcrumb" to={`/${smartlistId}/automation`}>
      <Breadcrumbs.Item
        id={ids.breadcrumbs.smartlistName}
        text={smartlist.name}
      />
    </Link>,
  ];

  const handleSubmit = async (data: PushAutomationFormData) => {
    await createPushAutomation(data);
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("automation.push.pageTitle")}
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <AutomationPushForm id={formId} onSubmit={handleSubmit} {...methods} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
