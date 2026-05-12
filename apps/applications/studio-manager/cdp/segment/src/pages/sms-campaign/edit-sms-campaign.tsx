import { useId } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  DetailsLayout,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchCampaignScheduledDetail } from "#src/api/use-fetch-campaign-scheduled-detail";
import { useSendNowScheduledCampaign } from "#src/api/use-send-now-scheduled-campaign";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { useUpdateScheduledEmailCampaign } from "#src/api/use-update-scheduled-email-campaign";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { ScheduledCommunicationLockedModal } from "#src/components/ScheduledCommunicationLockedModal/ScheduledCommunicationLockedModal";
import { CampaignDeliveryCtaButton } from "#src/components/campaign-generic-fields/campaign-delivery-cta-button";
import { DELIVERY_MODE_SEND_NOW } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import { getSmsCampaignSchema } from "#src/components/sms-campaign-form/schema";
import { SmsCampaignForm } from "#src/components/sms-campaign-form/sms-campaign-form";
import type { SmsCampaignFormData } from "#src/components/sms-campaign-form/types";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { formatScheduleSmsCampaignPayload } from "#src/pages/sms-campaign/utils/format-sms-campaign-payload";
import { initSmsCampaignFormDefaultValues } from "#src/pages/sms-campaign/utils/init-sms-campaign-form-default-values";
import { formatScheduledDateTime } from "#src/pages/utils/format-scheduled-date-time";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";
import { isScheduledCommunicationLocked } from "#src/utils/scheduled-communication-rules";

const EditSmsCampaignPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <EditSmsCampaign />
    </QueryBoundary>
  );
};

function EditSmsCampaign() {
  const { t } = useTranslation(["list", "campaign"]);
  const navigate = useNavigate();
  const {
    navigateToSmartlistCampaignScheduledDetails,
    navigateToSmartlistCampaigns,
  } = useSmartlistNavigation();
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
  const { formDefaults } = initSmsCampaignFormDefaultValues({
    campaign: scheduledCampaign,
    companyTimezone,
  });

  const { updateScheduledCampaign, isUpdating } =
    useUpdateScheduledEmailCampaign({
      onSuccess: (updatedCampaign) => {
        navigateToSmartlistCampaignScheduledDetails(
          smartlistId,
          updatedCampaign.id,
        );
        toast({
          status: "default",
          icon: "check",
          title: t("sms.creation.toasts.success.schedule", { ns: "campaign" }),
          buttonIcon: "x-close",
        });
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("sms.creation.toasts.error.sendFailed", { ns: "campaign" }),
          buttonIcon: "x-close",
        });
      },
    });
  const { sendNowScheduledCampaign, isSendingNow } =
    useSendNowScheduledCampaign({
      smartlistId,
      onSuccess: () => {
        navigateToSmartlistCampaigns(smartlistId);
        toast({
          status: "default",
          icon: "check",
          title: t("sms.creation.toasts.success.send", { ns: "campaign" }),
          buttonIcon: "x-close",
        });
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("sms.creation.toasts.error.sendFailed", { ns: "campaign" }),
          buttonIcon: "x-close",
        });
      },
    });

  const formId = useId();
  const methods = useFormController({
    mode: "onBlur",
    schema: getSmsCampaignSchema(companyTimezone),
    defaultValues: formDefaults,
  });
  const deliveryMode = methods.watch("deliveryMode");
  const breadcrumbsItems = [
    <Link key="breadcrumb-smartlists" to={SMARTLIST_APP_LINKS.index()}>
      <Breadcrumbs.Item
        id="breadcrumb-smartlists"
        text={t("title", { ns: "list" })}
      />
    </Link>,
    <Link
      key="breadcrumb-smartlists-campaigns"
      to={SMARTLIST_APP_LINKS.campaign(smartlistId)}
    >
      <Breadcrumbs.Item
        id="breadcrumb-smartlists-campaigns"
        text={smartlist?.name ?? ""}
      />
    </Link>,
  ];

  const handleSubmit = async (data: SmsCampaignFormData) => {
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

    const payload = formatScheduleSmsCampaignPayload({
      smartlistId: smartlist.id,
      data,
      datetimeScheduled,
    });

    /**
     * Persist first, then send now.
     *
     * `send_now` sends the currently persisted scheduled communication on backend.
     * If we don't update first, recent form edits (title/message) are not included.
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
        pageTitle={t("sms.creation.title", { ns: "campaign" })}
        BreadcrumbsItems={breadcrumbsItems}
        callToActionButton={[
          <CampaignDeliveryCtaButton
            key="campaign-delivery-cta-button"
            deliveryMode={deliveryMode}
            formId={formId}
            isDisabled={
              methods.formState.isSubmitting || isUpdating || isSendingNow
            }
          />,
        ]}
      />
      <DetailsLayout.Content>
        <SmsCampaignForm
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

export default EditSmsCampaignPage;
