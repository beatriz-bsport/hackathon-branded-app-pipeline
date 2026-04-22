import { useId } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import {
  Alert,
  Breadcrumbs,
  Button,
  DetailsLayout,
  dismissToast,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { PopupForm } from "#src/components/PopupForm/PopupForm";
import { getPopupSchema } from "#src/components/PopupForm/schema";
import { PopupFormData } from "#src/components/PopupForm/shared-types";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { useCreate } from "./use-create";

export const PopupCreationPage = () => {
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { t } = useTranslation(["list", "campaign"]);
  const { detailsLayoutProps } = useDetailsLayout();

  const [toastId, setToastId] = useState<string | null>(null);

  const formId = useId();

  const defaultValues = {
    name: "",
    link: "",
    image: undefined,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: getPopupSchema(),
    defaultValues,
  });

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="continue-popup-creation-button"
        color="main"
        intent="call-to-action"
        label={t("popup.creation.continueButtonLabel", { ns: "campaign" })}
        size="md"
        type="submit"
        disabled={methods.formState.isSubmitting}
        form={formId}
      />,
    ],
  });

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);
  const smartlistName = smartlist?.name ?? "";

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={SMARTLIST_APP_LINKS.index()}>
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
        text={smartlistName}
      />
    </Link>,
  ];

  const { createSmartlistPopup } = useCreate({
    onSuccess: () => {
      if (toastId) {
        dismissToast(toastId);
      }
    },
    onFailure: () => {
      if (toastId) {
        dismissToast(toastId);
      }
    },
  });

  const handleSubmit = async (data: PopupFormData) => {
    const processingToastId = toast({
      status: "default",
      title: t("popup.creation.toasts.processing.creatingPopup", {
        ns: "campaign",
      }),
      buttonIcon: "x-close",
      onDismiss: () => setToastId(null),
    });
    setToastId(processingToastId);

    await createSmartlistPopup({
      image: data.image!,
      name: data.name,
      link: data.link,
      smartlist_id: Number(smartlistId),
    });
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("popup.creation.title", { ns: "campaign" })}
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Alert status="default">
          {t("popup.creation.alertMessage", { ns: "campaign" })}
        </Alert>
        <PopupForm id={formId} onSubmit={handleSubmit} {...methods} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
