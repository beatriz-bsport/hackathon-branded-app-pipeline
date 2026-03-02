import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { DetailsLayout, Title } from "@bsport/kaizen-primitive-core";

import { GiftcardFormCover } from "#src/features/giftcard-form/components/giftcard-form-cover.component";
import { GiftcardFormDescription } from "#src/features/giftcard-form/components/giftcard-form-description.component";
import { GiftcardFormExpirationDays } from "#src/features/giftcard-form/components/giftcard-form-expiration-days.component";
import { GiftcardFormName } from "#src/features/giftcard-form/components/giftcard-form-name.component";
import { GiftcardFormPaymentMethods } from "#src/features/giftcard-form/components/giftcard-form-payment-methods.component";
import { GiftcardFormValue } from "#src/features/giftcard-form/components/giftcard-form-value.component";
import type { GiftcardFormSchema } from "#src/features/giftcard-form/types";
import { useTranslation } from "#src/utils/i18n";

type GiftcardEditorContentProps = {
  formId: string;
  methods: UseFormControllerOutput<GiftcardFormSchema>;
};

export const GiftcardEditorContent: FC<GiftcardEditorContentProps> = ({
  formId,
  methods,
}) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <DetailsLayout.Content className="flex flex-col gap-md w-full">
      <GiftcardFormCover formId={formId} methods={methods} />

      <GiftcardFormValue formId={formId} methods={methods} />

      <GiftcardFormName formId={formId} />
      <GiftcardFormDescription formId={formId} />

      <GiftcardFormExpirationDays formId={formId} methods={methods} />

      <Title htmlVariant="h4" weight="strong">
        {t("sections.pricing")}
      </Title>
      <GiftcardFormPaymentMethods formId={formId} methods={methods} />
    </DetailsLayout.Content>
  );
};
