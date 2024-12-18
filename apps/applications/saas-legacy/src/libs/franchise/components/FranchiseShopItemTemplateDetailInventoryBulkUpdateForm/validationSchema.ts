import * as Yup from 'yup';

const franchiseShopItemTemplateDetailInventoryBulkFormValidationSchema =
  Yup.object().shape({
    instances: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().nullable(false),
        color: Yup.string().nullable(true),
        size: Yup.string().nullable(true),
        currentStock: Yup.number(),
        companyName: Yup.string(),
        stockAdjustment: Yup.number().nullable(true),
        totalSales: Yup.number(),
      }),
    ),
  });

export default franchiseShopItemTemplateDetailInventoryBulkFormValidationSchema;
