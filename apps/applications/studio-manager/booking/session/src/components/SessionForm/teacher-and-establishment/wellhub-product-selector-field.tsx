import { FC } from "react";

import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { useWellhubProductField } from "#src/hooks/use-wellhub-product-field";
import type { SessionWellhubProductFormValues } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

export const WellhubProductSelectorField: FC<{
  fieldIdPrefix: string;
  isLivestream: boolean;
}> = ({ fieldIdPrefix, isLivestream }) => {
  const { t } = useTranslation("sessionCreation");

  const {
    wellhubProducts,
    selectedWellhubProduct,
    isSessionAvailableOnPartnership,
    isLoadingWellhubProducts,
    partnershipAccountExternalId,
  } = useWellhubProductField(isLivestream);

  if (
    !wellhubProducts ||
    wellhubProducts.length === 0 ||
    !isSessionAvailableOnPartnership ||
    !partnershipAccountExternalId
  )
    return null;

  return (
    <FormField<
      SessionWellhubProductFormValues,
      "wellhub_product_id",
      SelectProps
    >
      name="wellhub_product_id"
      mapProps={({ form: { setValue } }) => ({
        onChange: (selectedOptionId) => {
          const nextValue =
            selectedOptionId == null ? null : Number(selectedOptionId);
          setValue("wellhub_product_id", nextValue, {
            shouldValidate: true,
            shouldDirty: true,
          });
        },
        value:
          selectedWellhubProduct?.id ??
          t(
            "addSessionModal.steps.configureSession.settings.partnership.wellhub.placeholder",
          ),
      })}
    >
      <Select
        items={wellhubProducts}
        id={`${fieldIdPrefix}-wellhub-product-selector`}
        label={t(
          "addSessionModal.steps.configureSession.settings.partnership.wellhub.label",
        )}
        helperText={t(
          "addSessionModal.steps.configureSession.settings.partnership.wellhub.helperText",
        )}
        required
        loadingProps={{ isLoading: isLoadingWellhubProducts }}
        className="min-w-component-select"
      />
    </FormField>
  );
};
