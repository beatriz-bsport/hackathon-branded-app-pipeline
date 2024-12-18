import * as Yup from 'yup';

const shopItemVariantBulkFormValidationSchema = Yup.object().shape({
  variants: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(false),
      cover: Yup.mixed(),
      color: Yup.string().nullable(),
      size: Yup.string().nullable(),
      price: Yup.number().required().positive(),
      supplierPrice: Yup.number().required().positive(),
      stockKeepingUnit: Yup.string().nullable(),
      barcode: Yup.string().nullable(),
      marketplaceEnabled: Yup.boolean().nullable(false),
    }),
  ),
});

export default shopItemVariantBulkFormValidationSchema;
