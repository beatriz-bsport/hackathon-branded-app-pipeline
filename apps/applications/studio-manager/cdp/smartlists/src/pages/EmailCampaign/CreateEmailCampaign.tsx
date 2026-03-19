import { useId } from "react";
import { useParams } from "react-router";

import { fromIsoString } from "@bsport/datetime-manipulation";
import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DELIVERY_MODE_SCHEDULE_LATER,
  DELIVERY_MODE_SEND_NOW,
  EMAIL_TYPE_MARKETING,
} from "#src/components/EmailCampaignForm/constants";
import { EmailCampaignForm } from "#src/components/EmailCampaignForm/email-campaign-form";
import { getEmailCampaignSchema } from "#src/components/EmailCampaignForm/schema";
import type { EmailCampaignFormData } from "#src/components/EmailCampaignForm/types";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
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
  const { t: tList } = useTranslation("list");
  const { t: tCampaign } = useTranslation("campaign");
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);
  const { detailsLayoutProps } = useDetailsLayout();
  const companyTimezone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "UTC";

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

  const handleSubmit = (data: EmailCampaignFormData) => {
    let datetime_scheduled: string | undefined;
    if (
      data.deliveryMode === DELIVERY_MODE_SCHEDULE_LATER &&
      data.scheduledDate &&
      data.scheduledTime
    ) {
      const [hour, minute] = data.scheduledTime.split(":").map(Number);
      const submittedDatetime = fromIsoString(data.scheduledDate, {
        zone: companyTimezone,
      }).set({
        hour,
        minute,
        second: 0,
        millisecond: 0,
      });
      datetime_scheduled = submittedDatetime.toISO() ?? undefined;
    }
    // TODO: Navigate to next step or submit to API; action will be added later.
    console.log({ ...data, datetime_scheduled });
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
            disabled={methods.formState.isSubmitting}
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
    </DetailsLayout>
  );
}

export default CreateEmailCampaignPage;
