import { useId } from "react";
import { useState } from "react";
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

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { PopupForm } from "#src/components/PopupForm/PopupForm";
import { getPopupSchema } from "#src/components/PopupForm/schema";
import { PopupFormData } from "#src/components/PopupForm/shared-types";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { useCreate } from "./use-create";

export const PopupCreationPage = () => {
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { t } = useTranslation("campaign");
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
        label={t("popup.creation.continueButtonLabel")}
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
    <Breadcrumbs.Item
      id="breadcrumb-smartlist"
      key="breadcrumb-smartlist"
      text={smartlistName}
    />,
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
      title: t("popup.creation.toasts.processing.creatingPopup"),
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
        pageTitle={t("popup.creation.title")}
        endGroupActions={endGroupActions}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Alert status="default">{t("popup.creation.alertMessage")}</Alert>
        <PopupForm id={formId} onSubmit={handleSubmit} {...methods} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
