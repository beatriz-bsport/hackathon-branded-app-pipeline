import * as Yup from 'yup';

const MassExtensionCreateFormValidationSchema = Yup.object().shape({
  minEndingDate: Yup.string().required('massExtension.error.minEndingDate'),
  maxEndingDate: Yup.string().required('massExtension.error.maxEndingDate'),
  nbDays: Yup.number()
    .required('massExtension.error.nbDays')
    .positive('massExtension.error.nbDays'),
  note: Yup.string().max(500),
});

export default MassExtensionCreateFormValidationSchema;
