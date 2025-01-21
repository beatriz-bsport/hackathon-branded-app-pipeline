import React, { useState, useCallback } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { BOOKING_FOR_GUEST_FREQUENCY } from '#src/libs/offer/types';
import {
  AddGuestFormInitialStep,
  AddGuestFormEmailWarningStep,
} from './FormSteps';
import {
  AddGuestFormStep,
  AddGuestValidationShema,
  type AddGuestFormValues,
} from '.';

import './styles.css';

const initialValues: AddGuestFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export type ComponentProps = {
  bookingGuestRemainingCount: number;
  bookingGuestFrequency: BOOKING_FOR_GUEST_FREQUENCY;
  onCancel: () => void;
  onSubmit: (values: AddGuestFormValues) => void;
};

const MarketplaceBookingAddGuestModal: React.FC<ComponentProps> = ({
  bookingGuestRemainingCount,
  bookingGuestFrequency,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation('booking');
  const [formStep, setFormStep] = useState<AddGuestFormStep>(
    AddGuestFormStep.INITIAL,
  );

  const handleSubmit = useCallback(
    async (
      values: AddGuestFormValues,
      actions: FormikHelpers<AddGuestFormValues>,
    ) => {
      const formErrors = await actions.validateForm();
      const isFormValid = Object.values(formErrors).length === 0;

      if (!isFormValid) return;
      if (!values.email && formStep === AddGuestFormStep.INITIAL) {
        setFormStep(AddGuestFormStep.EMAIL_WARNING);
      } else {
        onSubmit(values);
      }
    },
    [formStep, onSubmit],
  );

  const getGuestBookingLeftTranslation = () => {
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
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={AddGuestValidationShema}
    >
      <div className="bs-booking-add-guest-modal__backdrop">
        <Form
          noValidate
          className="bs-booking-add-guest-modal__form"
          data-testid="add-guest-form"
        >
          <div
            className={clsx('bs-booking-add-guest-modal__container', {
              'bs-booking-add-guest-modal-warning__container':
                formStep === AddGuestFormStep.EMAIL_WARNING,
            })}
          >
            {formStep === AddGuestFormStep.INITIAL && (
              <AddGuestFormInitialStep
                bookingGuestRemainingText={getGuestBookingLeftTranslation()}
                onCancel={onCancel}
              />
            )}

            {formStep === AddGuestFormStep.EMAIL_WARNING && (
              <AddGuestFormEmailWarningStep />
            )}
          </div>
        </Form>
      </div>
    </Formik>
  );
};

export const MarketplaceBookingAddGuestModalForStorybook = marketplaceCssHoc()(
  MarketplaceBookingAddGuestModal,
);

export default React.memo(MarketplaceBookingAddGuestModal);
