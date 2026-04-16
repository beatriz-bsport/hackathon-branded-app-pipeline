import { useId } from "react";
import { useNavigate, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchCampaignScheduledDetail } from "#src/api/use-fetch-campaign-scheduled-detail";
import { useSendNowScheduledCampaign } from "#src/api/use-send-now-scheduled-campaign";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { useUpdateScheduledEmailCampaign } from "#src/api/use-update-scheduled-email-campaign";
import { EmailCampaignForm } from "#src/components/EmailCampaignForm/email-campaign-form";
import { getEmailCampaignSchema } from "#src/components/EmailCampaignForm/schema";
import type { EmailCampaignFormData } from "#src/components/EmailCampaignForm/types";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { ScheduledCommunicationLockedModal } from "#src/components/ScheduledCommunicationLockedModal/ScheduledCommunicationLockedModal";
import { DELIVERY_MODE_SEND_NOW } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import { formatUpdateScheduledEmailCampaignPayload } from "#src/pages/EmailCampaign/utils/format-email-campaign-payload";
import { initEmailCampaignFormDefaultValues } from "#src/pages/EmailCampaign/utils/init-email-campaign-form-default-values";
import { formatScheduledDateTime } from "#src/pages/utils/format-scheduled-date-time";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";
import { isScheduledCommunicationLocked } from "#src/utils/scheduled-communication-rules";

const EditEmailCampaignPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <EditEmailCampaign />
    </QueryBoundary>
  );
};

function EditEmailCampaign() {
  const { t: tList } = useTranslation("list");
  const { t: tCampaign } = useTranslation("campaign");
  const navigate = useNavigate();
  const { id: smartlistId, entityId } = useParams<{
    id: string;
    entityId: string;
  }>();
  invariant(smartlistId, "Expected id param to be defined");
  invariant(entityId, "Expected entityId param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);
  const { detailsLayoutProps } = useDetailsLayout();
  const companyTimezone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "UTC";

  const { data: scheduledCampaign } = useFetchCampaignScheduledDetail(entityId);
  const isLockedForEdition = isScheduledCommunicationLocked(
    scheduledCampaign.datetime_scheduled,
  );
  const { formDefaults } = initEmailCampaignFormDefaultValues({
    campaign: scheduledCampaign,
    companyTimezone,
  });

  const { updateScheduledCampaign, isUpdating } =
    useUpdateScheduledEmailCampaign({
      onSuccess: (updatedCampaign) => {
        navigate(
          SMARTLIST_APP_LINKS.campaignScheduledDetails(
            smartlistId,
            updatedCampaign.id,
          ),
        );
        toast({
          status: "default",
          icon: "check",
          title: tCampaign("email.creation.toasts.success.schedule"),
          buttonIcon: "x-close",
        });
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: tCampaign("email.creation.toasts.error.scheduleFailed"),
          buttonIcon: "x-close",
        });
      },
    });
  const { sendNowScheduledCampaign, isSendingNow } =
    useSendNowScheduledCampaign({
      smartlistId,
      onSuccess: () => {
        navigate(SMARTLIST_APP_LINKS.campaign(smartlistId));
        toast({
          status: "default",
          icon: "check",
          title: tCampaign("email.creation.toasts.success.send"),
          buttonIcon: "x-close",
        });
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: tCampaign("email.creation.toasts.error.sendFailed"),
          buttonIcon: "x-close",
        });
      },
    });

  const formId = useId();
  const methods = useFormController({
    mode: "onBlur",
    schema: getEmailCampaignSchema(companyTimezone),
    defaultValues: formDefaults,
  });

  const breadcrumbsItems = [
    <Breadcrumbs.Item
      key="breadcrumb-smartlists"
      id="breadcrumb-smartlists"
      text={tList("title")}
      href={SMARTLIST_APP_LINKS.index()}
    />,
    <Breadcrumbs.Item
      key="breadcrumb-smartlists-campaigns"
      id="breadcrumb-smartlists-campaigns"
      text={smartlist?.name ?? ""}
      href={SMARTLIST_APP_LINKS.campaign(smartlistId)}
    />,
  ];

  const handleSubmit = async (data: EmailCampaignFormData) => {
    if (isLockedForEdition) return;
    const isScheduleLater = data.deliveryMode !== DELIVERY_MODE_SEND_NOW;
    const isSendNow = data.deliveryMode === DELIVERY_MODE_SEND_NOW;

    if (isScheduleLater && (!data.scheduledDate || !data.scheduledTime)) return;

    const datetimeScheduled =
      data.scheduledDate && data.scheduledTime
        ? formatScheduledDateTime({
            scheduledDate: data.scheduledDate,
            scheduledTime: data.scheduledTime,
            companyTimezone,
          })
        : scheduledCampaign.datetime_scheduled;

    const payload = formatUpdateScheduledEmailCampaignPayload({
      smartlistId: smartlist.id,
      data,
      datetimeScheduled,
    });

    /**
     * Persist first, then send now.
     *
     * `send_now` sends the currently persisted scheduled communication on backend.
     * If we don't update first, recent form edits (subject/body) are not included.
     */
    await updateScheduledCampaign({
      campaignScheduledId: entityId,
      payload,
    });

    if (!isSendNow) return;

    await sendNowScheduledCampaign({ campaignScheduledId: entityId });
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={tCampaign("email.creation.title")}
        BreadcrumbsItems={breadcrumbsItems}
        callToActionButton={
          <Button
            color="main"
            intent="call-to-action"
            label={tCampaign("email.creation.continueButtonLabel")}
            size="md"
            type="submit"
            form={formId}
            disabled={
              methods.formState.isSubmitting || isUpdating || isSendingNow
            }
          />
        }
      />
      <DetailsLayout.Content>
        <EmailCampaignForm
          smartlistId={smartlist.id}
          id={formId}
          onSubmit={handleSubmit}
          {...methods}
        />
      </DetailsLayout.Content>
      <ScheduledCommunicationLockedModal
        isOpen={isLockedForEdition}
        onClose={() => navigate(-1)}
        onGoBack={() => navigate(-1)}
      />
    </DetailsLayout>
  );
}

export default EditEmailCampaignPage;
