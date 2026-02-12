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
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { useEdit } from "./use-edit";

export const PopupEditPage = () => {
  const { id: rawSmartlistId } = useParams<{ id: string }>();
  invariant(rawSmartlistId, "Expected smartlist id param to be defined");

  const smartlistId = Number(rawSmartlistId);
  invariant(!isNaN(smartlistId), "Expected smartlist id to be a valid number");

  const { popupId: rawPopupId } = useParams<{ popupId: string }>();
  invariant(rawPopupId, "Expected popup id param to be defined");

  const popupId = Number(rawPopupId);
  invariant(!isNaN(popupId), "Expected popup id to be a valid number");

  const { t } = useTranslation("campaign");
  const { detailsLayoutProps } = useDetailsLayout();

  const [toastId, setToastId] = useState<string | null>(null);

  const formId = useId();

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(
    String(smartlistId),
  );
  const smartlistName = smartlist?.name ?? "";

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
        label={t("popup.edit.continueButtonLabel")}
        size="md"
        type="submit"
        disabled={methods.formState.isSubmitting || isLoadingImage}
        form={formId}
      />,
    ],
  });

  const breadcrumbsItems = [
    <Breadcrumbs.Item
      id="breadcrumb-smartlist"
      key="breadcrumb-smartlist"
      text={smartlistName}
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
      title: t("popup.edit.toasts.processing.editingPopup"),
      onDismiss: () => setToastId(null),
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
        pageTitle={t("popup.edit.title")}
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Alert status="default">{t("popup.edit.alertMessage")}</Alert>
        <PopupForm id={formId} onSubmit={handleSubmit} {...methods} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
