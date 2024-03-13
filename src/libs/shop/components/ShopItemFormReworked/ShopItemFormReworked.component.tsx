import React, { useCallback, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import ShopItemFormProductStep from './ShopItemFormProductStep.component';
import ShopItemFormVariantStep from './ShopItemFormVariantStep.component';

import type { ShopItem, ShopItemCreate, ShopItemEdit } from '#libs/shop/types';
import {
  ShopItemFormStep,
  ShopItemFormValues,
  ShopItemVariantOption,
} from './types';

import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

import { shopItemFormValidationSchema } from './shopItemFormValidationSchema';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.ShopItem,
  );

type Props = {
  onCreateSubmit?: (values: ShopItemCreate) => void;
  onUpdateSubmit?: (formData: Partial<ShopItemEdit>, id: number) => void;
  initial?: ShopItem;
  isLoading?: boolean;
  onCancel: () => void;
  provincialTax: number;
  isEditForm?: boolean;
};

const ShopItemFormReworked: React.FC<Props> = ({
  onCreateSubmit,
  onUpdateSubmit,
  initial,
  isLoading,
  onCancel,
  provincialTax,
  isEditForm,
}) => {
  const initialValues = useMemo(
    () => ({
      name: initial?.name ?? '',
      subtitle: initial?.subtitle ?? '',
      price: initial ? parseFloat(initial?.price) : 0,
      supplierPrice: initial ? parseFloat(initial?.supplier_price) : 0,
      cover: initial?.cover ?? null,
      tva: initial ? parseFloat(initial?.tva) : 0,
      description: initial?.description ?? '',
      barcode: initial?.barcode ?? '',
      stockKeepingUnit: initial?.stock_keeping_unit ?? '',
      marketplaceEnabled: initial?.marketplace_enabled ?? false,
      availablePaymentMethodIdentifiers:
        initial?.available_payment_method_identifiers ?? [
          CB.id,
          CREDIT_ACCOUNT.id,
        ],
      featured: initial?.featured ?? false,
      sellOnlyOnProvision: initial?.sell_only_on_provision ?? false,
      isDeliverable: initial?.is_deliverable ?? true,
      subshop: initial?.subshop ?? null,
    }),
    [initial],
  );

  const [formStep, setFormStep] = useState<ShopItemFormStep>(
    ShopItemFormStep.PRODUCT,
  );

  const handlePreviousStep = useCallback(() => {
    setFormStep(ShopItemFormStep.PRODUCT);
  }, []);

  const handleNextStep = useCallback(() => {
    setFormStep(ShopItemFormStep.VARIANT);
  }, []);

  const handleCancel = useCallback(() => {
    onCancel();
    trackFormCancel(initial?.id);
  }, [initial?.id, onCancel]);

  /**
   * Transforms variant options from formik to valid object for FormData
   * @example
   * const colorsAndSizes = getVariantPayloadFromFormik(values.colors, values.sizes)
   * // { 'variants.colors[0]': 'Black', 'variants.sizes[0]': 'S', ... }
   */
  const getVariantPayloadFromFormik = useCallback(
    (colors: ShopItemVariantOption[], sizes: ShopItemVariantOption[]) => {
      const clonedColors = (colors || []).map((option) => option);
      const clonedSizes = (sizes || []).map((option) => option);

      const shouldCreateVariants =
        !!(clonedColors.length > 0) || !!(clonedSizes.length > 0);

      if (!shouldCreateVariants) return {};

      const mappedColors = clonedColors.reduce<{ [key: string]: string }>(
        (acc, option, index) => {
          acc[`variants.colors[${index}]`] = option.value;
          return acc;
        },
        {},
      );
      const mappedSizes = clonedSizes.reduce<{ [key: string]: string }>(
        (acc, option, index) => {
          acc[`variants.sizes[${index}]`] = option.value;
          return acc;
        },
        {},
      );
      return { ...mappedColors, ...mappedSizes };
    },
    [],
  );

  const handleOnSubmit = useCallback(
    (values: ShopItemFormValues) => {
      if (!isEditForm && formStep === ShopItemFormStep.PRODUCT) {
        setFormStep(ShopItemFormStep.VARIANT);
      } else {
        trackFormSubmitIntent(initial?.id);

        const variantsPayload = getVariantPayloadFromFormik(
          values?.colors,
          values?.sizes,
        );

        const payload = {
          name: values.name,
          ...(values.subtitle && { subtitle: values.subtitle }),
          price: values.price,
          supplier_price: values.supplierPrice.toString(),
          ...(!!values.cover &&
            typeof values.cover !== 'string' && { cover: values.cover }),
          tva: values.tva.toString(),
          ...(!!values.description && { description: values.description }),
          barcode: values.barcode,
          marketplace_enabled: values.marketplaceEnabled,
          'available_payment_method_identifiers[]': JSON.stringify(
            values.availablePaymentMethodIdentifiers,
          ),
          featured: values.featured,
          sell_only_on_provision: values.sellOnlyOnProvision,
          is_deliverable: values.isDeliverable,
          ...(!!values.subshop && { subshop: values.subshop }),
          ...(!!values.stockKeepingUnit && {
            stock_keeping_unit: values.stockKeepingUnit,
          }),
          ...(!!values.supplier && { supplier: values.supplier }),
          ...variantsPayload,
        };

        isEditForm
          ? onUpdateSubmit(payload, initial?.id)
          : onCreateSubmit(payload);
      }
    },
    [
      formStep,
      getVariantPayloadFromFormik,
      initial?.id,
      isEditForm,
      onCreateSubmit,
      onUpdateSubmit,
    ],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={shopItemFormValidationSchema}
    >
      <Form noValidate>
        {formStep === ShopItemFormStep.PRODUCT && (
          <ShopItemFormProductStep
            handleCancel={handleCancel}
            handleNextStep={handleNextStep}
            isEditForm={isEditForm}
            isLoading={isLoading}
            provincialTax={provincialTax}
          />
        )}
        {formStep === ShopItemFormStep.VARIANT && (
          <ShopItemFormVariantStep handlePreviousStep={handlePreviousStep} />
        )}
      </Form>
    </Formik>
  );
};

export default React.memo(ShopItemFormReworked);
