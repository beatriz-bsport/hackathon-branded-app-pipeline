import { useQueryClient } from "@tanstack/react-query";
import { type ComponentProps, type ReactNode, useId } from "react";
import { Link, useParams } from "react-router";

import type {
  ScheduleCampaignPayload,
  SendSmsCampaignPayload,
} from "@bsport/api-cdp/communicate";
import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  DetailsLayout,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { smartlistQueryKeys } from "#src/api/api";
import { useScheduleCampaign } from "#src/api/use-schedule-campaign";
import { useSendCampaign } from "#src/api/use-send-campaign";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
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
import { getSmsCampaignSchema } from "#src/components/sms-campaign-form/schema";
import { SmsCampaignForm } from "#src/components/sms-campaign-form/sms-campaign-form";
import type { SmsCampaignFormData } from "#src/components/sms-campaign-form/types";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import {
  formatScheduleSmsCampaignPayload,
  formatSendSmsCampaignPayload,
} from "#src/pages/sms-campaign/utils/format-sms-campaign-payload";
import { formatScheduledDateTime } from "#src/pages/utils/format-scheduled-date-time";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

const CreateSmsCampaignPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <CreateSmsCampaign />
    </QueryBoundary>
  );
};

type CreateSmsCampaignContentProps = {
  breadcrumbsItems: ReactNode[];
  recipientTarget: NonNullable<
    ComponentProps<typeof SmsCampaignForm>["recipientTarget"]
  >;
  onSuccess: () => void;
  formatSendPayload: (data: SmsCampaignFormData) => SendSmsCampaignPayload;
  formatSchedulePayload?: (params: {
    data: SmsCampaignFormData;
    datetimeScheduled: string;
  }) => ScheduleCampaignPayload;
};

export function CreateSmsCampaignContent({
  breadcrumbsItems,
  recipientTarget,
  onSuccess,
  formatSendPayload,
  formatSchedulePayload,
}: CreateSmsCampaignContentProps) {
  const { t } = useTranslation(["list", "campaign"]);
  const { detailsLayoutProps } = useDetailsLayout();
  const companyTimezone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "UTC";

  const { sendCampaign, isSending } = useSendCampaign({
    onSuccess: () => {
      onSuccess();
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
  const { scheduleCampaign, isScheduling } = useScheduleCampaign({
    onSuccess: () => {
      onSuccess();
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

  const formId = useId();
  const methods = useFormController({
    mode: "onBlur",
    schema: getSmsCampaignSchema(companyTimezone),
    defaultValues: {
      campaignName: "",
      deliveryMode: DELIVERY_MODE_SEND_NOW,
      scheduledDate: undefined,
      scheduledTime: undefined,
      message: "",
    },
  });
  const deliveryMode = methods.watch("deliveryMode");

  const handleSubmit = async (data: SmsCampaignFormData) => {
    if (data.deliveryMode === DELIVERY_MODE_SCHEDULE_LATER) {
      if (!formatSchedulePayload) {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("prebuilt.creation.toasts.error.scheduleNotSupported", {
            ns: "campaign",
          }),
          buttonIcon: "x-close",
        });
        return;
      }

      if (!data.scheduledDate || !data.scheduledTime) {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t(
            data.scheduledDate
              ? "generic.creation.form.errors.scheduledTimeRequired"
              : "generic.creation.form.errors.scheduledDateRequired",
            { ns: "campaign" },
          ),
          buttonIcon: "x-close",
        });
        return;
      }

      const datetimeScheduled = formatScheduledDateTime({
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        companyTimezone,
      });

      const payload = formatSchedulePayload({ data, datetimeScheduled });

      await scheduleCampaign({
        payload,
      });
      return;
    }

    const payload = formatSendPayload(data);
    await sendCampaign({
      payload,
    });
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
              methods.formState.isSubmitting || isSending || isScheduling
            }
          />,
        ]}
      />
      <DetailsLayout.Content>
        <SmsCampaignForm
          recipientTarget={recipientTarget}
          id={formId}
          onSubmit={handleSubmit}
          {...methods}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}

function CreateSmsCampaign() {
  const { t } = useTranslation(["list", "campaign"]);
  const { navigateToSmartlistCampaigns } = useSmartlistNavigation();
  const queryClient = useQueryClient();
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: smartlistQueryKeys.smartlistKeys.detail(smartlistId),
    });
    navigateToSmartlistCampaigns(smartlistId);
  };

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

  return (
    <CreateSmsCampaignContent
      breadcrumbsItems={breadcrumbsItems}
      recipientTarget={{ type: "smartlist", smartlist_id: smartlist.id }}
      onSuccess={handleSuccess}
      formatSendPayload={(data) =>
        formatSendSmsCampaignPayload({
          smartlistId: smartlist.id,
          data,
        })
      }
      formatSchedulePayload={({ data, datetimeScheduled }) =>
        formatScheduleSmsCampaignPayload({
          smartlistId: smartlist.id,
          data,
          datetimeScheduled,
        })
      }
    />
  );
}

export default CreateSmsCampaignPage;
