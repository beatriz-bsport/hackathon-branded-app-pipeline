import { useId } from "react";
import { useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Alert,
  Breadcrumbs,
  Button,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { DELIVERY_MODE_SEND_NOW } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import { PushCampaignForm } from "#src/components/push-campaign-form/push-campaign-form";
import { getPushCampaignSchema } from "#src/components/push-campaign-form/schema";
import type { PushCampaignFormData } from "#src/components/push-campaign-form/types";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

const CreatePushCampaignPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <CreatePushCampaign />
    </QueryBoundary>
  );
};

function CreatePushCampaign() {
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
    schema: getPushCampaignSchema(companyTimezone),
    defaultValues: {
      campaignName: "",
      deliveryMode: DELIVERY_MODE_SEND_NOW,
      scheduledDate: undefined,
      scheduledTime: undefined,
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

  const handleSubmit = (data: PushCampaignFormData) => {
    // TODO: Navigate to next step or submit to API; action will be added later.
    console.log(data);
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={tCampaign("push.creation.title")}
        BreadcrumbsItems={breadcrumbsItems}
        callToActionButton={
          <Button
            color="main"
            intent="call-to-action"
            label={tCampaign("push.creation.continueButtonLabel")}
            size="md"
            type="submit"
            form={formId}
            disabled={methods.formState.isSubmitting}
          />
        }
      />
      <DetailsLayout.Content>
        <div className="flex flex-col gap-md">
          <Alert status="default">
            {tCampaign("push.creation.alertMessage")}
          </Alert>
          <PushCampaignForm id={formId} onSubmit={handleSubmit} {...methods} />
        </div>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}

export default CreatePushCampaignPage;
