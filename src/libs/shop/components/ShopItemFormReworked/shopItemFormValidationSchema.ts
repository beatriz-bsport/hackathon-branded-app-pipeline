import * as Yup from 'yup';

export const shopItemFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('common:requiredField')
    .max(200, 'shop:shopitem.form.error.name'),
  subtitle: Yup.string(),
  price: Yup.number().required('common:requiredField'),
  supplierPrice: Yup.number().required('common:requiredField'),
  cover: Yup.mixed().nullable(),
  tva: Yup.number().required('common:requiredField'),
  description: Yup.string(),
  barcode: Yup.string(),
  stockKeepingUnit: Yup.string(),
  marketplaceEnabled: Yup.boolean().required('common:requiredField'),
  availablePaymentMethodIdentifiers: Yup.array().of(Yup.number()),
  featured: Yup.boolean().required('common:requiredField'),
  sellOnlyOnProvision: Yup.boolean().required('common:requiredField'),
  isDeliverable: Yup.boolean().required('common:requiredField'),
});
