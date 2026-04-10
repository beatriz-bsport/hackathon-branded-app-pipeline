import { Link, useNavigate, useParams } from "react-router";

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
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { AutomationDetailsCard } from "./AutomationDetailsCard";

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
  const navigate = useNavigate();

  const { t: tList } = useTranslation("list");
  const { t: tDetails } = useTranslation("details");

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

  const endGroupActions = [
    <Button
      key="automation-message-delete"
      kind="icon-button"
      icon="trash-01"
      color="main"
      intent="default"
      size="md"
      label={tDetails("automation.messagePage.actions.delete")}
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
      label={tDetails("automation.messagePage.actions.edit")}
      onClick={() => {
        navigate(
          automation.communication_kind === CommunicationKind.SMS
            ? SMARTLIST_APP_LINKS.automationSmsEdit(id, messageId)
            : SMARTLIST_APP_LINKS.automationPushEdit(id, messageId),
        );
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
