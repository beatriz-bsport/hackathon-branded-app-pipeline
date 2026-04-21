import { useId } from "react";
import { Link, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  DetailsLayout,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useScheduleCampaign } from "#src/api/use-schedule-campaign";
import { useSendCampaign } from "#src/api/use-send-campaign";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { EMAIL_TYPE_MARKETING } from "#src/components/EmailCampaignForm/constants";
import { EmailCampaignForm } from "#src/components/EmailCampaignForm/email-campaign-form";
import { getEmailCampaignSchema } from "#src/components/EmailCampaignForm/schema";
import type { EmailCampaignFormData } from "#src/components/EmailCampaignForm/types";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { CampaignDeliveryCtaButton } from "#src/components/campaign-generic-fields/campaign-delivery-cta-button";
import {
  DELIVERY_MODE_SCHEDULE_LATER,
  DELIVERY_MODE_SEND_NOW,
} from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import {
  formatScheduleEmailCampaignPayload,
  formatSendEmailCampaignPayload,
} from "#src/pages/EmailCampaign/utils/format-email-campaign-payload";
import { formatScheduledDateTime } from "#src/pages/utils/format-scheduled-date-time";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

const CreateEmailCampaignPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <CreateEmailCampaign />
    </QueryBoundary>
  );
};

function CreateEmailCampaign() {
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");
  const { t } = useTranslation(["list", "campaign"]);
  const { navigateToSmartlistCampaigns } = useSmartlistNavigation();

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);
  const { detailsLayoutProps } = useDetailsLayout();
  const companyTimezone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "UTC";

  const { sendCampaign, isSending } = useSendCampaign({
    onSuccess: () => {
      navigateToSmartlistCampaigns(smartlistId);
      toast({
        status: "default",
        icon: "check",
        title: t("email.creation.toasts.success.send", { ns: "campaign" }),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("email.creation.toasts.error.sendFailed", { ns: "campaign" }),
        buttonIcon: "x-close",
      });
    },
  });
  const { scheduleCampaign, isScheduling } = useScheduleCampaign({
    onSuccess: () => {
      toast({
        status: "default",
        icon: "check",
        title: t("email.creation.toasts.success.schedule", { ns: "campaign" }),
        buttonIcon: "x-close",
      });
      navigateToSmartlistCampaigns(smartlistId);
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("email.creation.toasts.error.sendFailed", { ns: "campaign" }),
        buttonIcon: "x-close",
      });
    },
  });

  const formId = useId();

  const methods = useFormController({
    mode: "onBlur",
    schema: getEmailCampaignSchema(companyTimezone),
    defaultValues: {
      emailType: EMAIL_TYPE_MARKETING,
      campaignName: "",
      deliveryMode: DELIVERY_MODE_SEND_NOW,
      scheduledDate: undefined,
      scheduledTime: undefined,
      isTextOnly: true,
      emailSubject: "",
      emailBody: "",
      emailTemplateId: undefined,
      emailTemplateDesign: undefined,
      emailTemplateHtml: undefined,
    },
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

  const handleSubmit = async (data: EmailCampaignFormData) => {
    if (
      data.deliveryMode === DELIVERY_MODE_SCHEDULE_LATER &&
      data.scheduledDate &&
      data.scheduledTime
    ) {
      const datetimeScheduled = formatScheduledDateTime({
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        companyTimezone,
      });

      const payload = formatScheduleEmailCampaignPayload({
        smartlistId: smartlist.id,
        data,
        datetimeScheduled,
      });

      await scheduleCampaign({
        payload,
      });
      return;
    }

    const payload = formatSendEmailCampaignPayload({
      smartlistId: smartlist.id,
      data,
    });
    await sendCampaign({
      payload,
    });
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("email.creation.title", { ns: "campaign" })}
        BreadcrumbsItems={breadcrumbsItems}
        callToActionButton={[
          <CampaignDeliveryCtaButton
            key="campaign-delivery-cta-button"
            deliveryMode={deliveryMode}
            formId={formId}
            isDisabled={
              methods.formState.isSubmitting || isSending || isScheduling
            }
          />,
        ]}
      />
      <DetailsLayout.Content>
        <EmailCampaignForm
          smartlistId={smartlist.id}
          id={formId}
          onSubmit={handleSubmit}
          {...methods}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}

export default CreateEmailCampaignPage;
