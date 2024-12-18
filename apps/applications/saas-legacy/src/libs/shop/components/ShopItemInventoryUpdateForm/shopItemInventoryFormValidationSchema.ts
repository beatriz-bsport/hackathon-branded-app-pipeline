import * as Yup from 'yup';

const shopItemInventoryFormValidationSchema = Yup.object().shape({
  currentStock: Yup.number(),
  stockAdjustment: Yup.number().required(),
  totalSales: Yup.number(),
});

export default shopItemInventoryFormValidationSchema;
