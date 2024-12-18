import React from 'react';
import { Form } from 'formik';

import {
  InviteBookingGuestFormInitialStep,
  InviteBookingGuestFormEmailWarningStep,
} from './FormSteps';

import { InviteBookingGuestFormStepEnum } from '.';

import './styles.css';

export type Props = {
  formStep: InviteBookingGuestFormStepEnum;
};

const InviteBookingGuestForm: React.FC<Props> = ({ formStep }) => {
  return (
    <Form
      noValidate
      className="bs-invite-booking-guest-modal__modal-dialog__form"
    >
      {formStep === InviteBookingGuestFormStepEnum.INITIAL && (
        <InviteBookingGuestFormInitialStep />
      )}
      {formStep === InviteBookingGuestFormStepEnum.EMAIL_WARNING && (
        <InviteBookingGuestFormEmailWarningStep />
      )}
    </Form>
  );
};

export default React.memo(InviteBookingGuestForm);
