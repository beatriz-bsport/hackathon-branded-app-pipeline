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

import { useScheduleCampaign } from "#src/api/use-schedule-campaign";
import { useSendCampaign } from "#src/api/use-send-campaign";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import {
  DELIVERY_MODE_SCHEDULE_LATER,
  DELIVERY_MODE_SEND_NOW,
} from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import { getSmsCampaignSchema } from "#src/components/sms-campaign-form/schema";
import { SmsCampaignForm } from "#src/components/sms-campaign-form/sms-campaign-form";
import type { SmsCampaignFormData } from "#src/components/sms-campaign-form/types";
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

function CreateSmsCampaign() {
  const { t: tList } = useTranslation("list");
  const { t: tCampaign } = useTranslation("campaign");
  const navigate = useNavigate();
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);
  const { detailsLayoutProps } = useDetailsLayout();
  const companyTimezone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "UTC";

  const { sendCampaign, isSending } = useSendCampaign({
    onSuccess: () => {
      navigate(SMARTLIST_APP_LINKS.campaign(smartlistId));
      toast({
        status: "default",
        icon: "check",
        title: tCampaign("sms.creation.toasts.success.send"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: tCampaign("sms.creation.toasts.error.sendFailed"),
        buttonIcon: "x-close",
      });
    },
  });
  const { scheduleCampaign, isScheduling } = useScheduleCampaign({
    onSuccess: () => {
      navigate(SMARTLIST_APP_LINKS.campaign(smartlistId));
      toast({
        status: "default",
        icon: "check",
        title: tCampaign("sms.creation.toasts.success.schedule"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: tCampaign("sms.creation.toasts.error.sendFailed"),
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

  const handleSubmit = async (data: SmsCampaignFormData) => {
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

      const payload = formatScheduleSmsCampaignPayload({
        smartlistId: smartlist.id,
        data,
        datetimeScheduled,
      });

      await scheduleCampaign({
        payload,
      });
      return;
    }

    const payload = formatSendSmsCampaignPayload({
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
        pageTitle={tCampaign("sms.creation.title")}
        BreadcrumbsItems={breadcrumbsItems}
        callToActionButton={
          <Button
            color="main"
            intent="call-to-action"
            label={tCampaign("sms.creation.continueButtonLabel")}
            size="md"
            type="submit"
            form={formId}
            disabled={
              methods.formState.isSubmitting || isSending || isScheduling
            }
          />
        }
      />
      <DetailsLayout.Content>
        <SmsCampaignForm
          smartlistId={smartlist.id}
          id={formId}
          onSubmit={handleSubmit}
          {...methods}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}

export default CreateSmsCampaignPage;
