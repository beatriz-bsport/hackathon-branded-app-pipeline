import * as Yup from 'yup';

export const shopItemVariantFormValidationSchema = Yup.object().shape({
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
