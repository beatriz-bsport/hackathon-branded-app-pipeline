import React, { useCallback, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import type { OptionsType } from 'react-select/lib/types';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import ShopItemFormProductStep from './ShopItemFormProductStep.component';
import ShopItemFormVariantStep from './ShopItemFormVariantStep.component';

import type {
  ShopSupplier,
  ShopItem,
  ShopItemCreate,
  ShopItemEdit,
  ShopSupplierTemplate,
  ShopItemTemplate,
} from '#libs/shop/types';
import type { BookkeepingAccount } from '#libs/payment/types';
import {
  ShopItemFormStep,
  ShopItemFormValues,
  ShopItemVariantOption,
} from './types';

import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

import shopItemFormValidationSchema from './shopItemFormValidationSchema';
import { generateShopitemColorSizeCombinationList } from '#libs/shop/utils';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.ShopItem,
  );

type Props = {
  onCreateSubmit?: (values: ShopItemCreate) => void;
  onUpdateSubmit?: (formData: ShopItemEdit, id: number) => void;
  initial?: ShopItem | ShopItemTemplate;
  isLoading?: boolean;
  onCancel: () => void;
  provincialTax?: number;
  isEditForm?: boolean;
  supplierList: ShopSupplier[] | ShopSupplierTemplate[];
  bookkeepingAccounts?: BookkeepingAccount[];
  bookkeepingAccountById?: Record<number, BookkeepingAccount>;
};

const ShopItemFormReworked: React.FC<Props> = ({
  onCreateSubmit,
  onUpdateSubmit,
  initial,
  isLoading,
  onCancel,
  provincialTax,
  isEditForm,
  supplierList,
  bookkeepingAccounts,
  bookkeepingAccountById,
}: Props) => {
  const classes = useStyles();

  const { t } = useTranslation('shop');

  const initialValues: ShopItemFormValues = useMemo(
    () => ({
      name: initial?.name ?? '',
      subtitle: initial?.subtitle ?? '',
      price: initial ? parseFloat(initial?.price) : null,
      supplier:
        (initial as ShopItemTemplate)?.supplier_template ??
        (initial as ShopItem)?.supplier ??
        null,
      supplierPrice: initial ? parseFloat(initial?.supplier_price) : null,
      cover: initial?.cover ?? null,
      tva: initial ? parseFloat(initial?.tva) : null,
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
      subshop:
        (initial as ShopItemTemplate)?.sub_shop_template ??
        (initial as ShopItem)?.subshop ??
        null,
      bookkeepingAccount: initial?.bookkeeping_account ?? null,
    }),
    [initial],
  );

  const [formStep, setFormStep] = useState<ShopItemFormStep>(
    ShopItemFormStep.PRODUCT,
  );

  const handlePreviousStep = useCallback(() => {
    setFormStep(ShopItemFormStep.PRODUCT);
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
          subtitle: values.subtitle || '',
          price: values.price,
          supplier_price: values.supplierPrice.toString(),
          ...(!!values.cover &&
            typeof values.cover !== 'string' && { cover: values.cover }),
          tva: values.tva.toString(),
          description: values.description || '',
          barcode: values.barcode,
          marketplace_enabled: values.marketplaceEnabled,
          'available_payment_method_identifiers[]': JSON.stringify(
            values.availablePaymentMethodIdentifiers,
          ),
          ...(!!values.bookkeepingAccount && {
            bookkeeping_account: values.bookkeepingAccount,
          }),
          featured: values.featured,
          sell_only_on_provision: values.sellOnlyOnProvision,
          is_deliverable: values.isDeliverable,
          ...(!!values.subshop && { subshop: values.subshop }),
          stock_keeping_unit: values.stockKeepingUnit || '',
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

  const getVariantStepSubmitLabel = useCallback(
    (
      colors: OptionsType<ShopItemVariantOption>,
      sizes: OptionsType<ShopItemVariantOption>,
    ) => {
      const shopItemVariantCombinationList =
        generateShopitemColorSizeCombinationList(
          (colors ?? []).map((color) => color.value),
          (sizes ?? []).map((size) => size.value),
        );
      return shopItemVariantCombinationList.length
        ? t('saveProductWithVariantCount', {
            count: shopItemVariantCombinationList.length,
          })
        : '';
    },
    [t],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={shopItemFormValidationSchema[formStep]}
    >
      {({ values }) => (
        <Form noValidate className={classes.form}>
          {formStep === ShopItemFormStep.PRODUCT && (
            <ShopItemFormProductStep
              bookkeepingAccountById={bookkeepingAccountById}
              bookkeepingAccounts={bookkeepingAccounts}
              handleCancel={handleCancel}
              initialValues={initialValues}
              isEditForm={isEditForm}
              isLoading={isLoading}
              provincialTax={provincialTax}
              supplierList={supplierList}
            />
          )}
          {formStep === ShopItemFormStep.VARIANT && (
            <ShopItemFormVariantStep
              handlePreviousStep={handlePreviousStep}
              submitLabel={getVariantStepSubmitLabel(
                values.colors,
                values.sizes,
              )}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));

export default React.memo(ShopItemFormReworked);
