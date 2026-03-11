import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { Alert, DetailsLayout, Title } from "@bsport/kaizen-primitive-core";

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
  isSharedGiftcard?: boolean;
};

export const GiftcardEditorContent: FC<GiftcardEditorContentProps> = ({
  formId,
  methods,
  isSharedGiftcard,
}) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <DetailsLayout.Content className="flex flex-col gap-md w-full">
      {isSharedGiftcard && (
        <Alert status="info" layout="banner" customIcon="lock-04">
          {t("editor.sharedGiftcardCanNotBeEdited")}
        </Alert>
      )}

      <GiftcardFormCover
        formId={formId}
        methods={methods}
        isSharedGiftcard={isSharedGiftcard}
      />

      <GiftcardFormValue
        formId={formId}
        methods={methods}
        isSharedGiftcard={isSharedGiftcard}
      />

      <GiftcardFormName formId={formId} isSharedGiftcard={isSharedGiftcard} />
      <GiftcardFormDescription
        formId={formId}
        isSharedGiftcard={isSharedGiftcard}
      />

      <GiftcardFormExpirationDays
        formId={formId}
        methods={methods}
        isSharedGiftcard={isSharedGiftcard}
      />

      <Title htmlVariant="h4" weight="strong">
        {t("sections.pricing")}
      </Title>
      <GiftcardFormPaymentMethods
        formId={formId}
        methods={methods}
        isSharedGiftcard={isSharedGiftcard}
      />
    </DetailsLayout.Content>
  );
};
