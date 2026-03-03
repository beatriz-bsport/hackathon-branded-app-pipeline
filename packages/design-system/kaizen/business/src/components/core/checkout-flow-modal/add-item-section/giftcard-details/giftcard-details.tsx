import React from "react";

import type { Fetch } from "@bsport/fetch";
import { useFormContext } from "@bsport/form";
import { Divider, Title } from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

import { BackgroundImageField } from "./background-image-field";
import { DeliveryFormatField } from "./delivery-format-field";
import { ExpirationAlert } from "./expiration-alert";
import { FromToFields } from "./from-to-fields";
import { PersonalMessageField } from "./personal-message-field";
import { RecipientEmailsField } from "./recipient-emails-field";
import { RecipientNameField } from "./recipient-name-field";
import { ScheduledDateTimeField } from "./scheduled-date-time-field";
import { ValidFromField } from "./valid-from-field";

type GiftcardDetailsProps = {
  companyId: number;
  fetch: Fetch;
};

export const GiftcardDetails: React.FC<GiftcardDetailsProps> = ({
  companyId,
  fetch,
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch } = useFormContext<CheckoutFlowFormState>();

  const deliveryFormat = watch("addItemGiftcardDeliveryFormat");

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h5" color="default" weight="strong">
        {t("checkoutFlowModal.giftCardDetails.title")}
      </Title>

      <RecipientNameField />
      <FromToFields />
      <PersonalMessageField />
      <DeliveryFormatField />
      <Divider orientation="horizontal" weight="thin" />

      {deliveryFormat === "pdf" && (
        <>
          <ValidFromField />
          <ExpirationAlert />
        </>
      )}

      {deliveryFormat === "email" && (
        <>
          <BackgroundImageField companyId={companyId} fetch={fetch} />
          <RecipientEmailsField />
          <ScheduledDateTimeField />
          <ExpirationAlert />
        </>
      )}
    </div>
  );
};
