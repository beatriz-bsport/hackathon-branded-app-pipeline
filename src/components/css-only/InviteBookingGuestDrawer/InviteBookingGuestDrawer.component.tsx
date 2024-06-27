import React, { useState, useCallback } from 'react';
import { Formik, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#src/components/css-only/Fabrique/BottomDrawer';
import InviteBookingGuestForm, {
  inviteBookingGuestFormValidationSchema,
  InviteBookingGuestFormValues,
  InviteBookingGuestFormStepEnum,
} from '#src/components/css-only/InviteBookingGuestForm';

import { BOOKING_FOR_GUEST_FREQUENCY } from '#src/libs/offer/types';

import './styles.css';

const initialValues: InviteBookingGuestFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export type Props = {
  isOpen?: boolean;
  bookingGuestRemainingCount: number;
  bookingGuestFrequency: BOOKING_FOR_GUEST_FREQUENCY;
  onClose: () => void;
  onSubmit: (values: InviteBookingGuestFormValues) => void;
};

const InviteBookingGuestModal: React.FC<Props> = ({
  isOpen,
  bookingGuestRemainingCount,
  bookingGuestFrequency,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation(['booking', 'common']);

  const [formStep, setFormStep] = useState<InviteBookingGuestFormStepEnum>(
    InviteBookingGuestFormStepEnum.INITIAL,
  );

  const handleSubmit = useCallback(
    (
        values: InviteBookingGuestFormValues,
        validateForm: () => Promise<FormikErrors<InviteBookingGuestFormValues>>,
      ) =>
      async () => {
        const formErrors = await validateForm();
        const isFormValid = Object.values(formErrors).length === 0;

        if (!isFormValid) return;
        if (
          formStep === InviteBookingGuestFormStepEnum.INITIAL &&
          !values.email
        ) {
          setFormStep(InviteBookingGuestFormStepEnum.EMAIL_WARNING);
        } else {
          onSubmit(values);
        }
      },
    [formStep, onSubmit],
  );

  const handleCancel = useCallback(() => {
    switch (formStep) {
      case InviteBookingGuestFormStepEnum.INITIAL:
        onClose();
        break;
      case InviteBookingGuestFormStepEnum.EMAIL_WARNING:
        setFormStep(InviteBookingGuestFormStepEnum.INITIAL);
        break;
      default:
    }
  }, [formStep, onClose]);

  const emptyFn = () => {};

  const guestBookingCountLeftInformation = (() => {
    switch (bookingGuestFrequency) {
      case BOOKING_FOR_GUEST_FREQUENCY.WEEK:
        return t('booking:offer.bookingForAGuest.addGuestNumberLeftWeek', {
          count: bookingGuestRemainingCount,
        });
      case BOOKING_FOR_GUEST_FREQUENCY.MONTH:
        return t('booking:offer.bookingForAGuest.addGuestNumberLeftMonth', {
          count: bookingGuestRemainingCount,
        });
      case BOOKING_FOR_GUEST_FREQUENCY.YEAR:
        return t('booking:offer.bookingForAGuest.addGuestNumberLeftYear', {
          count: bookingGuestRemainingCount,
        });
      default:
        return t('booking:offer.bookingForAGuest.addGuestNumberLeftGeneric', {
          count: bookingGuestRemainingCount,
        });
    }
  })();

  const modalDialogTitle = (() => {
    switch (formStep) {
      case InviteBookingGuestFormStepEnum.INITIAL:
        return t('booking:guest.form.dialog.title', {
          count: bookingGuestRemainingCount,
        });
      case InviteBookingGuestFormStepEnum.EMAIL_WARNING:
        return t('booking:guest.form.dialog.emailWarning.title');
      default:
        return '';
    }
  })();

  const modalDialogSubtitle = (() => {
    switch (formStep) {
      case InviteBookingGuestFormStepEnum.INITIAL:
        return guestBookingCountLeftInformation;
      case InviteBookingGuestFormStepEnum.EMAIL_WARNING:
        return t('booking:guest.form.dialog.emailWarning.description');
      default:
        return '';
    }
  })();

  const cancelLabel = (() => {
    switch (formStep) {
      case InviteBookingGuestFormStepEnum.INITIAL:
        return t('common:cancel');
      case InviteBookingGuestFormStepEnum.EMAIL_WARNING:
        return t('common:back');
      default:
        return '';
    }
  })();

  const getConfirmLabel = (emailValue?: string, emailError?: string) => {
    switch (formStep) {
      case InviteBookingGuestFormStepEnum.INITIAL:
        return t('booking:offer.bookingForAGuest.sendInvitation');
      case InviteBookingGuestFormStepEnum.EMAIL_WARNING:
        return !!emailValue && !emailError
          ? t('common:send')
          : t('booking:guest.form.dialog.emailWarning.submitLabel');
      default:
        return '';
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={emptyFn}
      validationSchema={inviteBookingGuestFormValidationSchema[formStep]}
    >
      {({ values, errors, validateForm }) => (
        <BottomDrawer
          blanketProps={{ isOpen, onClick: onClose }}
          className="bs-consumer-booking-spot-scheduling-drawer__root"
          modalDialogProps={{
            title: modalDialogTitle,
            subtitle: modalDialogSubtitle,
            cancelLabel,
            confirmLabel: getConfirmLabel(values.email, errors.email),
            onClose: onClose,
            onCancel: handleCancel,
            onConfirm: handleSubmit(values, validateForm),
          }}
        >
          <InviteBookingGuestForm formStep={formStep} />
        </BottomDrawer>
      )}
    </Formik>
  );
};

export default React.memo(InviteBookingGuestModal);
