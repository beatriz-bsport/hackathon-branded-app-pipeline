import * as Yup from 'yup';

const shopItemInventoryBulkFormValidationSchema = Yup.object().shape({
  variants: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(false),
      color: Yup.string().nullable(true),
      size: Yup.string().nullable(true),
      currentStock: Yup.number(),
      stockAdjustment: Yup.number().nullable(true),
      totalSales: Yup.number(),
    }),
  ),
});

export default shopItemInventoryBulkFormValidationSchema;
