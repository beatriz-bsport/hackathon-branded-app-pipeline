import * as Yup from 'yup';

const ConsumerExtensionCreateFormValidationSchema = Yup.object().shape({
  extensionOption: Yup.string()
    .oneOf(['numericInput', 'datePicker'])
    .required('extension.error.extensionOption'),
  nbDays: Yup.number()
    .required('massExtension.error.nbDays')
    .positive('massExtension.error.nbDays'),
  note: Yup.string().max(500),
});

export default ConsumerExtensionCreateFormValidationSchema;
