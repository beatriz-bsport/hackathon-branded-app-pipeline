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
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { useUpdateScheduledEmailCampaign } from "#src/api/use-update-scheduled-email-campaign";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { getSmsCampaignSchema } from "#src/components/sms-campaign-form/schema";
import { SmsCampaignForm } from "#src/components/sms-campaign-form/sms-campaign-form";
import type { SmsCampaignFormData } from "#src/components/sms-campaign-form/types";
import { formatScheduleSmsCampaignPayload } from "#src/pages/sms-campaign/utils/format-sms-campaign-payload";
import { initSmsCampaignFormDefaultValues } from "#src/pages/sms-campaign/utils/init-sms-campaign-form-default-values";
import { formatScheduledDateTime } from "#src/pages/utils/format-scheduled-date-time";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

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
  const { formDefaults } = initSmsCampaignFormDefaultValues({
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

  const handleSubmit = async (data: SmsCampaignFormData) => {
    if (!data.scheduledDate || !data.scheduledTime) return;

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

    await updateScheduledCampaign({
      campaignScheduledId: entityId,
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
            disabled={methods.formState.isSubmitting || isUpdating}
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

export default EditSmsCampaignPage;
