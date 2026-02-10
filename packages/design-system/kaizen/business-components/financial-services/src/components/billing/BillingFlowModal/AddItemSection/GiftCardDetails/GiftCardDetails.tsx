import React from "react";

import { useFormContext } from "@bsport/form";
import { Divider, Title } from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { BackgroundImageField } from "./BackgroundImageField";
import { DeliveryFormatField } from "./DeliveryFormatField";
import { ExpirationAlert } from "./ExpirationAlert";
import { FromToFields } from "./FromToFields";
import { PersonalMessageField } from "./PersonalMessageField";
import { RecipientEmailsField } from "./RecipientEmailsField";
import { RecipientNameField } from "./RecipientNameField";
import { ScheduledDateTimeField } from "./ScheduledDateTimeField";
import { ValidFromField } from "./ValidFromField";

export const GiftCardDetails: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch } = useFormContext<BillingFlowFormState>();

  const deliveryFormat = watch("addItemGiftcardDeliveryFormat");

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h5" color="default" weight="strong">
        {t("billingFlowModal.giftCardDetails.title")}
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
          <BackgroundImageField />
          <RecipientEmailsField />
          <ScheduledDateTimeField />
          <ExpirationAlert />
        </>
      )}
    </div>
  );
};
