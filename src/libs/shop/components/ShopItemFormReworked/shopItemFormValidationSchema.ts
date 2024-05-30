import * as Yup from 'yup';
import { ShopItemFormStep } from './types';

const shopItemFormProductStepValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('common:requiredField')
    .max(200, 'shop:shopitem.form.error.name'),
  subtitle: Yup.string(),
  price: Yup.number()
    .typeError('common:requiredField')
    .required('common:requiredField'),
  supplierPrice: Yup.number()
    .typeError('common:requiredField')
    .required('common:requiredField'),
  cover: Yup.mixed().nullable(),
  tva: Yup.number()
    .required('common:requiredField')
    .typeError('common:requiredField'),
  description: Yup.string(),
  barcode: Yup.string(),
  stockKeepingUnit: Yup.string(),
  marketplaceEnabled: Yup.boolean().required('common:requiredField'),
  availablePaymentMethodIdentifiers: Yup.array().of(Yup.number()),
  featured: Yup.boolean().required('common:requiredField'),
  sellOnlyOnProvision: Yup.boolean().required('common:requiredField'),
  isDeliverable: Yup.boolean().required('common:requiredField'),
  supplier: Yup.number().nullable(true),
  bookkeepingAccount: Yup.number().nullable().notRequired(),
});

/** Exclusively reserved for franchise when creating a shop item template */
export const franchiseCompanyListFieldSchemaValidation = Yup.object()
  .shape({
    franchiseCompanyList: Yup.array().of(
      Yup.object().shape({
        label: Yup.string(),
        value: Yup.string(),
      }),
    ),
  })
  .required('common:requiredField');

const shopItemTemplateFormProductStepValidationSchema =
  shopItemFormProductStepValidationSchema.concat(
    franchiseCompanyListFieldSchemaValidation,
  );

const shopItemFormVariantStepValidationSchema = Yup.object().shape({
  colors: Yup.array().of(
    Yup.object().shape({
      label: Yup.string()
        .required('common:requiredField')
        .max(100, 'shop:shopItem.form.error.colorSize'),
      value: Yup.string()
        .required('common:requiredField')
        .max(100, 'shop:shopItem.form.error.colorSize'),
    }),
  ),
  sizes: Yup.array().of(
    Yup.object().shape({
      label: Yup.string()
        .required('common:requiredField')
        .max(100, 'shop:shopItem.form.error.colorSize'),
      value: Yup.string()
        .required('common:requiredField')
        .max(100, 'shop:shopItem.form.error.colorSize'),
    }),
  ),
});

export const getShopItemFormValidationSchema = (
  step: ShopItemFormStep,
  isFranchise?: boolean,
) => {
  switch (step) {
    case ShopItemFormStep.PRODUCT:
      return isFranchise
        ? shopItemTemplateFormProductStepValidationSchema
        : shopItemFormProductStepValidationSchema;
    case ShopItemFormStep.VARIANT:
      return shopItemFormVariantStepValidationSchema;
    default:
      return {};
  }
};

export default {
  [ShopItemFormStep.PRODUCT]: shopItemFormProductStepValidationSchema,
  [ShopItemFormStep.VARIANT]: shopItemFormVariantStepValidationSchema,
};
