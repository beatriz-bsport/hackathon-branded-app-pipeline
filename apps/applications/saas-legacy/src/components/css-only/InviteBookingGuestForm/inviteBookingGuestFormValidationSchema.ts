import * as Yup from 'yup';

import { emailValidationRegExp } from '#src/libs/custom-form/constants';
import { InviteBookingGuestFormStepEnum } from './constants';

const inviteBookingGuestFormInitialStepSchema = Yup.object().shape({
  firstName: Yup.string().required('booking:guest.form.errors.requiredField'),
  lastName: Yup.string().nullable(),
  email: Yup.string()
    .matches(emailValidationRegExp, 'booking:guest.form.errors.email')
    .nullable(),
});

const inviteBookingGuestFormWarningStepSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailValidationRegExp, 'booking:guest.form.errors.email')
    .nullable(),
});

export default {
  [InviteBookingGuestFormStepEnum.INITIAL]:
    inviteBookingGuestFormInitialStepSchema,
  [InviteBookingGuestFormStepEnum.EMAIL_WARNING]:
    inviteBookingGuestFormWarningStepSchema,
};
