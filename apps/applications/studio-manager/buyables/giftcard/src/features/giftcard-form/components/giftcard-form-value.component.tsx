import type { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { FormField } from "@bsport/form";
import { Link, Toggle, type ToggleProps } from "@bsport/kaizen-primitive-core";

import { FormPriceField } from "#src/components/form-price-field.component";
import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { GiftcardFormData, GiftcardFormMethods } from "../types";

type GiftcardFormValueProps = {
  formId: string;
  methods: GiftcardFormMethods;
};

const INTERCOM_ARTICLE =
  "https://intercom.help/bsport-helpcenter/en/articles/12730161-how-to-set-up-a-custom-amount-gift-card";

export const GiftcardFormValue: FC<GiftcardFormValueProps> = ({
  formId,
  methods,
}) => {
  const { t } = useTranslation("giftcard-details");

  const hasCustomPrice = methods.watch("hasCustomPrice");
  const maxPrice = methods.watch("max_price");
  const minPrice = methods.watch("min_price");

  const hasMinMaxPriceIssue =
    hasCustomPrice && minPrice && maxPrice && minPrice > maxPrice;
  const minMaxError = {
    status: "error",
    statusText: t("formFields.customValue.minMaxError"),
  } as const;

  return (
    <>
      <FormPriceField<GiftcardFormData, "price">
        fieldName="price"
        id={`${formId}-value`}
        min={FIELD_CONSTRAINTS.PRICE_MIN}
        max={FIELD_CONSTRAINTS.PRICE_MAX}
        label={t("formFields.value.label")}
        helperText={t("formFields.value.helperText")}
        required={!hasCustomPrice}
        disabled={hasCustomPrice}
      />

      <FormField<GiftcardFormData, "hasCustomPrice", ToggleProps>
        name="hasCustomPrice"
        mapProps={({ defaultProps, field }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { statusText: _, ...otherDefaultProps } = defaultProps;
          return {
            ...otherDefaultProps,
            // Required to avoid conflict with typing of Toggle.value
            value: "",
            checked: field.value,
          };
        }}
      >
        {/** @ts-expect-error Pass props implicitely - FormField is forwarding the `checked` props */}
        <Toggle
          id={`${formId}-toggle-custom-price`}
          label={t("formFields.customValue.toggle.label")}
        />
      </FormField>

      {hasCustomPrice && (
        <div className="ml-[40px]">
          <FormPriceField<GiftcardFormData, "min_price">
            fieldName="min_price"
            id={`${formId}-min-price`}
            min={FIELD_CONSTRAINTS.PRICE_MIN}
            max={FIELD_CONSTRAINTS.PRICE_MAX}
            label={t("formFields.customValue.minimumValue.label")}
            helperText={t("formFields.customValue.minimumValue.helperText")}
            required={hasCustomPrice}
            disabled={!hasCustomPrice}
            {...(hasMinMaxPriceIssue ? minMaxError : {})}
          />

          <FormPriceField<GiftcardFormData, "max_price">
            fieldName="max_price"
            id={`${formId}-max-price`}
            min={FIELD_CONSTRAINTS.PRICE_MIN}
            max={FIELD_CONSTRAINTS.PRICE_MAX}
            label={t("formFields.customValue.maximumValue.label")}
            helperText={t("formFields.customValue.maximumValue.helperText", {
              maxPriceWithCurrency: getCurrencyDisplayWithPrice(
                FIELD_CONSTRAINTS.PRICE_MAX,
              ),
            })}
            required={hasCustomPrice}
            disabled={!hasCustomPrice}
            {...(hasMinMaxPriceIssue ? minMaxError : {})}
          />

          <Link
            color="main"
            href={INTERCOM_ARTICLE}
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
