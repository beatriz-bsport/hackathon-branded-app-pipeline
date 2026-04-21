import { Link, useParams } from "react-router";

import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { useAutomatedCampaignDetailSuspenseQuery } from "#src/api/use-automated-campaign-detail";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DeleteAutomationModal,
  useDeleteAutomationModal,
} from "#src/components/DeleteAutomationModal";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { AutomationDetailsCard } from "./AutomationDetailsCard";
import { AutomationSentMessagesTable } from "./AutomationSentMessagesTable";

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
  const {
    navigateToSmartlistEmailAutomationEdit,
    navigateToSmartlistSmsAutomationEdit,
    navigateToSmartlistPushAutomationEdit,
  } = useSmartlistNavigation();

  const { t } = useTranslation();

  const {
    isOpen: isDeleteAutomationOpen,
    automationId: automationToDeleteId,
    requestDelete,
    cancelDelete,
  } = useDeleteAutomationModal();

  const { id, messageId } = useParams<{
    id: string;
    messageId: string;
  }>();
  invariant(id, "Expected id param to be defined");
  invariant(messageId, "Expected messageId param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);
  const { data: automation } =
    useAutomatedCampaignDetailSuspenseQuery(messageId);

  const { detailsLayoutProps } = useDetailsLayout();

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={SMARTLIST_APP_LINKS.index()}>
      <Breadcrumbs.Item
        id="breadcrumb-smartlists"
        text={t("title", { ns: "list" })}
      />
    </Link>,
    <Link
      key="smartlist-detail-breadcrumb"
      to={SMARTLIST_APP_LINKS.automation(id)}
    >
      <Breadcrumbs.Item id="breadcrumb-smartlist-name" text={smartlist.name} />
    </Link>,
  ];

  const pageTitle = automation.title ?? "";

  const endGroupActions = [
    <Button
      key="automation-message-delete"
      kind="icon-button"
      icon="trash-01"
      color="main"
      intent="default"
      size="md"
      label={t("automation.messagePage.actions.delete", { ns: "details" })}
      onClick={() => {
        requestDelete(automation.id);
      }}
    />,
    <Button
      key="automation-message-edit"
      kind="icon-button"
      icon="edit-02"
      color="main"
      intent="default"
      size="md"
      label={t("automation.messagePage.actions.edit", { ns: "details" })}
      onClick={() => {
        if (automation.communication_kind === CommunicationKind.EMAIL) {
          navigateToSmartlistEmailAutomationEdit(id, messageId);
        } else if (automation.communication_kind === CommunicationKind.SMS) {
          navigateToSmartlistSmsAutomationEdit(id, messageId);
        } else if (automation.communication_kind === CommunicationKind.PUSH) {
          navigateToSmartlistPushAutomationEdit(id, messageId);
        } else {
          invariant(
            false,
            `Unsupported communication kind: ${automation.communication_kind}`,
          );
        }
      }}
    />,
  ];

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        BreadcrumbsItems={breadcrumbsItems}
        endGroupActions={endGroupActions}
      />
      <DetailsLayout.Content>
        <div className="flex flex-col gap-md">
          <AutomationDetailsCard messageId={messageId} />
          <AutomationSentMessagesTable
            key={messageId}
            smartlistId={id}
            messageId={messageId}
          />
        </div>
      </DetailsLayout.Content>

      <DeleteAutomationModal
        isOpen={isDeleteAutomationOpen}
        onClose={cancelDelete}
        smartlistId={id}
        automationId={automationToDeleteId}
      />
    </DetailsLayout>
  );
}
