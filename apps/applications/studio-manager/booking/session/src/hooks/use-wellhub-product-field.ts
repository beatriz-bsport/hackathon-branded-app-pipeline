import { useEffect, useRef } from "react";

import { useFormContext } from "@bsport/form";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchWellhubProducts } from "#src/hooks/use-fetch-wellhub-products";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";
import {
  ADD_ON_WELLHUB_INTEGRATION,
  useCheckCompanyAddOn,
} from "#src/utils/permission";

import { useFetchAllEstablishments } from "./use-fetch-establishments";

export const useWellhubProductField = (isLivestream: boolean) => {
  const { t } = useTranslation("sessionCreation");

  const hasWellhubIntegration = useCheckCompanyAddOn(
    ADD_ON_WELLHUB_INTEGRATION,
  );

  const company = dataAccessLayer.useCompanyTheme()?.company;

  const { watch, setValue, setError, clearErrors } =
    useFormContext<SessionCreationFormData>();
  const selectedEstablishmentId = watch("establishment");
  const isSessionAvailableOnPartnership = watch("available_on_partnership");
  const selectedWellhubProductId = watch("wellhub_product_id");

  const { data: establishments } = useFetchAllEstablishments({
    company,
    disabled_establishments: false,
    enabled: hasWellhubIntegration && isSessionAvailableOnPartnership,
  });

  const wellhubGymId = selectedEstablishmentId
    ? establishments?.find(({ id }) => id === selectedEstablishmentId)
        ?.wellhub_gym
    : undefined;

  const { data: wellhubProducts, isLoading: isLoadingWellhubProducts } =
    useFetchWellhubProducts({
      wellhubGymId,
      isLivestream,
      enabled: hasWellhubIntegration && isSessionAvailableOnPartnership,
    });

  const selectedWellhubProduct =
    wellhubProducts?.find(
      (product) => product.id === selectedWellhubProductId?.toString(),
    ) ?? null;

  const prevEstablishmentRef = useRef(selectedEstablishmentId);

  const errorMessage = t(
    "addSessionModal.steps.configureSession.settings.partnership.wellhub.error",
  );

  useEffect(() => {
    const establishmentChanged =
      prevEstablishmentRef.current !== selectedEstablishmentId;
    prevEstablishmentRef.current = selectedEstablishmentId;

    const shouldClear =
      establishmentChanged ||
      (wellhubProducts &&
        selectedWellhubProductId &&
        !selectedWellhubProduct) ||
      !isSessionAvailableOnPartnership;

    if (wellhubProducts?.length === 1) {
      const singleProductId = Number(wellhubProducts[0].id);
      if (selectedWellhubProductId !== singleProductId) {
        setValue("wellhub_product_id", singleProductId, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    } else if (shouldClear) {
      setValue("wellhub_product_id", null, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [
    wellhubProducts,
    selectedWellhubProductId,
    setValue,
    selectedWellhubProduct,
    selectedEstablishmentId,
    isSessionAvailableOnPartnership,
  ]);

  // Validate wellhub_product_id is required when partnership is enabled and products exist
  useEffect(() => {
    const isRequired =
      isSessionAvailableOnPartnership &&
      (isLoadingWellhubProducts || !!wellhubProducts?.length) &&
      selectedWellhubProductId == null;

    if (isRequired) {
      setError("wellhub_product_id", {
        type: "required",
        message: errorMessage,
      });
    } else {
      clearErrors("wellhub_product_id");
    }
  }, [
    isSessionAvailableOnPartnership,
    isLoadingWellhubProducts,
    wellhubProducts,
    selectedWellhubProductId,
    setError,
    clearErrors,
    errorMessage,
  ]);

  return {
    wellhubProducts,
    selectedWellhubProduct,
    isSessionAvailableOnPartnership,
    isLoadingWellhubProducts,
    setValue,
  };
};
