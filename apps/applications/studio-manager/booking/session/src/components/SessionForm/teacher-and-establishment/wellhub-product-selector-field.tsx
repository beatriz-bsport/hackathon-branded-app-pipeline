import { FC } from "react";

import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { useWellhubProductField } from "#src/hooks/use-wellhub-product-field";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
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
  } = useWellhubProductField(isLivestream);

  if (!wellhubProducts || !isSessionAvailableOnPartnership) return null;

  return (
    <FormField<SessionCreationFormData, "wellhub_product_id", SelectProps>
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
          selectedWellhubProduct?.label ??
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
      />
    </FormField>
  );
};
