import { useId } from "react";
import { useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

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
import { SMARTLIST_COMMUNICATION_URLS, URLS } from "#src/urls";
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

  const formId = useId();

  const methods = useFormController({
    mode: "onBlur",
    schema: getEmailCampaignSchema(),
    defaultValues: {
      emailType: EMAIL_TYPE_MARKETING,
      campaignName: "",
    },
  });

  const breadcrumbsItems = [
    <Breadcrumbs.Item
      key="breadcrumb-smartlists"
      id="breadcrumb-smartlists"
      text={tList("title")}
      href={SMARTLIST_COMMUNICATION_URLS.SMARTLIST_ROUTE_FROM_SUBNAV}
    />,
    <Breadcrumbs.Item
      key="breadcrumb-smartlists-campaigns"
      id="breadcrumb-smartlists-campaigns"
      text={smartlist?.name ?? ""}
      href={URLS.campaignPath(smartlistId.toString())}
    />,
  ];

  const handleSubmit = (data: EmailCampaignFormData) => {
    // TODO: Navigate to next step or submit to API; action will be added later.
    console.log(data);
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
