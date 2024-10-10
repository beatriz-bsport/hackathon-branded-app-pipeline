import * as Yup from 'yup';

const WellhubProductSelectionValidationSchema = Yup.object().shape({
  wellhubProductId: Yup.number()
    .nullable()
    .typeError('offer:form.errors.required')
    .positive('offer:form.errors.positiveNumber')
    .required('offer:form.errors.field.wellhubProductMissing'),
});

export default WellhubProductSelectionValidationSchema;
