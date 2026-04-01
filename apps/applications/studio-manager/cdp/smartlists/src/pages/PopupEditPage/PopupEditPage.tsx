import { useEffect, useId, useState } from "react";
import { useParams } from "react-router";

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

import {
  useFetchPopupDetailSuspenseQuery,
  usePopupImageFileSuspenseQuery,
} from "#src/api/use-popup-detail";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { PopupForm } from "#src/components/PopupForm/PopupForm";
import { getPopupSchema } from "#src/components/PopupForm/schema";
import { PopupFormData } from "#src/components/PopupForm/shared-types";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { useEdit } from "./use-edit";

export const PopupEditPage = () => {
  const { id: rawSmartlistId } = useParams<{ id: string }>();
  invariant(rawSmartlistId, "Expected smartlist id param to be defined");

  const smartlistId = Number(rawSmartlistId);
  invariant(!isNaN(smartlistId), "Expected smartlist id to be a valid number");

  const { entityId } = useParams<{
    entityId: string;
  }>();
  invariant(entityId, "Expected popup id param to be defined");

  const popupId = Number(entityId);
  invariant(!isNaN(popupId), "Expected popup id to be a valid number");

  const { t: tCampaign } = useTranslation("campaign");
  const { t: tList } = useTranslation("list");
  const { detailsLayoutProps } = useDetailsLayout();

  const [toastId, setToastId] = useState<string | null>(null);

  const formId = useId();

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(
    String(smartlistId),
  );

  const { data: popup } = useFetchPopupDetailSuspenseQuery(popupId);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const methods = useFormController({
    mode: "onBlur",
    schema: getPopupSchema(),
    defaultValues: {
      name: popup.name,
      link: popup.link,
      image: undefined,
    },
  });

  const imageQuery = usePopupImageFileSuspenseQuery(popupId, popup.image);

  useEffect(() => {
    if (!methods.getValues("image") && imageQuery.data) {
      methods.setValue("image", imageQuery.data);
    }
    setIsLoadingImage(false);
  }, [imageQuery.data, methods]);

  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="continue-popup-edit-button"
        color="main"
        intent="call-to-action"
        label={tCampaign("popup.edit.continueButtonLabel")}
        size="md"
        type="submit"
        disabled={methods.formState.isSubmitting || isLoadingImage}
        form={formId}
      />,
    ],
  });

  const smartlistName = smartlist?.name ?? "";

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
      text={smartlistName}
      href={SMARTLIST_APP_LINKS.campaign(String(smartlistId))}
    />,
  ];

  const { editPopup } = useEdit({
    smartlistId: smartlistId,
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
      title: tCampaign("popup.edit.toasts.processing.editingPopup"),
      onDismiss: () => setToastId(null),
      buttonIcon: "x-close",
    });
    setToastId(processingToastId);

    await editPopup({
      id: popupId,
      image: data.image!,
      name: data.name,
      link: data.link,
    });
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={tCampaign("popup.edit.title")}
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Alert status="default">{tCampaign("popup.edit.alertMessage")}</Alert>
        <PopupForm id={formId} onSubmit={handleSubmit} {...methods} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
