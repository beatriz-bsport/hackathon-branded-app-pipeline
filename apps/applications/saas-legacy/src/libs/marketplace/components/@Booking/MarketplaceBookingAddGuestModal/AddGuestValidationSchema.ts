import * as Yup from 'yup';

import { emailValidationRegExp } from '#src/libs/custom-form/constants';

const AddGuestValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('booking:guest.form.errors.requiredField'),
  lastName: Yup.string().nullable(),
  email: Yup.string()
    .matches(emailValidationRegExp, 'booking:guest.form.errors.email')
    .nullable(),
});

export default AddGuestValidationSchema;
