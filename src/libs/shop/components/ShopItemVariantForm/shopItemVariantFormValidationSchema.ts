import * as Yup from 'yup';

export const shopItemVariantFormValidationSchema = Yup.object().shape({
  colors: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('common:requiredField'),
      value: Yup.string().required('common:requiredField'),
    }),
  ),
  sizes: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('common:requiredField'),
      value: Yup.string().required('common:requiredField'),
    }),
  ),
});
