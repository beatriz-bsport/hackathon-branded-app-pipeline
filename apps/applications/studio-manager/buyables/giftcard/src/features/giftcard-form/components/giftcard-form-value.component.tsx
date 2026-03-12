import type { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { getCurrencyCode } from "@bsport/currency";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";
import { FormToggle } from "@bsport/kaizen-business-components/form/toggle";
import { Link } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { GiftcardFormData, GiftcardFormMethods } from "../types";

type GiftcardFormValueProps = {
  formId: string;
  methods: GiftcardFormMethods;
  isSharedGiftcard?: boolean;
};

function getIntercomArticleLink({
  language,
  articleId,
}: {
  language: string;
  articleId: string;
}) {
  return `https://intercom.help/bsport-helpcenter/${language}/articles/${articleId}`;
}

const INTERCOM_ARTICLE_ID = "12730161";

export const GiftcardFormValue: FC<GiftcardFormValueProps> = ({
  formId,
  methods,
  isSharedGiftcard,
}) => {
  const { t, i18n } = useTranslation("giftcard-details");

  const hasCustomPrice = methods.watch("hasCustomPrice");
  const maxPrice = methods.watch("max_price");
  const minPrice = methods.watch("min_price");

  const hasMinMaxPriceIssue =
    hasCustomPrice && minPrice && maxPrice && minPrice > maxPrice;
  const minMaxError = {
    status: "error",
    statusText: t("formFields.customValue.minMaxError"),
  } as const;

  const priceField = {
    suffix: {
      type: "text",
      value: getCurrencyCode().toLocaleUpperCase(),
    },
    min: FIELD_CONSTRAINTS.PRICE_MIN,
    max: FIELD_CONSTRAINTS.PRICE_MAX,
    className: "w-full",
  } as const;

  return (
    <>
      <FormNumberField<GiftcardFormData, "price">
        fieldName="price"
        id={`${formId}-value`}
        label={t("formFields.value.label")}
        helperText={t("formFields.value.helperText")}
        required={!hasCustomPrice}
        disabled={hasCustomPrice || isSharedGiftcard}
        {...priceField}
      />

      <FormToggle<GiftcardFormData, "hasCustomPrice">
        fieldName="hasCustomPrice"
        id={`${formId}-toggle-custom-price`}
        label={t("formFields.customValue.toggle.label")}
        disabled={isSharedGiftcard}
      />

      {hasCustomPrice && (
        <div className="ml-[40px]">
          <FormNumberField<GiftcardFormData, "min_price">
            fieldName="min_price"
            id={`${formId}-min-price`}
            label={t("formFields.customValue.minimumValue.label")}
            helperText={t("formFields.customValue.minimumValue.helperText")}
            required={hasCustomPrice}
            disabled={!hasCustomPrice || isSharedGiftcard}
            {...priceField}
            {...(hasMinMaxPriceIssue ? minMaxError : {})}
          />

          <FormNumberField<GiftcardFormData, "max_price">
            fieldName="max_price"
            id={`${formId}-max-price`}
            label={t("formFields.customValue.maximumValue.label")}
            helperText={t("formFields.customValue.maximumValue.helperText", {
              maxPriceWithCurrency: getCurrencyDisplayWithPrice(
                FIELD_CONSTRAINTS.PRICE_MAX,
              ),
            })}
            required={hasCustomPrice}
            disabled={!hasCustomPrice || isSharedGiftcard}
            {...priceField}
            {...(hasMinMaxPriceIssue ? minMaxError : {})}
          />

          <Link
            color="main"
            href={getIntercomArticleLink({
              articleId: INTERCOM_ARTICLE_ID,
              language: i18n.language,
            })}
            weight="weak"
            className="text-body-sm"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("formFields.customValue.maximumValue.limitExplanation")}
          </Link>
        </div>
      )}
    </>
  );
};
