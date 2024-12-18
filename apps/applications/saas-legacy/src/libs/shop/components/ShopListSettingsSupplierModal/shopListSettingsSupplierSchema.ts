import * as Yup from 'yup';

const shopListSettingsSupplierSchema = Yup.object().shape({
  name: Yup.string()
    .typeError('common:requiredField')
    .required('common:requiredField'),
  description: Yup.string().typeError('common:requiredField').nullable(true),
});

export default shopListSettingsSupplierSchema;
